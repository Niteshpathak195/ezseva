"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EzSeva — Photo + Signature Joiner
// app/photo-joiner/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Version    : 1.1.0 (Audit Fix)
// Updated    : March 2026
//
// AUDIT FIXES (v1.1.0):
//   ✅ import Footer added, inline <footer> replaced with <Footer />
//   ✅ dangerouslySetInnerHTML AdSense script removed (layout.tsx handles it)
//   ✅ console.error removed — error shown via state only
//   ✅ File size check added — 20MB max on both photo and signature
//   ✅ "← All Tools" button added in page header
//   ✅ Related Tools expanded from 4 → 8 cards
//   ✅ FAQ trimmed from 7 → 6 Q&As
//   ✅ Error class: "alert alert-error" → "alert-error"
//   ✅ Top Ad div: background var(--bg-subtle) added
//   ✅ Hardcoded #e5f7f5, #f8fffe → CSS vars
//   ✅ SEO metadata block added (commented)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── Types ──────────────────────────────────────────────────────────────────

type Layout   = "left" | "top";
type PresetKey = "ssc" | "ibps" | "railway" | "vyapam" | "upsc" | "custom";

interface Preset {
  label: string;
  desc: string;
  photoW: number;
  photoH: number;
  sigW: number;
  sigH: number;
  maxKB: number;
  canvasW: number;
  canvasH: number;
  layout: Layout;
}

// ── Official Government Form Presets ─────────────────────────────────────

const PRESETS: Record<PresetKey, Preset> = {
  ssc: {
    label: "SSC CGL / CHSL / MTS",
    desc: "Photo 3.5×4.5 cm + Sig 3.5×1.5 cm · Max 50 KB",
    photoW: 200, photoH: 230,
    sigW: 200,   sigH: 75,
    maxKB: 50,   canvasW: 400, canvasH: 230, layout: "left",
  },
  ibps: {
    label: "IBPS PO / Clerk / SO",
    desc: "Photo 200×230 px + Sig 140×60 px · Max 100 KB",
    photoW: 200, photoH: 230,
    sigW: 140,   sigH: 60,
    maxKB: 100,  canvasW: 400, canvasH: 230, layout: "left",
  },
  railway: {
    label: "Railway RRB NTPC / Group D",
    desc: "Photo 132×170 px + Sig 140×60 px · Max 40 KB",
    photoW: 132, photoH: 170,
    sigW: 140,   sigH: 60,
    maxKB: 40,   canvasW: 320, canvasH: 170, layout: "left",
  },
  vyapam: {
    label: "MP Vyapam / MP PEB",
    desc: "Photo 200×230 px + Sig 200×75 px · Max 50 KB",
    photoW: 200, photoH: 230,
    sigW: 200,   sigH: 75,
    maxKB: 50,   canvasW: 420, canvasH: 230, layout: "left",
  },
  upsc: {
    label: "UPSC Civil Services",
    desc: "Photo 300×350 px + Sig 140×60 px · Max 300 KB",
    photoW: 300, photoH: 350,
    sigW: 140,   sigH: 60,
    maxKB: 300,  canvasW: 480, canvasH: 350, layout: "left",
  },
  custom: {
    label: "Custom",
    desc: "Set your own canvas size",
    photoW: 200, photoH: 230,
    sigW: 140,   sigH: 60,
    maxKB: 100,  canvasW: 400, canvasH: 230, layout: "left",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img    = new window.Image();
    img.onload   = () => resolve(img);
    img.onerror  = reject;
    img.src      = src;
  });
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader    = new FileReader();
    reader.onload   = () => resolve(reader.result as string);
    reader.onerror  = reject;
    reader.readAsDataURL(file);
  });
}

function drawWithWhiteBg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
  whiteBg: boolean
) {
  if (whiteBg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, w, h);
  }
  ctx.drawImage(img, x, y, w, h);
}

