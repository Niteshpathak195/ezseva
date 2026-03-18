"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Types ──────────────────────────────────────────────────── */

type OutputFormat = "jpeg" | "png" | "webp";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AspectPreset {
  label: string;
  ratio: number | null;
  icon: string;
}

interface ExamPreset {
  label: string;
  w: number;
  h: number;
  badge?: string;
}

/* ─── Constants ──────────────────────────────────────────────── */

const ASPECT_PRESETS: AspectPreset[] = [
  { label: "Free",   ratio: null,     icon: "✏️" },
  { label: "1 : 1",  ratio: 1,        icon: "⬜" },
  { label: "4 : 3",  ratio: 4 / 3,    icon: "🖼️" },
  { label: "16 : 9", ratio: 16 / 9,   icon: "📺" },
  { label: "3 : 4",  ratio: 3 / 4,    icon: "📱" },
  { label: "2 : 3",  ratio: 2 / 3,    icon: "📷" },
];

const EXAM_PRESETS: ExamPreset[] = [
  { label: "Passport Photo",   w: 413,  h: 531,  badge: "INTL" },
  { label: "SSC / Railway",    w: 200,  h: 230,  badge: "HOT" },
  { label: "UPSC Photo",       w: 300,  h: 400               },
  { label: "Signature (SSC)",  w: 140,  h: 60                },
  { label: "Square (1:1)",     w: 400,  h: 400               },
  { label: "WhatsApp DP",      w: 500,  h: 500               },
];

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];
const ALLOWED_EXT  = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];

function fmtSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/* ─── Component ──────────────────────────────────────────────── */

