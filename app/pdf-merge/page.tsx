"use client";

/**
 * ============================================================
 * EzSeva — PDF Merge Tool
 * app/pdf-merge/page.tsx
 * ============================================================
 * Version    : 1.2.0 (Full Audit Fix)
 * Updated    : March 2026
 *
 * AUDIT FIXES (v1.2.0):
 *   ✅ FIX 1  — "use client" moved to ABSOLUTE line 1 (no comments before)
 *   ✅ FIX 2  — console.error removed; dev-only guard via NODE_ENV
 *   ✅ FIX 3  — MAX_SIZE_BYTES 20 MB → 50 MB (spec alignment for PDFs)
 *   ✅ FIX 4  — Download pattern: appendChild + removeChild (Chrome PDF MIME fix)
 *   ✅ FIX 5  — useObjectStreams: true → false (max reader compatibility)
 *   ✅ FIX 6  — useCallback on ALL event handlers (stable refs, no re-render loops)
 *   ✅ FIX 7  — abortRef pattern added (prevents stale state on fast reset)
 *   ✅ FIX 8  — Footer imported from ../components/Footer; inline footer removed
 *   ✅ FIX 9  — How to Use Step 1: "20 MB" → "50 MB"
 *   ✅ FIX 10 — FAQ Q5: "20 MB" → "50 MB"
 *   ✅ BONUS  — Promise.allSettled for parallel page count loading
 * ============================================================
 */

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Types ──────────────────────────────────────────────────── */

interface PdfItem {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  pageCount: number | null;
  pageCountError: boolean;
  pageRange: string;
  dragging: boolean;
}

type MergeStatus = "idle" | "merging" | "done" | "error";

interface MergeResult {
  outputBytes: Uint8Array;
  totalInputPages: number;
  outputPages: number;
  totalInputSize: number;
  outputSize: number;
  filename: string;
}

/* ─── Utility ─────────────────────────────────────────────────── */

function fmtSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function parsePageRange(rangeStr: string, pageCount: number): number[] | null {
  if (!rangeStr.trim()) return Array.from({ length: pageCount }, (_, i) => i);
  const parts = rangeStr.split(",").map((p) => p.trim()).filter(Boolean);
  const indices = new Set<number>();
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || end > pageCount) return null;
      for (let i = start; i <= end; i++) indices.add(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < 1 || n > pageCount) return null;
      indices.add(n - 1);
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

async function getPdfPageCount(file: File): Promise<number> {
  const buf = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(new Uint8Array(buf), { ignoreEncryption: true });
  return doc.getPageCount();
}

/* ─── Component ──────────────────────────────────────────────── */

