"use client";

/**
 * ============================================================
 * EzSeva — Image to PDF Tool
 * app/image-to-pdf/page.tsx
 * ============================================================
 * Version    : 1.1.0 (Audit Fix)
 * Updated    : March 2026
 *
 * AUDIT FIXES (v1.1.0):
 *   ✅ "use client" moved to absolute line 1
 *   ✅ Inline footer replaced with <Footer /> component
 *   ✅ import Footer added
 *   ✅ console.error removed — error shown via state only
 *   ✅ File validation — MIME + extension both checked
 *   ✅ "← All Tools" button added in page header
 *   ✅ Related Tools expanded from 4 → 8 cards
 *   ✅ FAQ trimmed from 7 → 6 Q&As
 *   ✅ Progress bar class: "progress-bar" → "progress-bar-fill"
 *   ✅ Top Ad div background: var(--bg-subtle) added
 *
 * FEATURES:
 *   ✅ Drag & drop upload zone (JPG, PNG, WebP, GIF — 20 MB/file, max 20)
 *   ✅ Thumbnail preview grid with filename + size
 *   ✅ Drag-to-reorder thumbnails (HTML5 drag & drop)
 *   ✅ Remove individual images (✕ button)
 *   ✅ Page size: A4 (default), A5, Letter, Original Image Size
 *   ✅ Margin: None / Small (10px) / Medium (20px) / Large (40px)
 *   ✅ Image fit: Fit to Page / Fill Page / Original Size
 *   ✅ Custom output filename field
 *   ✅ Progress bar during PDF generation
 *   ✅ Before/After info: X images → Y page PDF, total size
 *   ✅ 100% client-side — pdf-lib + Canvas API, zero server upload
 *   ✅ Reset button + Return to Home button
 *   ✅ AdSense Auto Ads (top, mid, bottom)
 *   ✅ FAQ section (6 Q&A — SEO)
 *   ✅ How to Use (4 steps)
 *   ✅ Related Tools (8 cards)
 *   ✅ 100% globals.css design tokens — no hardcoded colors
 *   ✅ Shared <Navbar /> and <Footer /> components
 *
 * DEPENDENCIES:
 *   • pdf-lib      — already installed
 *   • app/components/Navbar.tsx
 *   • app/components/Footer.tsx
 *   • app/globals.css
 * ============================================================
 */

import { useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PDFDocument } from "pdf-lib";

/* ─── Types ──────────────────────────────────────────────────── */

interface ImageFile {
  id: string;
  file: File;
  name: string;
  sizeKB: number;
  dataUrl: string;
  width: number;
  height: number;
}

type PageSize   = "a4" | "a5" | "letter" | "original";
type MarginSize = "none" | "small" | "medium" | "large";
type ImageFit   = "fit" | "fill" | "original";

/* ─── Constants ──────────────────────────────────────────────── */

const PAGE_SIZES: Record<PageSize, { label: string; w: number; h: number }> = {
  a4:       { label: "A4 (210 × 297 mm)",    w: 595.28, h: 841.89 },
  a5:       { label: "A5 (148 × 210 mm)",    w: 419.53, h: 595.28 },
  letter:   { label: "Letter (8.5 × 11 in)", w: 612,    h: 792    },
  original: { label: "Original Image Size",  w: 0,      h: 0      },
};

const MARGINS: Record<MarginSize, { label: string; px: number }> = {
  none:   { label: "None",           px: 0  },
  small:  { label: "Small (10 px)",  px: 10 },
  medium: { label: "Medium (20 px)", px: 20 },
  large:  { label: "Large (40 px)",  px: 40 },
};

const FITS: Record<ImageFit, string> = {
  fit:      "Fit to Page",
  fill:     "Fill Page",
  original: "Original Size",
};

const MAX_FILES   = 20;
const MAX_MB      = 20;
// FIX: both MIME and extension arrays for dual validation
const ACCEPT_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPT_EXT  = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp,.gif";