export default function ImageCropPage() {
  const [imgFile, setImgFile]       = useState<File | null>(null);
  const [imgSrc, setImgSrc]         = useState<string>("");
  const [naturalW, setNaturalW]     = useState(0);
  const [naturalH, setNaturalH]     = useState(0);

  const [canvasW, setCanvasW]       = useState(0);
  const [canvasH, setCanvasH]       = useState(0);
  const scale = naturalW > 0 ? canvasW / naturalW : 1;

  const [crop, setCrop]             = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart]   = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode]     = useState<"new" | "move">("new");
  const [moveOffset, setMoveOffset] = useState({ dx: 0, dy: 0 });

  const [aspectPreset, setAspectPreset] = useState<number | null>(null);
  const [customW, setCustomW]           = useState("");
  const [customH, setCustomH]           = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [jpegQuality, setJpegQuality]   = useState(92);

  const [resultDataUrl, setResultDataUrl] = useState<string>("");
  const [resultSize, setResultSize]       = useState(0);
  const [resultW, setResultW]             = useState(0);
  const [resultH, setResultH]             = useState(0);
  const [isCropped, setIsCropped]         = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const imageRef       = useRef<HTMLImageElement | null>(null);
  const currentObjUrlRef = useRef<string>("");

  const MAX_SIZE = 20 * 1024 * 1024;

  /* ── Load image ── revoke previous Object URL ── */
  const loadImage = useCallback((f: File) => {
    const isValidMime = ALLOWED_MIME.includes(f.type);
    const isValidExt  = ALLOWED_EXT.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!isValidMime && !isValidExt) {
      setErrorMsg("Unsupported file type. Use JPG, PNG, WebP, GIF, or BMP.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("File too large. Max 20 MB.");
      return;
    }

    setErrorMsg("");
    setImgFile(f);
    setIsCropped(false);
    setResultDataUrl("");

    // Revoke previous Object URL before creating a new one
    if (currentObjUrlRef.current) {
      URL.revokeObjectURL(currentObjUrlRef.current);
    }
    const url = URL.createObjectURL(f);
    currentObjUrlRef.current = url;
    setImgSrc(url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Draw canvas when image/crop changes ── */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imageRef.current;
    if (!canvas || !img || canvasW === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, 0, 0, canvasW, canvasH);
    if (crop.w > 2 && crop.h > 2) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.clearRect(crop.x, crop.y, crop.w, crop.h);
      ctx.drawImage(
        img,
        crop.x / scale, crop.y / scale, crop.w / scale, crop.h / scale,
        crop.x, crop.y, crop.w, crop.h
      );
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      const hs = 8;
      [
        [crop.x,          crop.y],
        [crop.x + crop.w, crop.y],
        [crop.x,          crop.y + crop.h],
        [crop.x + crop.w, crop.y + crop.h],
      ].forEach(([hx, hy]) => {
        ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
      });
    }
  }, [canvasW, canvasH, crop, scale]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  /* ── Set up canvas when image loads ── */
  useEffect(() => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      const maxW  = Math.min(containerRef.current?.clientWidth ?? 560, 680);
      const ratio = img.naturalHeight / img.naturalWidth;
      const cw    = maxW;
      const ch    = Math.round(cw * ratio);
      setCanvasW(cw);
      setCanvasH(ch);
      setCrop({ x: 0, y: 0, w: cw, h: ch });
      setIsCropped(false);
    };
    img.src = imgSrc;
  }, [imgSrc]);

  /* ── Aspect-locked crop helper ── */
  const applyAspect = useCallback(
    (x: number, y: number, w: number, h: number, ratio: number | null): CropRect => {
      if (!ratio) return { x, y, w, h };
      const newH = Math.round(w / ratio);
      return { x, y, w, h: Math.min(newH, canvasH - y) };
    },
    [canvasH]
  );

  /* ── Mouse/touch coords relative to canvas ── */
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvasW / rect.width;
    const scaleY = canvasH / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imgSrc) return;
    e.preventDefault();
    const pos    = getCanvasPos(e);
    const inside =
      pos.x >= crop.x && pos.x <= crop.x + crop.w &&
      pos.y >= crop.y && pos.y <= crop.y + crop.h;
    if (inside && crop.w > 10) {
      setDragMode("move");
      setMoveOffset({ dx: pos.x - crop.x, dy: pos.y - crop.y });
    } else {
      setDragMode("new");
      setDragStart(pos);
      setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    if (dragMode === "move") {
      const nx = Math.max(0, Math.min(pos.x - moveOffset.dx, canvasW - crop.w));
      const ny = Math.max(0, Math.min(pos.y - moveOffset.dy, canvasH - crop.h));
      setCrop((prev) => ({ ...prev, x: nx, y: ny }));
    } else {
      const x  = Math.max(0, Math.min(dragStart.x, pos.x));
      const y  = Math.max(0, Math.min(dragStart.y, pos.y));
      const w  = Math.min(Math.abs(pos.x - dragStart.x), canvasW - x);
      const h  = Math.min(Math.abs(pos.y - dragStart.y), canvasH - y);
      setCrop(applyAspect(x, y, w, h, aspectPreset));
    }
  };

  const onMouseUp = () => { setIsDragging(false); };

  /* ── Apply exam preset ── */
  const applyExamPreset = useCallback((preset: ExamPreset) => {
    const ratio = preset.w / preset.h;
    setCustomW(String(preset.w));
    setCustomH(String(preset.h));
    setAspectPreset(ratio);
    if (canvasW > 0 && canvasH > 0) {
      let cw = canvasW;
      let ch = Math.round(cw / ratio);
      if (ch > canvasH) { ch = canvasH; cw = Math.round(ch * ratio); }
      const cx = Math.round((canvasW - cw) / 2);
      const cy = Math.round((canvasH - ch) / 2);
      setCrop({ x: cx, y: cy, w: cw, h: ch });
    }
  }, [canvasW, canvasH]);

  /* ── Crop & render ── */
  const handleCrop = useCallback(() => {
    if (!imageRef.current || crop.w < 4 || crop.h < 4) {
      setErrorMsg("Draw a crop area first.");
      return;
    }
    setErrorMsg("");
    const outW = customW && customH ? parseInt(customW, 10) : Math.round(crop.w / scale);
    const outH = customW && customH ? parseInt(customH, 10) : Math.round(crop.h / scale);
    if (isNaN(outW) || isNaN(outH) || outW < 1 || outH < 1) {
      setErrorMsg("Invalid custom dimensions.");
      return;
    }
    try {
      const offscreen    = document.createElement("canvas");
      offscreen.width    = outW;
      offscreen.height   = outH;
      const ctx          = offscreen.getContext("2d")!;
      const srcX         = Math.round(crop.x / scale);
      const srcY         = Math.round(crop.y / scale);
      const srcW         = Math.round(crop.w / scale);
      const srcH         = Math.round(crop.h / scale);
      ctx.drawImage(imageRef.current, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      const mime    = outputFormat === "jpeg" ? "image/jpeg" : outputFormat === "png" ? "image/png" : "image/webp";
      const quality = outputFormat === "png" ? undefined : jpegQuality / 100;
      const dataUrl = offscreen.toDataURL(mime, quality);
      const base64  = dataUrl.split(",")[1];
      const byteLen = Math.round((base64.length * 3) / 4);
      setResultDataUrl(dataUrl);
      setResultSize(byteLen);
      setResultW(outW);
      setResultH(outH);
      setIsCropped(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
    }
  }, [crop, customW, customH, scale, outputFormat, jpegQuality]);

  /* ── Download — Blob URL, revokeObjectURL after 10s ── */
  const handleDownload = useCallback(() => {
    if (!resultDataUrl) return;
    try {
      const ext      = outputFormat === "jpeg" ? "jpg" : outputFormat;
      const base     = imgFile?.name.replace(/\.[^.]+$/, "") ?? "cropped";
      const filename = `${base}_cropped.${ext}`;

      const arr       = resultDataUrl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) return;
      const mime  = mimeMatch[1];
      const bstr  = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8arr], { type: mime });

      const url = URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href    = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Download failed. Please try again.";
      setErrorMsg(msg);
    }
  }, [resultDataUrl, outputFormat, imgFile]);

  /* ── Reset — revoke Object URL ── */
  const handleReset = useCallback(() => {
    if (currentObjUrlRef.current) {
      URL.revokeObjectURL(currentObjUrlRef.current);
      currentObjUrlRef.current = "";
    }
    setImgFile(null);
    setImgSrc("");
    setNaturalW(0);
    setNaturalH(0);
    setCanvasW(0);
    setCanvasH(0);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setAspectPreset(null);
    setCustomW("");
    setCustomH("");
    setOutputFormat("jpeg");
    setJpegQuality(92);
    setResultDataUrl("");
    setResultSize(0);
    setResultW(0);
    setResultH(0);
    setIsCropped(false);
    setIsDragOver(false);
    setErrorMsg("");
    imageRef.current = null;
  }, []);

  /* ── Drop zone ── */
  const onZoneDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const onZoneDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const onZoneDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadImage(f);
  }, [loadImage]);
  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadImage(f);
    e.target.value = "";
  }, [loadImage]);

  /* ─────────────────────────────────────────────────────────── */
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
                🎨 Free Image Tool
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Image Crop — Free Online Cropper
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65 }}>
              Crop photos for SSC, Railway, Passport, UPSC & custom sizes.{" "}
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

          {/* Error */}
          {errorMsg && (
            <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* ══ UPLOAD ZONE ══ */}
          {!imgSrc && (
            <div
              className={`upload-zone${isDragOver ? " drag-over" : ""}`}
              onDragOver={onZoneDragOver}
              onDragLeave={onZoneDragLeave}
              onDrop={onZoneDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload image"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              style={{ marginBottom: "16px" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileInput}
              />
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🖼️</div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                Drag & drop an image, or click to browse
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                JPG, PNG, WebP, GIF, BMP · up to 20 MB
              </p>
            </div>
          )}

          {/* ══ CROP WORKSPACE ══ */}
          {imgSrc && !isCropped && (
            <>
              {/* Exam presets */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "18px 20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>📋 Quick Exam Presets</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {EXAM_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyExamPreset(p)}
                      style={{ fontSize: "11.5px", fontWeight: 700, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border-light)", background: "#fff", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.13s ease", display: "flex", alignItems: "center", gap: "5px" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-secondary)"; el.style.background = "#fff"; }}
                    >
                      {/* FIX: badge colors — CSS vars only, no hardcoded hex */}
                      {p.badge && (
                        <span style={{
                          fontSize: "8px", fontWeight: 800,
                          background: p.badge === "HOT" ? "var(--brand-light)" : "var(--bg-muted)",
                          color:      p.badge === "HOT" ? "var(--accent)"      : "var(--brand)",
                          border:     `1px solid ${p.badge === "HOT" ? "var(--brand-border)" : "var(--brand-mid)"}`,
                          padding: "1px 4px", borderRadius: "3px",
                        }}>
                          {p.badge}
                        </span>
                      )}
                      {p.label}{" "}
                      <span style={{ color: "var(--text-hint)", fontWeight: 400 }}>{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect ratio */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "18px 20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>📐 Aspect Ratio</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {ASPECT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setAspectPreset(p.ratio)}
                      style={{
                        fontSize: "11.5px", fontWeight: 700, padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${aspectPreset === p.ratio ? "var(--brand)" : "var(--border-light)"}`,
                        background: aspectPreset === p.ratio ? "var(--brand-light)" : "#fff",
                        color: aspectPreset === p.ratio ? "var(--brand)" : "var(--text-secondary)",
                        cursor: "pointer", transition: "all 0.13s ease",
                      }}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>Output size (px):</span>
                  <input type="number" className="input" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="W" min={1} style={{ width: "80px", padding: "6px 8px", fontSize: "12.5px" }} />
                  <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>×</span>
                  <input type="number" className="input" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder="H" min={1} style={{ width: "80px", padding: "6px 8px", fontSize: "12.5px" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-hint)" }}>Leave blank = use crop area size</span>
                </div>
              </div>

              {/* Canvas */}
              <div ref={containerRef} style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "16px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", textAlign: "center" }}>
                  🖱️ Drag to draw crop area · Click inside to move
                </p>
                <canvas
                  ref={canvasRef}
                  width={canvasW}
                  height={canvasH}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onMouseDown}
                  onTouchMove={onMouseMove}
                  onTouchEnd={onMouseUp}
                  style={{ width: "100%", display: "block", cursor: "crosshair", borderRadius: "var(--radius-lg)", touchAction: "none" }}
                />
                {crop.w > 4 && crop.h > 4 && (
                  <p style={{ fontSize: "11.5px", color: "var(--brand)", fontWeight: 700, textAlign: "center", marginTop: "8px" }}>
                    Crop: {Math.round(crop.w / scale)} × {Math.round(crop.h / scale)} px
                  </p>
                )}
              </div>

              {/* Format + quality */}
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "18px 20px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-secondary)" }}>Output format:</span>
                  {(["jpeg", "png", "webp"] as OutputFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setOutputFormat(f)}
                      style={{
                        fontSize: "12px", fontWeight: 700, padding: "5px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${outputFormat === f ? "var(--brand)" : "var(--border-light)"}`,
                        background: outputFormat === f ? "var(--brand-light)" : "#fff",
                        color: outputFormat === f ? "var(--brand)" : "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
                {outputFormat !== "png" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>
                      Quality: {jpegQuality}%
                    </span>
                    <input
                      type="range" min={60} max={100} value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number(e.target.value))}
                      style={{ flex: 1, minWidth: "120px", accentColor: "var(--brand)" }}
                    />
                  </div>
                )}
              </div>

              {/* Crop + Reset buttons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button className="btn-primary" onClick={handleCrop} style={{ flex: 1, fontSize: "15px", padding: "15px", fontWeight: 800 }}>
                  ✂️ Apply Crop
                </button>
                <button className="btn-secondary" onClick={handleReset} style={{ flexShrink: 0 }}>
                  🔄 Reset
                </button>
              </div>
            </>
          )}

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin: "24px 0" }}>
            <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ══ RESULT ══ */}
          {isCropped && resultDataUrl && (
            <div style={{ background: "#fff", border: "2px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "24px", marginBottom: "20px", boxShadow: "var(--shadow-md)" }}>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "40px", marginBottom: "6px" }}>✅</div>
                <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "4px" }}>Crop Complete!</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {resultW} × {resultH} px · {fmtSize(resultSize)}
                </p>
              </div>

              {/* Preview */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <img
                  src={resultDataUrl}
                  alt="Cropped preview"
                  style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border-light)", objectFit: "contain" }}
                />
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "18px" }}>
                {[
                  { label: "Original",    value: `${naturalW}×${naturalH}` },
                  { label: "Cropped",     value: `${resultW}×${resultH}` },
                  { label: "Output Size", value: fmtSize(resultSize) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-lg)", padding: "10px 8px", textAlign: "center" }}>
                    <p style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--brand-dark)" }}>{value}</p>
                  </div>
                ))}
              </div>

              <button
                className="btn-cta"
                onClick={handleDownload}
                style={{ width: "100%", fontSize: "15px", padding: "14px", marginBottom: "12px" }}
              >
                ⬇️ Download Cropped Image
              </button>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-secondary" onClick={() => setIsCropped(false)}>✂️ Crop Again</button>
                <button className="btn-secondary" onClick={handleReset}>🔄 New Image</button>
                <a href="/" className="btn-secondary" style={{ textDecoration: "none" }}>🏠 Back to Home</a>
              </div>
            </div>
          )}

          {/* ══ HOW TO USE ══ */}
          <section aria-label="How to use" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
              🪄 How to Crop an Image
            </h2>
            {[
              { n: "1", title: "Upload Image",           desc: "Drag & drop or click to select a JPG, PNG, or WebP image up to 20 MB." },
              { n: "2", title: "Choose Preset or Ratio", desc: "Pick an exam preset (SSC, Passport, UPSC) or set a custom aspect ratio. Then drag to draw your crop area." },
              { n: "3", title: "Set Output Size",        desc: "Optionally enter exact pixel dimensions. Leave blank to use the cropped area as-is." },
              { n: "4", title: "Apply & Download",       desc: "Click Apply Crop to preview, then download your cropped image in JPEG, PNG, or WebP." },
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
          <section aria-label="FAQ" style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
              ❓ Frequently Asked Questions
            </h2>
            {[
              { q: "Is this image cropper free?",                   a: "Yes, completely free. No signup, no limits, no hidden charges." },
              { q: "Are my photos uploaded to any server?",         a: "No. Cropping uses the Canvas API entirely in your browser. Your images never leave your device." },
              { q: "What size should I crop for an SSC exam photo?",a: "SSC requires 200×230 pixels (max 20 KB JPEG). Select the SSC/Railway preset — it sets the crop ratio automatically." },
              { q: "What size is required for a Passport photo?",   a: "Indian passport photos are 35×45 mm. At 300 DPI that is 413×531 pixels. Select the Passport Photo preset." },
              { q: "Can I crop to an exact pixel size?",            a: "Yes. After selecting the crop area, enter exact width and height in the Output Size fields before clicking Apply Crop." },
              { q: "Which output format should I choose?",          a: "Use JPEG for exam portals (smallest size). Use PNG for transparent backgrounds. Use WebP for web use (best quality-to-size ratio)." },
            ].map((faq, i, arr) => (
              <div
                key={faq.q}
                style={{ marginBottom: i < arr.length - 1 ? "16px" : 0, paddingBottom: i < arr.length - 1 ? "16px" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}
              >
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
                { icon: "🖼️", title: "Image Resize",   href: "/image-resize", desc: "Resize for govt exams" },
                { icon: "🪪", title: "Photo+Signature", href: "/photo-joiner", desc: "Merge for govt forms" },
                { icon: "📄", title: "Image to PDF",    href: "/image-to-pdf", desc: "Convert images to PDF" },
                { icon: "🔗", title: "PDF Merge",       href: "/pdf-merge",    desc: "Combine PDFs into one" },
                { icon: "✂️", title: "PDF Split",       href: "/pdf-split",    desc: "Extract PDF pages" },
                { icon: "📦", title: "PDF Compress",    href: "/pdf-compress", desc: "Reduce PDF size" },
                { icon: "🔒", title: "PDF Protect",     href: "/pdf-protect",  desc: "Password protect PDF" },
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
  title: "Image Crop Online Free — Crop Photo for SSC, Passport | EzSeva",
  description: "Crop images online free for SSC, Railway, UPSC, Passport & custom sizes. Set exact pixel dimensions. 100% private — files never leave your device.",
  keywords: ["image crop online free","crop photo for ssc","passport photo crop","image crop india","photo cropper no upload"],
  openGraph: { title: "Free Image Crop — Crop Photo Online | EzSeva", description: "Crop photos instantly. 100% private.", url: "https://ezseva.in/image-crop", siteName: "EzSeva" },
  alternates: { canonical: "https://ezseva.in/image-crop" },
};
*/