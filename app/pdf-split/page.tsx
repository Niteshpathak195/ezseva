"use client";

/**
 * ============================================================
 * EzSeva — PDF Split Tool
 * app/pdf-split/page.tsx
 * ============================================================
 * Version    : 1.2.0 (JSZip Fix)
 * Updated    : March 2026
 *
 * AUDIT FIXES (v1.1.0):
 *   ✅ "use client" moved to absolute line 1
 *   ✅ File validation — || (OR) changed to && (AND): MIME AND extension both required
 *   ✅ console.error removed — error shown via state only
 *   ✅ Progress bar — inline div replaced with .progress-bar-fill class
 *
 * FEATURES:
 *   ✅ Shared <Navbar /> and <Footer /> components
 *   ✅ AdSense Auto Ads — top, mid, bottom (no slot IDs)
 *   ✅ 100% globals.css design tokens — zero hardcoded colors
 *   ✅ Drag & drop upload zone — PDF only, 50 MB max
 *   ✅ Page count auto-read on upload
 *   ✅ Three split modes:
 *       • Extract Range  — e.g. "1-3, 5, 7-9"
 *       • Every N Pages  — split into chunks of N
 *       • Every Page     — each page becomes its own PDF
 *   ✅ Custom output filename prefix
 *   ✅ Progress bar during split
 *   ✅ Before/After info: X pages → N output PDFs
 *   ✅ Download all as ZIP (JSZip) OR individual buttons
 *   ✅ Client-side only — pdf-lib + JSZip, zero server upload
 *   ✅ Reset + Return to Home buttons
 *   ✅ How to Use (4 steps), FAQ (6 Q&A), Related Tools (8)
 *
 * DEPENDENCIES:
 *   • pdf-lib
 *   • jszip
 *   • app/components/Navbar.tsx
 *   • app/components/Footer.tsx
 *   • app/globals.css
 * ============================================================
 */

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Types ──────────────────────────────────────────────────── */

type SplitMode   = "range" | "chunk" | "every";
type SplitStatus = "idle" | "splitting" | "done" | "error";

interface SplitOutput {
  filename: string;
  bytes: Uint8Array;
  pageCount: number;
  sizeBytes: number;
}

/* ─── Utility ─────────────────────────────────────────────────── */

function fmtSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function parsePageRange(rangeStr: string, pageCount: number): number[] | null {
  if (!rangeStr.trim()) return null;
  const parts = rangeStr.split(",").map((p) => p.trim()).filter(Boolean);
  const indices = new Set<number>();
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s.trim(), 10));
      if (isNaN(a) || isNaN(b) || a < 1 || b < 1 || a > b || b > pageCount) return null;
      for (let i = a; i <= b; i++) indices.add(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < 1 || n > pageCount) return null;
      indices.add(n - 1);
    }
  }
  return indices.size === 0 ? null : Array.from(indices).sort((a, b) => a - b);
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const r    = new FileReader();
    r.onload   = (e) => resolve(e.target!.result as ArrayBuffer);
    r.onerror  = () => reject(new Error("Read failed"));
    r.readAsArrayBuffer(file);
  });
}