async function compressToJPEG(canvas: HTMLCanvasElement, maxKB: number): Promise<Blob> {
  let quality  = 0.92;
  let blob: Blob | null = null;
  const maxBytes = maxKB * 1024;

  for (let i = 0; i < 12; i++) {
    blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        quality
      );
    });
    if (blob.size <= maxBytes || quality <= 0.05) break;
    quality = Math.max(0.05, quality - 0.08);
  }
  return blob!;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function PhotoJoiner() {
  const [preset, setPreset]   = useState<PresetKey>("ssc");
  const [layout, setLayout]   = useState<Layout>("left");

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL]   = useState<string>("");
  const [photoDrag, setPhotoDrag] = useState(false);

  // Signature
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [sigURL, setSigURL]   = useState<string>("");
  const [sigDrag, setSigDrag] = useState(false);

  // Custom dimensions
  const [customPhotoW, setCustomPhotoW] = useState(200);
  const [customPhotoH, setCustomPhotoH] = useState(230);
  const [customSigW, setCustomSigW]     = useState(140);
  const [customSigH, setCustomSigH]     = useState(60);
  const [customMaxKB, setCustomMaxKB]   = useState(100);

  // Output
  const [previewURL, setPreviewURL]   = useState<string>("");
  const [outputSize, setOutputSize]   = useState<number>(0);
  const [outputBlob, setOutputBlob]   = useState<Blob | null>(null);
  const [processing, setProcessing]   = useState(false);
  const [error, setError]             = useState<string>("");
  const [success, setSuccess]         = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef   = useRef<HTMLInputElement>(null);

  const eff: Preset = preset === "custom"
    ? {
        ...PRESETS.custom,
        photoW: customPhotoW, photoH: customPhotoH,
        sigW: customSigW,     sigH: customSigH,
        maxKB: customMaxKB,
        canvasW: customPhotoW + customSigW + 20,
        canvasH: Math.max(customPhotoH, customSigH),
      }
    : PRESETS[preset];

  // ── File handlers — FIX: 20MB size check added ──

  const handlePhotoFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file for photo.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Photo exceeds 20 MB limit. Please use a smaller image.");
      return;
    }
    setError("");
    setPhotoFile(file);
    const url = await fileToDataURL(file);
    setPhotoURL(url);
    setPreviewURL("");
    setOutputBlob(null);
  }, []);

  const handleSigFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file for signature.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Signature image exceeds 20 MB limit. Please use a smaller image.");
      return;
    }
    setError("");
    setSigFile(file);
    const url = await fileToDataURL(file);
    setSigURL(url);
    setPreviewURL("");
    setOutputBlob(null);
  }, []);

  // ── Drag handlers ──

  function makeDragHandlers(
    setDrag: (v: boolean) => void,
    handleFile: (f: File) => void
  ) {
    return {
      onDragOver:  (e: React.DragEvent) => { e.preventDefault(); setDrag(true); },
      onDragLeave: () => setDrag(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      },
    };
  }

  // ── Generate ──

  const generate = useCallback(async () => {
    if (!photoURL || !sigURL) {
      setError("Please upload both a photo and a signature before generating.");
      return;
    }
    setError("");
    setProcessing(true);
    setSuccess(false);

    try {
      const [photoImg, sigImg] = await Promise.all([
        loadImage(photoURL),
        loadImage(sigURL),
      ]);

      const pw  = eff.photoW;
      const ph  = eff.photoH;
      const sw  = eff.sigW;
      const sh  = eff.sigH;
      const GAP = 8;

      let canvasW: number;
      let canvasH: number;

      if (layout === "left") {
        canvasW = pw + GAP + sw;
        canvasH = Math.max(ph, sh);
      } else {
        canvasW = Math.max(pw, sw);
        canvasH = ph + GAP + sh;
      }

      const canvas    = document.createElement("canvas");
      canvas.width    = canvasW;
      canvas.height   = canvasH;
      const ctx       = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, canvasH);

      if (layout === "left") {
        const sigY = Math.floor((canvasH - sh) / 2);
        drawWithWhiteBg(ctx, photoImg, 0, 0, pw, ph, false);
        drawWithWhiteBg(ctx, sigImg, pw + GAP, sigY, sw, sh, true);
      } else {
        const sigX = Math.floor((canvasW - sw) / 2);
        drawWithWhiteBg(ctx, photoImg, 0, 0, pw, ph, false);
        drawWithWhiteBg(ctx, sigImg, sigX, ph + GAP, sw, sh, true);
      }

      const blob = await compressToJPEG(canvas, eff.maxKB);
      const url  = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputSize(blob.size);
      setPreviewURL(url);
      setSuccess(true);
    } catch (err: unknown) {
      // FIX: no console.error — user-facing message only
      const msg = err instanceof Error ? err.message : "Something went wrong while generating. Please try again.";
      setError(msg);
    } finally {
      setProcessing(false);
    }
  }, [photoURL, sigURL, eff, layout]);

  // Auto re-generate when both images ready
  useEffect(() => {
    if (photoURL && sigURL) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoURL, sigURL, preset, layout, customPhotoW, customPhotoH, customSigW, customSigH, customMaxKB]);

  // ── Download ──

  const handleDownload = useCallback(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a   = document.createElement("a");
    a.href    = url;
    a.download = "photo_signature_combined.jpg";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [outputBlob]);

  // ── Reset ──

  const handleReset = useCallback(() => {
    setPhotoFile(null); setPhotoURL("");
    setSigFile(null);   setSigURL("");
    setPreviewURL("");  setOutputBlob(null);
    setOutputSize(0);   setError(""); setSuccess(false);
    setPreset("ssc");   setLayout("left");
  }, []);

  // ── Render ──

  return (
    <>
      <Navbar />

      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: 80 }}>

        {/* ── Top Ad — flush under navbar ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="container-sm" style={{ padding: "32px 20px 0" }}>

          {/* ══ PAGE HEADER ══ */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🪪 Free Image Tool
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Photo + Signature Joiner
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65 }}>
              Combine photo and signature for SSC, IBPS, Railway, UPSC & Vyapam forms.{" "}
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
            {/* FIX: ← All Tools button */}
            <a
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand-border)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
            >
              ← All Tools
            </a>
          </div>

          {/* ══ MAIN PANEL ══ */}
          <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "26px", marginBottom: "20px", boxShadow: "var(--shadow-md)" }}>

            {/* Step 1: Preset */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                Step 1 — Select Exam / Preset
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {(Object.entries(PRESETS) as [PresetKey, Preset][]).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => { setPreset(key); setPreviewURL(""); setOutputBlob(null); }}
                    style={{
                      padding: "10px 12px", borderRadius: "var(--radius-md)",
                      border: preset === key ? "2px solid var(--brand)" : "1.5px solid var(--border-light)",
                      background: preset === key ? "var(--brand-light)" : "#fff",
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "var(--font)", transition: "all .15s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: preset === key ? "var(--brand)" : "var(--text-primary)" }}>{p.label}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.4 }}>{p.desc}</div>
                  </button>
                ))}
              </div>

              {preset === "custom" && (
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Photo W (px)", val: customPhotoW, set: setCustomPhotoW },
                    { label: "Photo H (px)", val: customPhotoH, set: setCustomPhotoH },
                    { label: "Sig W (px)",   val: customSigW,   set: setCustomSigW   },
                    { label: "Sig H (px)",   val: customSigH,   set: setCustomSigH   },
                    { label: "Max KB",       val: customMaxKB,  set: setCustomMaxKB  },
                  ].map(({ label, val, set }) => (
                    <div key={label}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>{label}</label>
                      <input
                        type="number" className="input"
                        value={val} min={10} max={2000}
                        onChange={(e) => set(Number(e.target.value))}
                        style={{ padding: "8px 12px", fontSize: 13 }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Layout */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                Step 2 — Layout
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {([
                  { key: "left" as Layout, label: "📸 Photo Left · Signature Right", desc: "Standard for most exams" },
                  { key: "top"  as Layout, label: "⬆️ Photo Top · Signature Below",  desc: "Alternate layout" },
                ]).map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => { setLayout(key); setPreviewURL(""); setOutputBlob(null); }}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)",
                      border: layout === key ? "2px solid var(--brand)" : "1.5px solid var(--border-light)",
                      background: layout === key ? "var(--brand-light)" : "#fff",
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "var(--font)", transition: "all .15s",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: layout === key ? "var(--brand)" : "var(--text-primary)" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Upload zones */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                Step 3 — Upload Images
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Photo Upload */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>📷 Passport Photo</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{eff.photoW}×{eff.photoH}px</span>
                  </div>
                  <div
                    className={`upload-zone${photoDrag ? " drag-over" : ""}`}
                    onClick={() => photoInputRef.current?.click()}
                    {...makeDragHandlers(setPhotoDrag, handlePhotoFile)}
                    style={{
                      cursor: "pointer", minHeight: 130,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 8, padding: 12, position: "relative", overflow: "hidden",
                      borderColor: photoDrag ? "var(--brand)" : photoURL ? "var(--brand)" : undefined,
                      background:  photoDrag ? "var(--brand-light)" : photoURL ? "var(--bg-muted)" : undefined,
                    }}
                  >
                    {photoURL ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photoURL} alt="Photo preview" style={{ maxHeight: 110, maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "contain" }} />
                        <span style={{ fontSize: 10, color: "var(--brand)", fontWeight: 600 }}>{photoFile?.name} · Click to change</span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, opacity: 0.5 }}>🖼️</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textAlign: "center" }}>Click or Drag & Drop</div>
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)", textAlign: "center" }}>JPG, PNG, WebP · max 20 MB</div>
                      </>
                    )}
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
                </div>

                {/* Signature Upload */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>✍️ Signature</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{eff.sigW}×{eff.sigH}px · auto-whitened</span>
                  </div>
                  <div
                    className={`upload-zone${sigDrag ? " drag-over" : ""}`}
                    onClick={() => sigInputRef.current?.click()}
                    {...makeDragHandlers(setSigDrag, handleSigFile)}
                    style={{
                      cursor: "pointer", minHeight: 130,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 8, padding: 12, position: "relative", overflow: "hidden",
                      borderColor: sigDrag ? "var(--brand)" : sigURL ? "var(--brand)" : undefined,
                      background:  sigDrag ? "var(--brand-light)" : sigURL ? "var(--bg-muted)" : undefined,
                    }}
                  >
                    {sigURL ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sigURL} alt="Signature preview" style={{ maxHeight: 70, maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "contain", background: "#fff", padding: 4 }} />
                        <span style={{ fontSize: 10, color: "var(--brand)", fontWeight: 600 }}>{sigFile?.name} · Click to change</span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, opacity: 0.5 }}>✍️</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textAlign: "center" }}>Click or Drag & Drop</div>
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)", textAlign: "center" }}>Sign on white paper · max 20 MB</div>
                      </>
                    )}
                  </div>
                  <input ref={sigInputRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSigFile(f); }} />
                </div>
              </div>
            </div>

            {/* FIX: alert-error class */}
            {error && (
              <div className="alert-error" role="alert" style={{ marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Processing */}
            {processing && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="spinner" style={{ width: 14, height: 14 }} />
                  <span>Generating combined image…</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: "100%" }} />
                </div>
              </div>
            )}

            {/* Preview + Download */}
            {previewURL && !processing && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                  Step 4 — Preview &amp; Download
                </label>

                <div style={{ background: "var(--brand-light)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 12, fontSize: 12.5, color: "var(--brand-dark)", display: "flex", gap: 8 }}>
                  <span>ℹ️</span>
                  <span>
                    Output size: <strong>{formatKB(outputSize)}</strong> / {eff.maxKB} KB limit
                    {outputSize > eff.maxKB * 1024
                      ? " — ⚠️ Exceeds limit! Try a smaller photo."
                      : " — ✅ Within limit"}
                  </span>
                </div>

                {/* FIX: preview box — CSS vars only, no hardcoded hex */}
                <div style={{
                  background: "var(--bg-muted)",
                  borderRadius: "var(--radius-lg)",
                  border: "1.5px solid var(--border-light)",
                  padding: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14, minHeight: 100,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewURL}
                    alt="Combined photo + signature preview"
                    style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-md)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" onClick={handleDownload} style={{ flex: 2, padding: "12px 20px", fontSize: 14 }}>
                    ⬇️ Download JPEG
                  </button>
                  <button className="btn-secondary" onClick={handleReset} style={{ flex: 1 }}>
                    🔄 Reset
                  </button>
                </div>
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <a href="/" style={{ fontSize: "12.5px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none" }}>← Back to All Tools</a>
                </div>
              </div>
            )}

            {/* Idle CTA */}
            {!photoURL && !sigURL && (
              <div style={{ textAlign: "center", padding: "16px 0 4px" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                  Upload your photo and signature above to get started instantly.
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => photoInputRef.current?.click()} style={{ fontSize: 13 }}>
                    📷 Upload Photo
                  </button>
                  <button className="btn-secondary" onClick={() => sigInputRef.current?.click()} style={{ fontSize: 13 }}>
                    ✍️ Upload Signature
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin: "24px 0" }}>
            <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ── Dimension Reference Table ── */}
          <section style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 14 }}>
              📐 Official Dimensions Reference
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--brand-light)", borderBottom: "2px solid var(--brand-mid)" }}>
                    {["Exam", "Photo Size", "Signature Size", "Max File Size"].map((h) => (
                      <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 800, color: "var(--brand-dark)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { exam: "SSC CGL / CHSL / MTS",  photo: "200×230 px", sig: "200×75 px",  max: "50 KB"  },
                    { exam: "IBPS PO / Clerk / SO",   photo: "200×230 px", sig: "140×60 px",  max: "100 KB" },
                    { exam: "RRB NTPC / Group D",     photo: "132×170 px", sig: "140×60 px",  max: "40 KB"  },
                    { exam: "MP Vyapam / MP PEB",     photo: "200×230 px", sig: "200×75 px",  max: "50 KB"  },
                    { exam: "UPSC Civil Services",    photo: "300×350 px", sig: "140×60 px",  max: "300 KB" },
                    { exam: "SBI PO / Clerk",         photo: "200×200 px", sig: "140×60 px",  max: "50 KB"  },
                    { exam: "RRC Group D 2024",       photo: "132×165 px", sig: "120×60 px",  max: "40 KB"  },
                    { exam: "SSC CPO / GD Constable", photo: "200×230 px", sig: "200×75 px",  max: "50 KB"  },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)", background: i % 2 === 0 ? "#fff" : "var(--bg-subtle)" }}>
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{row.exam}</td>
                      <td style={{ padding: "9px 12px", color: "var(--text-secondary)" }}>{row.photo}</td>
                      <td style={{ padding: "9px 12px", color: "var(--text-secondary)" }}>{row.sig}</td>
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "var(--brand)" }}>{row.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── How to Use ── */}
          <section style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              📖 How to Use — 4 Easy Steps
            </h2>
            {[
              { n: "1", icon: "🎯", title: "Select Your Exam",   body: "Choose from SSC, IBPS, Railway, Vyapam, UPSC, or set Custom dimensions. The tool auto-adjusts photo and signature sizes to official specs." },
              { n: "2", icon: "📷", title: "Upload Your Photo",  body: "Upload a recent passport-style photo. White or light background recommended. The tool resizes it to exact exam dimensions automatically." },
              { n: "3", icon: "✍️", title: "Upload Signature",   body: "Sign on plain white paper with a black/blue pen, then take a clear photo. Background is auto-whitened so your signature looks clean." },
              { n: "4", icon: "⬇️", title: "Download JPEG",      body: "Preview the combined image instantly. Click Download to save as photo_signature_combined.jpg — ready to upload on the exam portal." },
            ].map(({ n, icon, title, body }) => (
              <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 13 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "var(--brand)", color: "#fff", fontSize: 11, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>
                  {n}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", marginBottom: 3 }}>{icon} {title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>{body}</div>
                </div>
              </div>
            ))}
          </section>

          {/* ── FAQ (6 Q&As) ── */}
          <section style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>
              ❓ Frequently Asked Questions
            </h2>
            <FAQSection />
          </section>

          {/* ── Related Tools (8 cards) ── */}
          <section style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 12 }}>
              🔗 Related Tools
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10 }}>
              {[
                { href: "/image-resize",  icon: "🖼️", title: "Image Resize",    desc: "Resize for any exam"       },
                { href: "/image-to-pdf",  icon: "📄", title: "Image to PDF",    desc: "Convert images to PDF"     },
                { href: "/image-crop",    icon: "🎨", title: "Image Crop",      desc: "Crop to exact dimensions"  },
                { href: "/pdf-compress",  icon: "🗜️", title: "PDF Compress",    desc: "Reduce PDF file size"      },
                { href: "/pdf-merge",     icon: "🔗", title: "PDF Merge",       desc: "Combine PDFs into one"     },
                { href: "/pdf-split",     icon: "✂️", title: "PDF Split",       desc: "Extract PDF pages"         },
                { href: "/pdf-protect",   icon: "🔒", title: "PDF Protect",     desc: "Password protect PDF"      },
                { href: "/ai-letter",     icon: "🤖", title: "AI Letter Writer",desc: "Write with AI"             },
              ].map((t) => (
                <a key={t.href} href={t.href} className="tool-card" style={{ padding: "14px" }}>
                  <div className="tool-card-icon" style={{ marginBottom: 7 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.desc}</div>
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

        {/* FIX: Shared Footer component */}
        <Footer />

      </main>
    </>
  );
}

// ── FAQ Component (6 Q&As) ────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does this tool upload my photo or signature to any server?",
      a: "No. EzSeva Photo + Signature Joiner works 100% in your browser. Your images are never sent to any server. All processing happens locally on your device using HTML5 Canvas API.",
    },
    {
      q: "Why does my combined image still exceed the file size limit?",
      a: "The tool automatically compresses JPEG quality to meet the preset's maximum KB limit. If it still exceeds, try a smaller photo or choose a higher max KB preset using Custom. Very high-resolution inputs may still be large after compression.",
    },
    {
      q: "What if my signature has a coloured or grey background?",
      a: "The tool automatically fills a white background behind your signature before drawing it. For best results, sign on clean white paper with a blue or black pen and photograph it in good lighting.",
    },
    {
      q: "Which dimensions are required for SSC CGL 2024?",
      a: "SSC CGL 2024 requires: Photo 3.5×4.5 cm (approx 200×230 px), Signature 3.5×1.5 cm (approx 200×75 px), combined JPEG not exceeding 50 KB. Use the SSC preset — it handles all these specs automatically.",
    },
    {
      q: "Can I use this for IBPS PO and IBPS Clerk?",
      a: "Yes. The IBPS preset is configured with official IBPS CRP 2024 dimensions: Photo 200×230 px, Signature 140×60 px, combined JPEG under 100 KB. Select the IBPS preset, upload your images, and download.",
    },
    {
      q: "Does this work on mobile phones?",
      a: "Yes, EzSeva Photo + Signature Joiner is fully mobile-responsive. You can upload photos from your gallery or camera on Android or iPhone, and download the combined image directly to your phone.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{ borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-light)", overflow: "hidden" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
              padding: "13px 16px",
              background: open === i ? "var(--brand-light)" : "#fff",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font)", fontSize: 13.5, fontWeight: 700,
              color: open === i ? "var(--brand)" : "var(--text-primary)",
              textAlign: "left", transition: "all .15s",
            }}
          >
            <span>{faq.q}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }}>
              <polyline points="2 5 7 10 12 5" />
            </svg>
          </button>
          {open === i && (
            <div style={{ padding: "0 16px 14px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, background: "var(--brand-light)" }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/*
export const metadata = {
  title: "Photo + Signature Joiner Free — SSC, IBPS, Railway, UPSC | EzSeva",
  description: "Combine passport photo and signature for SSC, IBPS, Railway, UPSC, Vyapam forms. Free online tool — files never leave your device. No signup needed.",
  keywords: ["photo signature joiner","ssc photo signature combine","ibps photo signature","railway form photo signature","govt exam photo joiner india"],
  openGraph: { title: "Free Photo + Signature Joiner | EzSeva", description: "Combine photo and signature instantly. 100% private.", url: "https://ezseva.in/photo-joiner", siteName: "EzSeva" },
  alternates: { canonical: "https://ezseva.in/photo-joiner" },
};
*/