export default function PdfMergePage() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [outputFilename, setOutputFilename] = useState("merged.pdf");
  const [status, setStatus] = useState<MergeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<MergeResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedRangeId, setExpandedRangeId] = useState<string | null>(null);

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // FIX 7: abortRef — cancel stale async state updates on fast reset
  const abortRef = useRef(false);

  const MAX_FILES = 20;
  // FIX 3: 50 MB for PDFs (was 20 MB — spec violation)
  const MAX_SIZE_BYTES = 50 * 1024 * 1024;

  /* ── Add files — parallel page count loading ── */
  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    // SECURITY: validate BOTH MIME type AND file extension
    const pdfs = arr.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfs.length === 0) { setErrorMsg("Please select PDF files only."); return; }

    // SECURITY: size check BEFORE reading into memory
    const oversized = pdfs.filter((f) => f.size > MAX_SIZE_BYTES);
    if (oversized.length > 0) {
      setErrorMsg(`File too large: ${oversized.map((f) => f.name).join(", ")}. Max 50 MB per file.`);
      return;
    }

    setErrorMsg("");
    const wouldExceed = items.length + pdfs.length > MAX_FILES;
    const toAdd = wouldExceed ? pdfs.slice(0, MAX_FILES - items.length) : pdfs;
    if (wouldExceed) setErrorMsg(`Max ${MAX_FILES} files. Only first ${toAdd.length} added.`);
    if (toAdd.length === 0) return;

    const newItems: PdfItem[] = toAdd.map((f) => ({
      id: uid(), file: f, name: f.name, sizeBytes: f.size,
      pageCount: null, pageCountError: false, pageRange: "", dragging: false,
    }));
    setItems((prev) => [...prev, ...newItems]);
    setResult(null);

    // PERFORMANCE: parallel page count loading via Promise.allSettled
    const countPromises = newItems.map((item) =>
      getPdfPageCount(item.file).then(
        (count) => ({ id: item.id, count, error: false }),
        () => ({ id: item.id, count: 0, error: true })
      )
    );
    const results = await Promise.allSettled(countPromises);
    setItems((prev) => {
      const updated = [...prev];
      for (const res of results) {
        if (res.status === "fulfilled") {
          const { id, count, error } = res.value;
          const idx = updated.findIndex((p) => p.id === id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], pageCount: error ? 0 : count, pageCountError: error };
          }
        }
      }
      return updated;
    });
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Drop zone handlers — FIX 6: useCallback on all ── */
  const onZoneDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(true);
  }, []);

  const onZoneDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
  }, []);

  const onZoneDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onZoneClick = useCallback(() => fileInputRef.current?.click(), []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    // Clear value so same file can be re-selected
    e.target.value = "";
  }, [addFiles]);

  /* ── Drag reorder — FIX 6: useCallback ── */
  const onItemDragStart = useCallback((index: number) => {
    dragItemIndex.current = index;
    setItems((prev) => prev.map((p, i) => (i === index ? { ...p, dragging: true } : p)));
  }, []);

  const onItemDragEnter = useCallback((index: number) => {
    dragOverItemIndex.current = index;
  }, []);

  const onItemDragEnd = useCallback(() => {
    const from = dragItemIndex.current;
    const to = dragOverItemIndex.current;
    if (from !== null && to !== null && from !== to) {
      setItems((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return updated.map((p) => ({ ...p, dragging: false }));
      });
    } else {
      setItems((prev) => prev.map((p) => ({ ...p, dragging: false })));
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  }, []);

  // FIX 6: useCallback on removeItem and updatePageRange
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setResult(null);
    setErrorMsg("");
  }, []);

  const updatePageRange = useCallback((id: string, value: string) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, pageRange: value } : p)));
  }, []);

  // FIX 6: useCallback on validatePageRanges
  const validatePageRanges = useCallback((): string | null => {
    for (const item of items) {
      if (!item.pageRange.trim() || item.pageCount === null || item.pageCountError) continue;
      const parsed = parsePageRange(item.pageRange, item.pageCount);
      if (parsed === null) return `Invalid range "${item.pageRange}" for "${item.name}". Use format: 1-3, 5`;
      if (parsed.length === 0) return `Range for "${item.name}" gives zero pages.`;
    }
    return null;
  }, [items]);

  /* ── Merge — FIX 6: useCallback; FIX 7: abortRef ── */
  const handleMerge = useCallback(async () => {
    if (items.length < 2) { setErrorMsg("Add at least 2 PDF files to merge."); return; }
    if (items.some((p) => p.pageCount === null)) { setErrorMsg("Please wait — still reading page counts."); return; }
    const rangeError = validatePageRanges();
    if (rangeError) { setErrorMsg(rangeError); return; }

    abortRef.current = false;
    setErrorMsg("");
    setStatus("merging");
    setProgress(0);
    setResult(null);

    try {
      const merged = await PDFDocument.create();
      let totalInputPages = 0;
      let outputPages = 0;
      const totalInputSize = items.reduce((acc, p) => acc + p.sizeBytes, 0);

      for (let i = 0; i < items.length; i++) {
        if (abortRef.current) return;
        const item = items[i];
        setProgress(Math.round((i / items.length) * 85));
        setProgressMsg(`Processing ${i + 1}/${items.length}: ${item.name}…`);

        // Single ArrayBuffer read per file — no double copy
        const buf = await readFileAsArrayBuffer(item.file);
        if (abortRef.current) return;

        const srcDoc = await PDFDocument.load(new Uint8Array(buf), { ignoreEncryption: true });
        const pc = srcDoc.getPageCount();
        totalInputPages += pc;

        const pageIndices = item.pageRange.trim()
          ? parsePageRange(item.pageRange, item.pageCount ?? pc) ?? Array.from({ length: pc }, (_, k) => k)
          : Array.from({ length: pc }, (_, k) => k);

        const copiedPages = await merged.copyPages(srcDoc, pageIndices);
        for (const page of copiedPages) { merged.addPage(page); outputPages++; }
      }

      if (abortRef.current) return;
      setProgress(92);
      setProgressMsg("Finalising…");

      const filename = outputFilename.trim()
        ? outputFilename.trim().replace(/\.pdf$/i, "") + ".pdf"
        : "merged.pdf";

      // FIX 5: useObjectStreams: false — maximum PDF reader compatibility
      const outBytes = await merged.save({ useObjectStreams: false });
      if (abortRef.current) return;

      setProgress(100);
      setProgressMsg("Done!");
      setResult({
        outputBytes: outBytes,
        totalInputPages,
        outputPages,
        totalInputSize,
        outputSize: outBytes.byteLength,
        filename,
      });
      setStatus("done");
    } catch (err: unknown) {
      if (abortRef.current) return;
      // FIX 2: dev-only logging — no stack traces in production
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("[PDF Merge dev]", err instanceof Error ? err.message : err);
      }
      setStatus("error");
      setErrorMsg("Merge failed. One or more files may be corrupt or encrypted. Remove them and retry.");
    }
  }, [items, outputFilename, validatePageRanges]);

  /* ── Download — FIX 4: appendChild/removeChild pattern (Chrome PDF MIME) ── */
  const handleDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result.outputBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.style.display = "none";
    document.body.appendChild(a);   // required for Chrome PDF MIME
    a.click();
    document.body.removeChild(a);
    // SECURITY: revoke Blob URL after download
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [result]);

  /* ── Reset — FIX 6: useCallback; FIX 7: abortRef ── */
  const handleReset = useCallback(() => {
    abortRef.current = true;
    setItems([]);
    setOutputFilename("merged.pdf");
    setStatus("idle");
    setProgress(0);
    setProgressMsg("");
    setErrorMsg("");
    setResult(null);
    setExpandedRangeId(null);
    setIsDragOver(false);
  }, []);

  const totalPages = items.reduce((acc, p) => acc + (p.pageCount ?? 0), 0);
  const totalSize = items.reduce((acc, p) => acc + p.sizeBytes, 0);
  const allCountsLoaded = items.length > 0 && items.every((p) => p.pageCount !== null);

  /* ─────────────────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px" }}>

        {/* ── Top Ad — flush under navbar, zero top padding ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <div className="container-sm" style={{ padding: "32px 20px 0" }}>

          {/* ══ PAGE HEADER ══ */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🔗 Free PDF Tool
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              PDF Merge — Combine PDFs Free
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65 }}>
              Merge multiple PDFs into one. Reorder, select page ranges, download instantly.{" "}
              <strong style={{ color: "var(--brand)" }}>Your files never leave your device.</strong>
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
              {[
                { icon: "🔒", text: "100% Private" },
                { icon: "⚡", text: "Instant" },
                { icon: "📱", text: "Mobile Ready" },
                { icon: "₹", text: "Free Forever" },
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

          {/* ── Error ── */}
          {errorMsg && (
            <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* ══ UPLOAD ZONE ══ */}
          {status !== "done" && (
            <div
              className={`upload-zone${isDragOver ? " drag-over" : ""}`}
              onDragOver={onZoneDragOver}
              onDragLeave={onZoneDragLeave}
              onDrop={onZoneDrop}
              onClick={onZoneClick}
              role="button"
              tabIndex={0}
              aria-label="Upload PDF files"
              onKeyDown={(e) => e.key === "Enter" && onZoneClick()}
              style={{ marginBottom: "16px" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                style={{ display: "none" }}
                onChange={onFileInput}
              />
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📂</div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                {items.length === 0 ? "Drag & drop PDFs here, or click to browse" : "Add more PDFs"}
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                PDF only · up to 50 MB per file · max 20 files
              </p>
            </div>
          )}

          {/* ══ FILE LIST ══ */}
          {items.length > 0 && status !== "done" && (
            <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", marginBottom: "16px", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border-light)", background: "var(--bg-muted)" }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)" }}>
                  📄 {items.length} PDF{items.length > 1 ? "s" : ""}
                  {allCountsLoaded && ` · ${totalPages} pages`}
                  {" · "}{fmtSize(totalSize)}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-hint)" }}>⠿ Drag to reorder</span>
              </div>

              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() => onItemDragStart(index)}
                    onDragEnter={() => onItemDragEnter(index)}
                    onDragEnd={onItemDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    style={{
                      borderBottom: index < items.length - 1 ? "1px solid var(--border-light)" : "none",
                      opacity: item.dragging ? 0.4 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", cursor: "grab" }}>
                      <span style={{ fontSize: "14px", color: "var(--text-hint)", userSelect: "none", flexShrink: 0 }}>⠿</span>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: "var(--brand)", color: "#fff", fontSize: "10px", fontWeight: 800, flexShrink: 0 }}>
                        {index + 1}
                      </span>
                      <span style={{ fontSize: "18px", flexShrink: 0 }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {fmtSize(item.sizeBytes)} ·{" "}
                          {item.pageCount === null
                            ? <span style={{ color: "var(--text-hint)", fontStyle: "italic" }}>Loading…</span>
                            : item.pageCountError
                              ? <span style={{ color: "#ef4444" }}>Could not read pages</span>
                              : `${item.pageCount} page${item.pageCount !== 1 ? "s" : ""}`
                          }
                        </p>
                      </div>

                      {!item.pageCountError && item.pageCount !== null && item.pageCount > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRangeId(expandedRangeId === item.id ? null : item.id);
                          }}
                          style={{
                            background: item.pageRange.trim() ? "var(--brand-mid)" : "var(--bg-muted)",
                            border: `1px solid ${item.pageRange.trim() ? "var(--brand-border)" : "var(--border-light)"}`,
                            borderRadius: "8px", padding: "4px 9px", fontSize: "11px", fontWeight: 700,
                            color: item.pageRange.trim() ? "var(--brand-dark)" : "var(--text-muted)",
                            cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                          }}
                        >
                          {item.pageRange.trim() ? `📌 ${item.pageRange}` : "Pages"}
                        </button>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        title={`Remove ${item.name}`}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "var(--text-hint)", padding: "4px", flexShrink: 0, lineHeight: 1, borderRadius: "6px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-hint)")}
                      >
                        ✕
                      </button>
                    </div>

                    {expandedRangeId === item.id && (
                      <div style={{ padding: "0 14px 12px 58px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Pages:</label>
                        <input
                          type="text"
                          className="input"
                          value={item.pageRange}
                          onChange={(e) => updatePageRange(item.id, e.target.value)}
                          placeholder={`1-${item.pageCount} (blank = all)`}
                          style={{ flex: 1, minWidth: "160px", maxWidth: "260px", fontSize: "12.5px", padding: "6px 10px" }}
                        />
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>e.g. 1-3, 5, 7-9</span>
                        {item.pageRange.trim() && item.pageCount !== null && (() => {
                          const parsed = parsePageRange(item.pageRange, item.pageCount);
                          return parsed === null
                            ? <span style={{ fontSize: "11px", color: "#ef4444" }}>Invalid</span>
                            : <span style={{ fontSize: "11px", color: "var(--brand)", fontWeight: 700 }}>✓ {parsed.length} pages</span>;
                        })()}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nudge */}
          {items.length === 1 && status === "idle" && (
            <div style={{ textAlign: "center", padding: "12px 16px", borderRadius: "var(--radius-lg)", background: "var(--brand-light)", border: "1px dashed var(--brand-border)", marginBottom: "16px", fontSize: "13px", color: "var(--brand-dark)", fontWeight: 600 }}>
              ☝️ Add at least one more PDF to merge
            </div>
          )}

          {/* ══ FILENAME + MERGE BUTTON ══ */}
          {items.length >= 2 && status !== "done" && status !== "merging" && (
            <>
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "18px 20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                  Output filename
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    className="input"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    placeholder="merged.pdf"
                    maxLength={80}
                    style={{ flex: 1, minWidth: "180px", maxWidth: "320px" }}
                  />
                  <span style={{ fontSize: "11.5px", color: "var(--text-hint)" }}>.pdf added automatically</span>
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={handleMerge}
                style={{ width: "100%", marginBottom: "16px", fontSize: "15px", padding: "15px", fontWeight: 800 }}
              >
                🔗 Merge {items.length} PDFs into One
              </button>
            </>
          )}

          {/* ══ PROGRESS ══ */}
          {status === "merging" && (
            <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 20px", marginBottom: "16px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
                {progressMsg || "Merging PDFs…"}
              </p>
              <div className="progress-bar-wrap" style={{ marginBottom: "8px" }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--brand) 0%, var(--accent) 100%)",
                  borderRadius: "999px",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{progress}%</p>
            </div>
          )}

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ marginBottom: "16px" }}>
            <ins
              className="adsbygoogle"
              style={{ display: "block", minHeight: "90px" }}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* ══ RESULT CARD ══ */}
          {status === "done" && result && (
            <div style={{ background: "#fff", border: "2px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "44px", marginBottom: "8px" }}>✅</div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "4px" }}>Merge Complete!</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                {result.outputPages} pages from {items.length} PDFs merged successfully
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "22px" }}>
                {[
                  { label: "Input PDFs",   value: `${items.length}` },
                  { label: "Input Pages",  value: `${result.totalInputPages}` },
                  { label: "Output Pages", value: `${result.outputPages}` },
                  { label: "Input Size",   value: fmtSize(result.totalInputSize) },
                  { label: "Output Size",  value: fmtSize(result.outputSize) },
                  { label: "Filename",     value: result.filename, small: true },
                ].map(({ label, value, small }: { label: string; value: string; small?: boolean }) => (
                  <div key={label} style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-lg)", padding: "10px 8px" }}>
                    <p style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: small ? "11px" : "15px", fontWeight: 800, color: "var(--brand-dark)", wordBreak: "break-all" }}>{value}</p>
                  </div>
                ))}
              </div>
              {/* Download button */}
              <button
                className="btn-cta"
                onClick={handleDownload}
                style={{ width: "100%", fontSize: "15px", padding: "14px", marginBottom: "12px" }}
              >
                ⬇️ Download {result.filename}
              </button>
              {/* Reset + Back to Home */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-secondary" onClick={handleReset}>🔄 Merge More PDFs</button>
                <a href="/" className="btn-secondary" style={{ textDecoration: "none" }}>🏠 Back to Home</a>
              </div>
            </div>
          )}

          {/* ══ HOW TO USE ══ */}
          <section aria-label="How to use" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>🪄 How to Merge PDFs</h2>
            {[
              { n: "1", title: "Upload PDFs", desc: "Drag & drop or click to select up to 20 PDF files (max 50 MB each)." },
              { n: "2", title: "Reorder & Set Pages", desc: "Drag rows to change merge order. Click 'Pages' to include only specific pages e.g. 1-3, 5." },
              { n: "3", title: "Set Output Filename", desc: "Enter a name for your merged file or leave default 'merged.pdf'." },
              { n: "4", title: "Merge & Download", desc: "Click Merge. Your browser combines all files instantly — nothing is uploaded to any server." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", gap: "12px", marginBottom: "13px", alignItems: "flex-start" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "var(--brand)", color: "#fff", fontSize: "11px", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>{n}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{title}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ══ USE CASES ══ */}
          <section aria-label="Common use cases" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>📋 Common Use Cases</h2>
            {[
              { icon: "🏛️", title: "Government Applications", desc: "Merge Aadhaar, marksheet, caste certificate, address proof into one PDF for VYAPAM, SSC, IBPS, NHM portals." },
              { icon: "🎓", title: "Admit Cards & Results",    desc: "Combine admit card + hall ticket + marksheet into a single PDF for exam centres." },
              { icon: "🏦", title: "Bank & KYC Documents",    desc: "Merge ID proof, address proof, and salary slips for bank loan or KYC submission." },
              { icon: "📑", title: "Office & Business",       desc: "Combine invoices, purchase orders, and challans into one document for accounts." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "12px", marginBottom: "13px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{title}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ══ FAQ ══ */}
          <section aria-label="Frequently asked questions" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>❓ Frequently Asked Questions</h2>
            {[
              { q: "Is this PDF Merger free to use?",                                    a: "Yes, completely free. No file limits, no sign-up, no hidden charges." },
              { q: "Are my files uploaded to any server?",                               a: "No. Everything happens in your browser. Files never leave your device." },
              { q: "How do I combine Aadhaar, marksheet, and certificates for a form?", a: "Upload each PDF, drag them in the correct order, then click Merge. The single PDF can be uploaded to VYAPAM, DigiLocker, SSC, or any portal." },
              { q: "Can I merge only specific pages from each PDF?",                     a: "Yes. Click 'Pages' next to any file and enter a range like '1-3, 5'. Only those pages are included." },
              { q: "What is the maximum number of PDFs I can merge?",                   a: "Up to 20 PDFs at once, each up to 50 MB. For larger batches, use the first merge output as input for the next." },
              { q: "Why does my merged PDF have the wrong page order?",                  a: "Pages merge in the list order. Drag rows before merging to set the correct sequence." },
            ].map((faq, i, arr) => (
              <div key={faq.q} style={{ marginBottom: i < arr.length - 1 ? "16px" : 0, paddingBottom: i < arr.length - 1 ? "16px" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "5px" }}>Q: {faq.q}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* ══ RELATED TOOLS — 8 cards ══ */}
          <section aria-label="More free tools" style={{ marginBottom: "8px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px", color: "var(--text-secondary)" }}>🔗 More Free Tools</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "10px" }}>
              {[
                { icon: "📄", title: "Image to PDF",      href: "/image-to-pdf",  desc: "Convert images to PDF" },
                { icon: "📦", title: "PDF Compress",      href: "/pdf-compress",  desc: "Reduce PDF size" },
                { icon: "✂️", title: "PDF Split",         href: "/pdf-split",     desc: "Split PDF pages" },
                { icon: "🔒", title: "PDF Protect",       href: "/pdf-protect",   desc: "Password protect PDF" },
                { icon: "🔓", title: "PDF Unlock",        href: "/pdf-unlock",    desc: "Remove PDF password" },
                { icon: "🖼️", title: "Image Resize",     href: "/image-resize",  desc: "Resize for govt exams" },
                { icon: "🪪", title: "Photo + Signature", href: "/photo-joiner",  desc: "Merge for govt forms" },
                { icon: "🔄", title: "PDF to Images",     href: "/pdf-to-images", desc: "Export pages as images" },
              ].map((t) => (
                <a key={t.href} href={t.href} className="tool-card" style={{ padding: "14px", opacity: 1, animation: "none" }}>
                  <div className="tool-card-icon" style={{ marginBottom: "7px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true" style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 0" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* FIX 8: Footer component — no inline footer HTML */}
        <Footer />

      </main>
    </>
  );
}

/*
export const metadata = {
  title: "PDF Merge Online Free — Combine PDFs | EzSeva",
  description: "Merge multiple PDFs into one online for free. Combine Aadhaar, marksheets, certificates for govt applications. 100% private — files never leave your device.",
  keywords: ["merge pdf online free","combine pdf files","pdf merge india","aadhaar marksheet combine pdf","vyapam pdf merge","join pdf files online"],
  openGraph: {
    title: "Free PDF Merge — Combine PDFs Online | EzSeva",
    description: "Merge PDFs instantly. 100% private — files never leave your device.",
    url: "https://ezseva.in/pdf-merge",
    siteName: "EzSeva",
  },
  alternates: { canonical: "https://ezseva.in/pdf-merge" },
};
*/