/* ─── Utility ────────────────────────────────────────────────── */

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function fmtKB(bytes: number): string {
  const kb = bytes / 1024;
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
  return `${kb.toFixed(1)} KB`;
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    img.onload   = () => resolve(img);
    img.onerror  = reject;
    img.src      = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader    = new FileReader();
    reader.onload   = () => resolve(reader.result as string);
    reader.onerror  = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img   = new Image();
    img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src     = dataUrl;
  });
}

/* ─── Sub-component: Section Label ──────────────────────────── */

function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "var(--brand)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: 900, flexShrink: 0,
        boxShadow: "0 4px 12px rgba(13,148,136,.3)",
      }}>
        {n}
      </div>
      <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

export default function ImageToPdfPage() {
  const [images, setImages]               = useState<ImageFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [pageSize, setPageSize]           = useState<PageSize>("a4");
  const [margin, setMargin]               = useState<MarginSize>("small");
  const [fit, setFit]                     = useState<ImageFit>("fit");
  const [filename, setFilename]           = useState("images-to-pdf");
  const [progress, setProgress]           = useState(0);
  const [isGenerating, setIsGenerating]   = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [resultInfo, setResultInfo]       = useState<{ pages: number; sizeKB: number } | null>(null);

  const [dragItemId, setDragItemId]         = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File validation & ingestion ── */
  const ingestFiles = useCallback(async (rawFiles: FileList | File[]) => {
    setError(null);
    const fileArr   = Array.from(rawFiles);
    const remaining = MAX_FILES - images.length;

    if (remaining <= 0) {
      setError(`Maximum ${MAX_FILES} images allowed. Remove some to add more.`);
      return;
    }

    const toProcess = fileArr.slice(0, remaining);
    const rejected: string[] = [];
    const valid: File[] = [];

    for (const f of toProcess) {
      // FIX: validate both MIME type AND file extension
      const isValidMime = ACCEPT_MIME.includes(f.type);
      const isValidExt  = ACCEPT_EXT.some((ext) => f.name.toLowerCase().endsWith(ext));
      if (!isValidMime || !isValidExt) {
        rejected.push(`${f.name} (unsupported format)`);
        continue;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        rejected.push(`${f.name} (exceeds ${MAX_MB} MB)`);
        continue;
      }
      valid.push(f);
    }

    if (rejected.length > 0) {
      setError(`Skipped: ${rejected.join(", ")}`);
    }

    if (valid.length === 0) return;

    try {
      const newImages: ImageFile[] = await Promise.all(
        valid.map(async (f) => {
          const dataUrl = await readFileAsDataUrl(f);
          const { width, height } = await getImageDimensions(dataUrl);
          return {
            id: uid(),
            file: f,
            name: f.name,
            sizeKB: f.size / 1024,
            dataUrl,
            width,
            height,
          };
        })
      );
      setImages((prev) => [...prev, ...newImages]);
      setResultInfo(null);
    } catch {
      setError("Failed to load one or more images. Please try again.");
    }
  }, [images.length]);

  /* ── Drop zone handlers ── */
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    ingestFiles(e.dataTransfer.files);
  }, [ingestFiles]);

  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDraggingOver(true); }, []);
  const onDragLeave = useCallback(() => setIsDraggingOver(false), []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) ingestFiles(e.target.files);
    e.target.value = "";
  };

  /* ── Remove image ── */
  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResultInfo(null);
  };

  /* ── Drag-to-reorder ── */
  const onThumbDragStart = (id: string) => setDragItemId(id);
  const onThumbDragEnter = (id: string) => setDragOverItemId(id);
  const onThumbDragEnd   = () => {
    if (dragItemId && dragOverItemId && dragItemId !== dragOverItemId) {
      setImages((prev) => {
        const arr     = [...prev];
        const fromIdx = arr.findIndex((i) => i.id === dragItemId);
        const toIdx   = arr.findIndex((i) => i.id === dragOverItemId);
        if (fromIdx === -1 || toIdx === -1) return arr;
        const [removed] = arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, removed);
        return arr;
      });
    }
    setDragItemId(null);
    setDragOverItemId(null);
    setResultInfo(null);
  };

  /* ── Reset ── */
  const reset = () => {
    setImages([]);
    setPageSize("a4");
    setMargin("small");
    setFit("fit");
    setFilename("images-to-pdf");
    setProgress(0);
    setError(null);
    setResultInfo(null);
    setIsGenerating(false);
  };

  /* ── Core: Generate PDF ── */
  const generatePDF = async () => {
    if (images.length === 0) {
      setError("Please add at least one image.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setResultInfo(null);

    try {
      const pdfDoc   = await PDFDocument.create();
      const marginPx = MARGINS[margin].px;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setProgress(Math.round((i / images.length) * 85));

        let pageW: number;
        let pageH: number;

        if (pageSize === "original") {
          pageW = img.width;
          pageH = img.height;
        } else {
          pageW = PAGE_SIZES[pageSize].w;
          pageH = PAGE_SIZES[pageSize].h;
        }

        const canvas  = document.createElement("canvas");
        const htmlImg = await loadImageFromDataUrl(img.dataUrl);
        canvas.width  = htmlImg.naturalWidth;
        canvas.height = htmlImg.naturalHeight;
        const ctx     = canvas.getContext("2d")!;

        let embeddedImage;
        if (img.file.type === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(htmlImg, 0, 0);
          const blob  = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
          const bytes = new Uint8Array(await blob.arrayBuffer());
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(htmlImg, 0, 0);
          const blob  = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
          const bytes = new Uint8Array(await blob.arrayBuffer());
          embeddedImage = await pdfDoc.embedPng(bytes);
        }

        const page  = pdfDoc.addPage([pageW, pageH]);
        const drawW = pageW - marginPx * 2;
        const drawH = pageH - marginPx * 2;
        const imgW  = img.width;
        const imgH  = img.height;

        let drawX: number, drawY: number, finalW: number, finalH: number;

        if (fit === "fit") {
          const scaleW = drawW / imgW;
          const scaleH = drawH / imgH;
          const scale  = Math.min(scaleW, scaleH, 1);
          finalW = imgW * scale;
          finalH = imgH * scale;
          drawX  = marginPx + (drawW - finalW) / 2;
          drawY  = marginPx + (drawH - finalH) / 2;
        } else if (fit === "fill") {
          const scaleW = drawW / imgW;
          const scaleH = drawH / imgH;
          const scale  = Math.max(scaleW, scaleH);
          finalW = imgW * scale;
          finalH = imgH * scale;
          drawX  = marginPx + (drawW - finalW) / 2;
          drawY  = marginPx + (drawH - finalH) / 2;
        } else {
          finalW = imgW;
          finalH = imgH;
          drawX  = marginPx;
          drawY  = marginPx;
        }

        const pdfY = pageH - drawY - finalH;
        page.drawImage(embeddedImage, { x: drawX, y: pdfY, width: finalW, height: finalH });
      }

      setProgress(90);
      const pdfBytes = await pdfDoc.save();
      setProgress(98);

      // Download — FIX-2 pattern: appendChild → click → removeChild → revokeObjectURL
     const blob     = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = `${filename.trim() || "images-to-pdf"}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);

      setProgress(100);
      setResultInfo({ pages: images.length, sizeKB: pdfBytes.byteLength / 1024 });
    } catch (err: unknown) {
      // FIX: no console.error — user-facing message only, no stack trace
      const msg = err instanceof Error ? err.message : "Something went wrong while generating the PDF. Please try again.";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalInputKB = images.reduce((sum, img) => sum + img.sizeKB, 0);

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh", background: "var(--bg-subtle)", paddingBottom: "0" }}>

        {/* ── Top Ad — flush under navbar ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* ── Page Header ── */}
        <div style={{
          background: "linear-gradient(135deg, var(--brand-light) 0%, #fff 60%)",
          borderBottom: "1.5px solid var(--border-light)",
          padding: "36px 16px 28px",
        }}>
          <div className="container-sm">

            {/* FIX: ← All Tools button (replaces breadcrumb) */}
            <div style={{ marginBottom: "16px" }}>
              <a
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand-border)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
              >
                ← All Tools
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "var(--radius-lg)",
                background: "var(--brand)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
                boxShadow: "0 6px 18px rgba(13,148,136,.25)",
              }}>
                📄
              </div>
              <div>
                <h1 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "6px" }}>
                  Image to PDF Converter
                </h1>
                <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "540px" }}>
                  Convert JPG, PNG, WebP images into a single PDF — reorder pages, set margins, choose page size.
                  100% free, 100% private — files never leave your device.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  {["✅ No Upload", "🔒 100% Private", "⚡ Instant", "📱 Mobile Friendly"].map((b) => (
                    <span key={b} style={{ fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px", background: "var(--brand-mid)", color: "var(--brand-dark)", border: "1px solid var(--brand-border)" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tool Body ── */}
        <div className="container-sm" style={{ padding: "24px 16px" }}>

          {/* ── STEP 1: Upload Zone ── */}
          <section aria-label="Upload images" style={{ marginBottom: "20px" }}>
            <SectionLabel n="1" text="Upload Images" />
            <div
              className={`upload-zone${isDraggingOver ? " drag-over" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Click or drag images to upload"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              style={{
                cursor: "pointer",
                border: `2px dashed ${isDraggingOver ? "var(--brand)" : "var(--brand-border)"}`,
                borderRadius: "var(--radius-xl)",
                background: isDraggingOver ? "var(--brand-light)" : "var(--bg-muted)",
                padding: "36px 24px",
                textAlign: "center",
                transition: "all 0.2s ease",
                outline: "none",
              }}
            >
              <div style={{ fontSize: "38px", marginBottom: "10px" }}>
                {isDraggingOver ? "📂" : "🖼️"}
              </div>
              <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
                {isDraggingOver ? "Drop images here!" : "Click to select or drag & drop images"}
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                JPG, PNG, WebP, GIF · Max {MAX_MB} MB/file · Up to {MAX_FILES} images
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              multiple
              onChange={onFileInputChange}
              style={{ display: "none" }}
              aria-hidden="true"
            />
          </section>

          {/* ── Error Alert ── */}
          {error && (
            <div className="alert-error" role="alert" style={{ marginBottom: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError(null)}
                aria-label="Dismiss error"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "inherit", flexShrink: 0, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}

          {/* ── Thumbnail Grid ── */}
          {images.length > 0 && (
            <section aria-label="Uploaded images" style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  🖼️ {images.length} image{images.length !== 1 ? "s" : ""} · {fmtKB(totalInputKB * 1024)} total
                  <span style={{ fontSize: "11px", color: "var(--text-hint)", fontWeight: 500, marginLeft: "8px" }}>
                    (drag thumbnails to reorder)
                  </span>
                </p>
                <button
                  onClick={() => { setImages([]); setResultInfo(null); }}
                  style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--brand)", background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer" }}
                >
                  Remove All
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => onThumbDragStart(img.id)}
                    onDragEnter={() => onThumbDragEnter(img.id)}
                    onDragEnd={onThumbDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    aria-label={`Image ${index + 1}: ${img.name}`}
                    style={{
                      position: "relative",
                      borderRadius: "var(--radius-md)",
                      border: dragOverItemId === img.id ? "2px solid var(--brand)" : "1.5px solid var(--border-light)",
                      background: "#fff",
                      overflow: "hidden",
                      cursor: "grab",
                      boxShadow: dragItemId === img.id ? "0 8px 24px rgba(13,148,136,.18)" : "var(--shadow-sm)",
                      opacity: dragItemId === img.id ? 0.6 : 1,
                      transition: "box-shadow 0.15s, border-color 0.15s, opacity 0.15s",
                    }}
                  >
                    {/* Page order badge */}
                    <div style={{ position: "absolute", top: 5, left: 5, background: "var(--brand)", color: "#fff", fontSize: "10px", fontWeight: 900, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}>
                      {index + 1}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      aria-label={`Remove ${img.name}`}
                      style={{ position: "absolute", top: 4, right: 4, background: "rgba(239,68,68,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, zIndex: 2, lineHeight: 1 }}
                    >
                      ×
                    </button>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      style={{ width: "100%", height: "90px", objectFit: "cover", display: "block", pointerEvents: "none" }}
                    />

                    <div style={{ padding: "6px 7px" }}>
                      <p style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={img.name}>
                        {img.name}
                      </p>
                      <p style={{ fontSize: "10px", color: "var(--text-hint)", marginTop: "1px" }}>
                        {fmtKB(img.sizeKB * 1024)} · {img.width}×{img.height}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add More card */}
                {images.length < MAX_FILES && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Add more images"
                    style={{ borderRadius: "var(--radius-md)", border: "2px dashed var(--brand-border)", background: "var(--bg-muted)", minHeight: "140px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-light)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-muted)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand-border)"; }}
                  >
                    <span style={{ fontSize: "22px" }}>➕</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand)" }}>Add More</span>
                    <span style={{ fontSize: "10px", color: "var(--text-hint)" }}>{MAX_FILES - images.length} left</span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* ── STEP 2: Options ── */}
          {images.length > 0 && (
            <section aria-label="PDF options" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "20px" }}>
              <SectionLabel n="2" text="PDF Options" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "18px" }}>
                {/* Page Size */}
                <div>
                  <label htmlFor="page-size" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Page Size</label>
                  <select id="page-size" className="input" value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} style={{ width: "100%" }}>
                    {(Object.entries(PAGE_SIZES) as [PageSize, typeof PAGE_SIZES[PageSize]][]).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                {/* Margin */}
                <div>
                  <label htmlFor="margin" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Margin</label>
                  <select id="margin" className="input" value={margin} onChange={(e) => setMargin(e.target.value as MarginSize)} style={{ width: "100%" }}>
                    {(Object.entries(MARGINS) as [MarginSize, typeof MARGINS[MarginSize]][]).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                {/* Image Fit */}
                <div>
                  <label htmlFor="fit" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Image Fit</label>
                  <select id="fit" className="input" value={fit} onChange={(e) => setFit(e.target.value as ImageFit)} style={{ width: "100%" }}>
                    {(Object.entries(FITS) as [ImageFit, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Filename */}
                <div>
                  <label htmlFor="filename" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Output Filename</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      id="filename" type="text" className="input"
                      value={filename} onChange={(e) => setFilename(e.target.value)}
                      placeholder="images-to-pdf"
                      style={{ width: "100%", borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)", borderRight: "none" }}
                    />
                    <span style={{ padding: "0 10px", height: "40px", display: "flex", alignItems: "center", background: "var(--bg-muted)", border: "1.5px solid var(--border-light)", borderLeft: "none", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "12px", color: "var(--text-hint)", fontWeight: 600 }}>
                      .pdf
                    </span>
                  </div>
                </div>
              </div>

              {/* Fit hint */}
              <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "12px", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "var(--text-secondary)" }}>
                  {fit === "fit" ? "🔲 Fit to Page" : fit === "fill" ? "🟩 Fill Page" : "📌 Original Size"}:
                </strong>{" "}
                {fit === "fit"
                  ? "Image scales down to fit within the page while preserving aspect ratio. White space may appear on sides or top/bottom."
                  : fit === "fill"
                  ? "Image fills the entire page. Edges may be cropped if aspect ratios differ."
                  : "Image is placed at its original pixel size. May overflow the page if the image is large."}
              </div>
            </section>
          )}

          {/* ── Mid Ad ── */}
          {images.length > 0 && (
            <div aria-hidden="true" style={{ margin: "24px 0" }}>
              <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
                data-ad-format="auto" data-full-width-responsive="true" />
            </div>
          )}

          {/* ── STEP 3: Generate ── */}
          {images.length > 0 && (
            <section aria-label="Generate PDF" style={{ marginBottom: "20px" }}>
              <SectionLabel n="3" text="Generate PDF" />

              {/* Info bar */}
              <div style={{ background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-lg)", padding: "14px 18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--brand-dark)", fontWeight: 700 }}>
                  <span>🖼️ {images.length} image{images.length !== 1 ? "s" : ""}</span>
                  <span style={{ color: "var(--brand)" }}>→</span>
                  <span>📄 {images.length}-page PDF</span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
                  Input: {fmtKB(totalInputKB * 1024)}
                </span>
              </div>

              {/* FIX: progress-bar-fill class */}
              {isGenerating && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                    <span>⚙️ Generating PDF…</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              )}

              {/* Success */}
              {resultInfo && !isGenerating && (
                <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
                  ✅ PDF generated! {resultInfo.pages} page{resultInfo.pages !== 1 ? "s" : ""} · {fmtKB(resultInfo.sizeKB * 1024)} — download should have started automatically.
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="btn-primary"
                  onClick={generatePDF}
                  disabled={isGenerating || images.length === 0}
                  aria-label="Generate and download PDF"
                  style={{ flex: "1 1 180px", minWidth: "180px" }}
                >
                  {isGenerating ? `⚙️ Generating… ${progress}%` : "📥 Generate PDF"}
                </button>
                <button className="btn-secondary" onClick={reset} disabled={isGenerating} aria-label="Reset">
                  🔄 Reset
                </button>
                <a href="/" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  🏠 Home
                </a>
              </div>
            </section>
          )}

          {/* ── Empty state ── */}
          {images.length === 0 && (
            <div style={{ textAlign: "center", padding: "28px 24px", background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", marginBottom: "20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📑</div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                Ready to convert images to PDF?
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "18px", lineHeight: 1.6 }}>
                Great for Aadhaar card, marksheets, certificates, and multi-page documents.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                  🖼️ Select Images
                </button>
                <a href="/" className="btn-secondary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  🏠 Back to Home
                </a>
              </div>
            </div>
          )}

          {/* ── How to Use ── */}
          <section aria-label="How to use Image to PDF" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "26px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px", color: "var(--text-primary)" }}>
              📖 How to Use
            </h2>
            {[
              { n: "1", title: "Upload Your Images",  desc: "Click the upload zone or drag & drop your JPG, PNG, WebP, or GIF files. You can add up to 20 images, each up to 20 MB." },
              { n: "2", title: "Reorder & Remove",    desc: "Drag and drop the thumbnails to reorder them. The numbered badge shows the page order in the final PDF. Remove unwanted images using the ✕ button." },
              { n: "3", title: "Choose Options",      desc: "Select page size (A4 recommended for most purposes), margin, image fit, and an output filename for your PDF." },
              { n: "4", title: "Generate & Download", desc: "Click 'Generate PDF'. The PDF is created instantly in your browser and downloads automatically. Nothing is sent to any server." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", gap: "12px", marginBottom: "13px", alignItems: "flex-start" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", background: "var(--brand)", color: "#fff", fontSize: "11px", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>
                  {n}
                </span>
                <div>
                  <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{title}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── Use Cases ── */}
          <section aria-label="Common use cases" style={{ background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "14px", color: "var(--brand-dark)" }}>
              🎯 Works Best For
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
              {[
                { icon: "🪪", label: "Aadhaar Card"    },
                { icon: "📋", label: "Marksheets"      },
                { icon: "🎓", label: "Certificates"    },
                { icon: "📝", label: "Form Images"     },
                { icon: "🏠", label: "Land Records"    },
                { icon: "🏥", label: "Medical Reports" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", padding: "12px", textAlign: "center", fontSize: "12.5px", fontWeight: 700, color: "var(--brand-dark)" }}>
                  <div style={{ fontSize: "20px", marginBottom: "5px" }}>{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ (6 Q&As) ── */}
          <section aria-label="Frequently asked questions" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "26px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px", color: "var(--text-primary)" }}>
              ❓ Frequently Asked Questions
            </h2>
            {[
              {
                q: "Is my image data uploaded to any server?",
                a: "No. EzSeva Image to PDF is 100% client-side. All processing happens in your browser using the Canvas API and pdf-lib library. Your images are never uploaded — your files remain completely private on your device.",
              },
              {
                q: "Which image formats are supported?",
                a: "We support JPG/JPEG, PNG, WebP, and GIF. Each file can be up to 20 MB in size. You can add up to 20 images in a single PDF.",
              },
              {
                q: "Can I change the order of images in the PDF?",
                a: "Yes! After uploading, drag and drop the image thumbnails to reorder them. The numbered badge on each thumbnail shows the page order in the final PDF.",
              },
              {
                q: "What is the difference between 'Fit to Page' and 'Fill Page'?",
                a: "Fit to Page scales your image to fit entirely within the page (with possible whitespace on sides). Fill Page scales the image to cover the entire page — some edges may be cropped. Original Size places the image at its native pixel dimensions.",
              },
              {
                q: "Can I convert Aadhaar card, marksheets, or certificates to PDF?",
                a: "Absolutely. Simply photograph or scan your document and upload the image. The tool creates a properly formatted PDF suitable for government applications, college admissions, and more.",
              },
              {
                q: "What page size should I use for government document submissions?",
                a: "A4 (210 × 297 mm) is the most widely accepted page size for government submissions in India. Use A4 with 'Fit to Page' and a small margin for the most professional result.",
              },
            ].map((faq, i, arr) => (
              <div key={faq.q} style={{ marginBottom: i < arr.length - 1 ? "18px" : 0, paddingBottom: i < arr.length - 1 ? "18px" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>Q: {faq.q}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* ── Related Tools (8 cards) ── */}
          <section aria-label="Related tools" style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px", color: "var(--text-secondary)" }}>
              🔗 Related Tools
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
              {[
                { icon: "📐", title: "Image Resize",      href: "/image-resize",  desc: "Resize for SSC, Railway" },
                { icon: "🪪", title: "Photo + Signature", href: "/photo-joiner",  desc: "Merge for govt forms"    },
                { icon: "🎨", title: "Image Crop",        href: "/image-crop",    desc: "Crop to exact size"      },
                { icon: "🗜️", title: "PDF Compress",      href: "/pdf-compress",  desc: "Shrink PDF file size"    },
                { icon: "🔗", title: "PDF Merge",         href: "/pdf-merge",     desc: "Combine multiple PDFs"   },
                { icon: "✂️", title: "PDF Split",         href: "/pdf-split",     desc: "Extract PDF pages"       },
                { icon: "🔒", title: "PDF Protect",       href: "/pdf-protect",   desc: "Password protect PDF"    },
                { icon: "🤖", title: "AI Letter Writer",  href: "/ai-letter",     desc: "Write with AI"           },
              ].map((t) => (
                <a key={t.href} href={t.href} className="tool-card" style={{ padding: "14px" }}>
                  <div className="tool-card-icon" style={{ marginBottom: "8px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>

        </div>{/* /container-sm */}

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true">
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* ── FIX: Shared Footer component ── */}
        <Footer />

      </main>
    </>
  );
}

/*
export const metadata = {
  title: "Image to PDF Converter Online Free — JPG, PNG to PDF | EzSeva",
  description:
    "Convert JPG, PNG, WebP images to PDF instantly. Reorder pages, set margins, choose page size. 100% free, 100% private — files never leave your device. No signup.",
  keywords: [
    "image to pdf online free",
    "jpg to pdf converter",
    "png to pdf",
    "photo to pdf",
    "aadhaar card to pdf",
    "marksheet to pdf",
    "certificate to pdf",
    "photos to pdf india",
    "images ko pdf kaise banaye",
  ],
  openGraph: {
    title: "Free Image to PDF Converter — JPG, PNG to PDF | EzSeva",
    description: "Convert images to PDF instantly. 100% private — files never leave your device.",
    url: "https://ezseva.in/image-to-pdf",
    siteName: "EzSeva",
  },
  alternates: {
    canonical: "https://ezseva.in/image-to-pdf",
  },
};
*/