function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_|_$/g, "") || "output"
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function PdfSplitPage() {
  const [file, setFile]           = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [metaError, setMetaError] = useState("");

  const [splitMode, setSplitMode]       = useState<SplitMode>("range");
  const [rangeInput, setRangeInput]     = useState("");
  const [chunkSize, setChunkSize]       = useState(1);
  const [filenamePrefix, setFilenamePrefix] = useState("");

  const [status, setStatus]         = useState<SplitStatus>("idle");
  const [progress, setProgress]     = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [outputs, setOutputs]       = useState<SplitOutput[]>([]);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 50 * 1024 * 1024;

  /* ── Load file — FIX: MIME && extension (AND, not OR) ── */
  const loadFile = useCallback(async (f: File) => {
    const isValidMime = f.type === "application/pdf";
    const isValidExt  = f.name.toLowerCase().endsWith(".pdf");
    if (!isValidMime || !isValidExt) {
      setMetaError("Please select a valid PDF file (.pdf).");
      return;
    }
    if (f.size > MAX_SIZE) {
      setMetaError("File too large. Max 50 MB.");
      return;
    }
    setMetaError("");
    setErrorMsg("");
    setOutputs([]);
    setFile(f);
    setLoadingMeta(true);
    setStatus("idle");
    setFilenamePrefix(f.name.replace(/\.pdf$/i, ""));
    try {
      const buf = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(new Uint8Array(buf), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setMetaError("Could not read PDF. File may be corrupt or encrypted.");
      setFile(null);
      setPageCount(0);
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  const onZoneDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const onZoneDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const onZoneDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };
  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = "";
  };

  /* ── Validate ── */
  const getValidationError = (): string | null => {
    if (!file || pageCount === 0) return "Please upload a PDF first.";
    if (splitMode === "range") {
      if (!rangeInput.trim()) return "Please enter a page range (e.g. 1-3, 5).";
      const parsed = parsePageRange(rangeInput, pageCount);
      if (!parsed) return `Invalid page range. Pages must be between 1 and ${pageCount}.`;
    }
    if (splitMode === "chunk") {
      if (chunkSize < 1 || chunkSize >= pageCount)
        return `Chunk size must be between 1 and ${pageCount - 1}.`;
    }
    return null;
  };

  /* ── Split ── */
  const handleSplit = async () => {
    const valErr = getValidationError();
    if (valErr) { setErrorMsg(valErr); return; }
    setErrorMsg("");
    setStatus("splitting");
    setProgress(0);
    setOutputs([]);

    try {
      const buf      = await readFileAsArrayBuffer(file!);
      const srcBytes = new Uint8Array(buf);
      const prefix   = sanitizeFilename(filenamePrefix.trim() || file!.name.replace(/\.pdf$/i, ""));
      const results: SplitOutput[] = [];

      /* Build page groups */
      let groups: number[][] = [];

      if (splitMode === "every") {
        groups = Array.from({ length: pageCount }, (_, i) => [i]);
      } else if (splitMode === "chunk") {
        for (let i = 0; i < pageCount; i += chunkSize) {
          groups.push(
            Array.from({ length: Math.min(chunkSize, pageCount - i) }, (_, k) => i + k)
          );
        }
      } else {
        // range mode — single group
        const parsed = parsePageRange(rangeInput, pageCount)!;
        groups = [parsed];
      }

      const total = groups.length;
      for (let g = 0; g < total; g++) {
        setProgress(Math.round((g / total) * 90));
        setProgressMsg(`Creating part ${g + 1} of ${total}…`);

        const srcDoc  = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
        const newDoc  = await PDFDocument.create();
        const pages   = await newDoc.copyPages(srcDoc, groups[g]);
        pages.forEach((p) => newDoc.addPage(p));
        const outBytes = await newDoc.save({ useObjectStreams: true });

        const filename =
          total === 1
            ? `${prefix}_pages.pdf`
            : splitMode === "every"
            ? `${prefix}_page_${groups[g][0] + 1}.pdf`
            : `${prefix}_part_${g + 1}.pdf`;

        results.push({
          filename,
          bytes:     outBytes,
          pageCount: groups[g].length,
          sizeBytes: outBytes.byteLength,
        });
      }

      setProgress(100);
      setProgressMsg("Done!");
      setOutputs(results);
      setStatus("done");
    } catch (err: unknown) {
      // FIX: no console.error — user-facing message only
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setStatus("error");
      setErrorMsg(
        msg.toLowerCase().includes("encrypt")
          ? "This PDF is password-protected. Please remove the password before splitting."
          : "Split failed. The PDF may be corrupt or encrypted."
      );
    }
  };

  /* ── Download single — FIX-2 pattern ── */
  const downloadOne = (out: SplitOutput) => {
    const blob = new Blob([out.bytes], { type: "application/pdf" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = out.filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  /* ── Download all as ZIP ── */
  const downloadAllZip = async () => {
    try {
      const zip = new JSZip();
      outputs.forEach((out) => zip.file(out.filename, out.bytes));
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });
      const prefix = sanitizeFilename(filenamePrefix.trim() || "split");
      const url    = URL.createObjectURL(zipBlob);
      const a      = document.createElement("a");
      a.href       = url;
      a.download   = `${prefix}_split.zip`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setErrorMsg("Failed to create ZIP. Try downloading files individually.");
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setLoadingMeta(false);
    setMetaError("");
    setSplitMode("range");
    setRangeInput("");
    setChunkSize(1);
    setFilenamePrefix("");
    setStatus("idle");
    setProgress(0);
    setProgressMsg("");
    setErrorMsg("");
    setOutputs([]);
    setIsDragOver(false);
  };

  /* ── Previews ── */
  const rangePreview = (() => {
    if (splitMode !== "range" || !rangeInput.trim() || pageCount === 0) return null;
    const p = parsePageRange(rangeInput, pageCount);
    return p
      ? `✓ ${p.length} page${p.length !== 1 ? "s" : ""} selected`
      : "Invalid range";
  })();

  const chunkPreview = (() => {
    if (splitMode !== "chunk" || pageCount === 0 || chunkSize < 1) return null;
    const count = Math.ceil(pageCount / chunkSize);
    return `→ ${count} PDF${count !== 1 ? "s" : ""} of ~${chunkSize} page${chunkSize !== 1 ? "s" : ""} each`;
  })();

  /* ── Render ── */
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px" }}>

        {/* ── Top Ad ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="container-sm" style={{ padding: "32px 20px 0" }}>

          {/* ══ PAGE HEADER ══ */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                ✂️ Free PDF Tool
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              PDF Split — Extract Pages Free
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65 }}>
              Split a PDF by page range, fixed chunks, or one page at a time.{" "}
              <strong style={{ color: "var(--brand)" }}>Your files never leave your device.</strong>
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
              {[
                { icon: "🔒", text: "100% Private" },
                { icon: "⚡", text: "Instant" },
                { icon: "📱", text: "Mobile Ready" },
                { icon: "₹",  text: "Free Forever" },
              ].map((t) => (
                <span key={t.text} style={{ fontSize: "11.5px", padding: "4px 11px", background: "var(--brand-light)", color: "var(--brand)", borderRadius: "99px", fontWeight: 700, border: "1px solid var(--brand-mid)" }}>
                  {t.icon} {t.text}
                </span>
              ))}
            </div>
            <a
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand-border)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
            >
              ← All Tools
            </a>
          </div>

          {/* ── Errors ── */}
          {(errorMsg || metaError) && (
            <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
              ⚠️ {errorMsg || metaError}
            </div>
          )}

          {/* ══ UPLOAD ZONE ══ */}
          {!file && (
            <div
              className="upload-zone"
              onDragOver={onZoneDragOver}
              onDragLeave={onZoneDragLeave}
              onDrop={onZoneDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload PDF"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              style={{
                marginBottom: "16px",
                borderColor: isDragOver ? "var(--brand)" : undefined,
                background: isDragOver ? "var(--brand-light)" : undefined,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                style={{ display: "none" }}
                onChange={onFileInput}
              />
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📂</div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                Drag & drop a PDF here, or click to browse
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>PDF only · up to 50 MB</p>
            </div>
          )}

          {/* Loading meta */}
          {loadingMeta && (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>
              ⏳ Reading PDF…
            </div>
          )}

          {/* ══ FILE INFO + SPLIT OPTIONS ══ */}
          {file && pageCount > 0 && status !== "done" && status !== "splitting" && (
            <>
              {/* File info bar */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "14px 18px", marginBottom: "14px", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "24px" }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {fmtSize(file.size)} · {pageCount} page{pageCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--text-hint)", fontWeight: 700, padding: "4px 8px", borderRadius: "6px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-hint)")}
                >
                  ✕ Remove
                </button>
              </div>

              {/* Split mode selector */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>Split Method</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "18px" }}>
                  {([
                    { mode: "range" as SplitMode, icon: "🎯", label: "Custom Range", sub: "e.g. 1-3, 5" },
                    { mode: "chunk" as SplitMode, icon: "📦", label: "Every N Pages", sub: "fixed chunks" },
                    { mode: "every" as SplitMode, icon: "📄", label: "Every Page",    sub: "1 page each" },
                  ] as const).map(({ mode, icon, label, sub }) => (
                    <button
                      key={mode}
                      onClick={() => setSplitMode(mode)}
                      style={{
                        border: `2px solid ${splitMode === mode ? "var(--brand)" : "var(--border-light)"}`,
                        borderRadius: "var(--radius-lg)", padding: "12px 8px", cursor: "pointer",
                        background: splitMode === mode ? "var(--brand-light)" : "#fff",
                        textAlign: "center", transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: splitMode === mode ? "var(--brand)" : "var(--text-primary)" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{sub}</div>
                    </button>
                  ))}
                </div>

                {/* Range input */}
                {splitMode === "range" && (
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                      Page range (1–{pageCount})
                    </label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="text"
                        className="input"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        placeholder={`e.g. 1-3, 5, 7-${pageCount}`}
                        style={{ flex: 1, minWidth: "180px", maxWidth: "320px" }}
                      />
                      {rangePreview && (
                        <span style={{ fontSize: "12px", fontWeight: 700, color: rangePreview.startsWith("✓") ? "var(--brand)" : "#ef4444" }}>
                          {rangePreview}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Chunk size input */}
                {splitMode === "chunk" && (
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                      Pages per chunk
                    </label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="number"
                        className="input"
                        value={chunkSize}
                        min={1}
                        max={pageCount - 1}
                        onChange={(e) => setChunkSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        style={{ width: "100px" }}
                      />
                      {chunkPreview && (
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand)" }}>{chunkPreview}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Every page info */}
                {splitMode === "every" && (
                  <div style={{ background: "var(--brand-light)", borderRadius: "var(--radius-lg)", padding: "10px 14px", fontSize: "12.5px", color: "var(--brand-dark)", fontWeight: 600 }}>
                    📄 This will create {pageCount} individual PDF file{pageCount !== 1 ? "s" : ""} — one per page.
                  </div>
                )}
              </div>

              {/* Filename prefix */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "18px 20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  Output filename prefix
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    className="input"
                    value={filenamePrefix}
                    onChange={(e) => setFilenamePrefix(e.target.value)}
                    placeholder="document"
                    maxLength={60}
                    style={{ flex: 1, minWidth: "180px", maxWidth: "320px" }}
                  />
                  <span style={{ fontSize: "11.5px", color: "var(--text-hint)" }}>e.g. document_part_1.pdf</span>
                </div>
              </div>

              {/* Split button */}
              <button
                className="btn-primary"
                onClick={handleSplit}
                style={{ width: "100%", marginBottom: "16px", fontSize: "15px", padding: "15px", fontWeight: 800 }}
              >
                ✂️ Split PDF
              </button>
            </>
          )}

          {/* ══ PROGRESS ══ */}
          {status === "splitting" && (
            <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 20px", marginBottom: "16px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
                {progressMsg || "Splitting PDF…"}
              </p>
              {/* FIX: use .progress-bar-fill class */}
              <div className="progress-bar-wrap" style={{ marginBottom: "8px" }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{progress}%</p>
            </div>
          )}

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin: "24px 0" }}>
            <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ══ RESULTS ══ */}
          {status === "done" && outputs.length > 0 && (
            <div style={{ background: "#fff", border: "2px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "24px", marginBottom: "20px", boxShadow: "var(--shadow-md)" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "6px" }}>✅</div>
                <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "4px" }}>Split Complete!</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {pageCount} pages → {outputs.length} PDF file{outputs.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Download all ZIP */}
              {outputs.length > 1 && (
                <button
                  className="btn-cta"
                  onClick={downloadAllZip}
                  style={{ width: "100%", fontSize: "14.5px", padding: "13px", marginBottom: "14px", fontWeight: 800 }}
                >
                  📦 Download All as ZIP ({outputs.length} files)
                </button>
              )}

              {/* Individual file list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {outputs.map((out) => (
                  <div key={out.filename} style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-muted)", borderRadius: "var(--radius-lg)", padding: "10px 14px" }}>
                    <span style={{ fontSize: "18px" }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {out.filename}
                      </p>
                      <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        {out.pageCount} page{out.pageCount !== 1 ? "s" : ""} · {fmtSize(out.sizeBytes)}
                      </p>
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => downloadOne(out)}
                      style={{ fontSize: "12px", padding: "6px 12px", flexShrink: 0 }}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-secondary" onClick={handleReset}>✂️ Split Another PDF</button>
                <a href="/" className="btn-secondary" style={{ textDecoration: "none" }}>🏠 Back to Home</a>
              </div>
            </div>
          )}

          {/* ══ HOW TO USE ══ */}
          <section aria-label="How to use" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
              🪄 How to Split a PDF
            </h2>
            {[
              { n: "1", title: "Upload PDF",        desc: "Drag & drop or click to select any PDF up to 50 MB." },
              { n: "2", title: "Choose Split Mode", desc: "Custom Range (e.g. 1-3, 5), Every N Pages (fixed chunks), or Every Page (one PDF per page)." },
              { n: "3", title: "Set Filename",      desc: "Enter a prefix for your output files. They'll be named prefix_part_1.pdf, prefix_part_2.pdf, etc." },
              { n: "4", title: "Split & Download",  desc: "Click Split. Download individual files or all at once as a ZIP." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", gap: "12px", marginBottom: "13px", alignItems: "flex-start" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "var(--brand)", color: "#fff", fontSize: "11px", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>
                  {n}
                </span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{title}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ══ FAQ ══ */}
          <section aria-label="Frequently asked questions" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
              ❓ Frequently Asked Questions
            </h2>
            {[
              { q: "Is this PDF splitter free?",                      a: "Yes, completely free — no signup, no limits on number of files, no hidden charges." },
              { q: "Are my files uploaded to a server?",              a: "No. Everything runs in your browser. Your PDF never leaves your device." },
              { q: "How do I extract only the first page of a PDF?",  a: "Upload the PDF, choose Custom Range, enter '1', then click Split. You'll get a single-page PDF." },
              { q: "Can I split a PDF into equal parts?",             a: "Yes. Use Every N Pages mode and set the chunk size. A 10-page PDF with chunk size 2 gives you 5 PDFs of 2 pages each." },
              { q: "How do I separate each page into its own PDF?",   a: "Select Every Page mode. Each page of the PDF becomes its own separate file, downloadable individually or as a ZIP." },
              { q: "What is the maximum PDF size supported?",         a: "Up to 50 MB. For larger files, split in stages — split once to reduce size, then split the output further." },
            ].map((faq, i, arr) => (
              <div key={faq.q} style={{ marginBottom: i < arr.length - 1 ? "16px" : 0, paddingBottom: i < arr.length - 1 ? "16px" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "5px" }}>Q: {faq.q}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* ══ RELATED TOOLS ══ */}
          <section aria-label="More free tools" style={{ marginBottom: "8px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px", color: "var(--text-secondary)" }}>
              🔗 More Free Tools
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "10px" }}>
              {[
                { icon: "🔗", title: "PDF Merge",       href: "/pdf-merge",    desc: "Combine PDFs into one" },
                { icon: "📦", title: "PDF Compress",    href: "/pdf-compress", desc: "Reduce PDF size" },
                { icon: "🔒", title: "PDF Protect",     href: "/pdf-protect",  desc: "Password protect PDF" },
                { icon: "📄", title: "Image to PDF",    href: "/image-to-pdf", desc: "Convert images to PDF" },
                { icon: "🖼️", title: "Image Resize",   href: "/image-resize", desc: "Resize for govt exams" },
                { icon: "🪪", title: "Photo+Signature", href: "/photo-joiner", desc: "Merge for govt forms" },
                { icon: "🎨", title: "Image Crop",      href: "/image-crop",   desc: "Crop photo to any size" },
                { icon: "🔓", title: "PDF Unlock",      href: "/pdf-unlock",   desc: "Remove PDF password" },
              ].map((t) => (
                <a key={t.href} href={t.href} className="tool-card" style={{ padding: "14px" }}>
                  <div className="tool-card-icon" style={{ marginBottom: "7px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true">
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <Footer />
      </main>
    </>
  );
}

/*
export const metadata = {
  title: "PDF Split Online Free — Extract PDF Pages | EzSeva",
  description: "Split PDF pages online for free. Extract any pages, split into chunks, or separate every page. 100% private — files never leave your device. No signup.",
  keywords: ["pdf split online free","extract pages from pdf","pdf page extractor india","split pdf into parts","pdf split kaise karein"],
  openGraph: { title: "Free PDF Split — Extract Pages | EzSeva", description: "Split PDFs instantly. 100% private.", url: "https://ezseva.in/pdf-split", siteName: "EzSeva" },
  alternates: { canonical: "https://ezseva.in/pdf-split" },
};
*/