"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Types ──────────────────────────────────────────────── */

interface Preset {
  id: string;
  label: string;
  subLabel: string;
  badge?: string;
  width: number;
  height: number;
  maxKB: number;
  format: OutputFormat;
}

type OutputFormat = "jpeg" | "png" | "webp";

interface ProcessedResult {
  dataUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  format: OutputFormat;
}

/* ─── Researched Exam Presets ────────────────────────────── */

const PRESETS: Preset[] = [
  {
    id: "ssc",
    label: "SSC CGL / CHSL",
    subLabel: "200×230 px · max 20 KB · JPEG",
    badge: "HOT",
    width: 200,
    height: 230,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "rrb",
    label: "Railway RRB / NTPC",
    subLabel: "200×230 px · max 15 KB · JPEG",
    badge: "HOT",
    width: 200,
    height: 230,
    maxKB: 15,
    format: "jpeg",
  },
  {
    id: "ibps",
    label: "IBPS PO / Clerk",
    subLabel: "200×230 px · max 50 KB · JPEG",
    badge: "",
    width: 200,
    height: 230,
    maxKB: 50,
    format: "jpeg",
  },
  {
    id: "vyapam",
    label: "VYAPAM / MP PEB",
    subLabel: "200×230 px · max 30 KB · JPEG",
    badge: "MP",
    width: 200,
    height: 230,
    maxKB: 30,
    format: "jpeg",
  },
  {
    id: "mppolice",
    label: "MP Police",
    subLabel: "200×230 px · max 20 KB · JPEG",
    badge: "MP",
    width: 200,
    height: 230,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "upsc",
    label: "UPSC / IAS",
    subLabel: "300×400 px · max 300 KB · JPEG",
    badge: "",
    width: 300,
    height: 400,
    maxKB: 300,
    format: "jpeg",
  },
  {
    id: "bpsc",
    label: "Bihar PSC / BPSC",
    subLabel: "140×160 px · max 20 KB · JPEG",
    badge: "",
    width: 140,
    height: 160,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "neet",
    label: "NEET / JEE / NTA",
    subLabel: "413×531 px · max 100 KB · JPEG",
    badge: "",
    width: 413,
    height: 531,
    maxKB: 100,
    format: "jpeg",
  },
  {
    id: "passport",
    label: "Passport / Visa",
    subLabel: "600×600 px · max 50 KB · JPEG",
    badge: "",
    width: 600,
    height: 600,
    maxKB: 50,
    format: "jpeg",
  },
  {
    id: "custom",
    label: "Custom Size",
    subLabel: "Set your own dimensions",
    badge: "",
    width: 0,
    height: 0,
    maxKB: 0,
    format: "jpeg",
  },
];

/* ─── Utility ────────────────────────────────────────────── */

function fmtKB(bytes: number): string {
  const kb = bytes / 1024;
  return kb >= 1000 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
}

function estimateBase64KB(dataUrl: string, mime: string): number {
  const prefix = `data:${mime};base64,`;
  const base64Len = dataUrl.length - prefix.length;
  return Math.ceil((base64Len * 3) / 4 / 1024);
}

/* ─── Sub-components ─────────────────────────────────────── */

function StepLabel({ number, text }: { number: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
      <div
        style={{
          width: 30, height: 30,
          borderRadius: "50%",
          background: "var(--brand)",
          color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 900, flexShrink: 0,
          boxShadow: "0 4px 12px rgba(13,148,136,.3)",
        }}
      >
        {number}
      </div>
      <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>{text}</span>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "var(--brand-light)",
      border: "1px solid var(--brand-mid)",
      borderRadius: "var(--radius-md)",
      padding: "10px 20px",
      textAlign: "center",
      flex: 1,
      minWidth: "90px",
    }}>
      <div style={{ fontSize: "17px", fontWeight: 900, color: "var(--brand)" }}>{value}</div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

export default function ImageResizePage() {
  /* Upload */
  const [file, setFile]             = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [origDims, setOrigDims]     = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* Settings */
  const [selectedPreset, setSelectedPreset] = useState<string>("ssc");
  const [customW, setCustomW]               = useState("800");
  const [customH, setCustomH]               = useState("600");
  const [customKB, setCustomKB]             = useState("200");
  const [format, setFormat]                 = useState<OutputFormat>("jpeg");
  const [quality, setQuality]               = useState(85);

  /* Output */
  const [result, setResult]         = useState<ProcessedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePreset = PRESETS.find((p) => p.id === selectedPreset)!;

  /* ── File handler ─────────────────────────────────────── */

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Only image files allowed (JPG, PNG, WebP, GIF).");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File exceeds 20 MB limit. Please use a smaller image.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);

    const url = URL.createObjectURL(f);
    setPreviewSrc(url);

    const img = new Image();
    img.onload = () => setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }, []);

  /* ── Drag & drop ──────────────────────────────────────── */

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  /* ── Canvas processing ─────────────────────────────────── */

  const processImage = useCallback(async () => {
    if (!file || !previewSrc) return;

    setProcessing(true);
    setProgress(10);
    setError(null);
    setResult(null);

    try {
      let targetW: number;
      let targetH: number;
      let targetKB: number;
      let outputFormat: OutputFormat;

      if (selectedPreset === "custom") {
        targetW      = Math.max(1, Math.min(5000, parseInt(customW) || 800));
        targetH      = Math.max(1, Math.min(5000, parseInt(customH) || 600));
        targetKB     = Math.max(1, Math.min(10000, parseInt(customKB) || 200));
        outputFormat = format;
      } else {
        targetW      = activePreset.width;
        targetH      = activePreset.height;
        targetKB     = activePreset.maxKB;
        outputFormat = activePreset.format;
        setFormat(activePreset.format);
      }

      setProgress(25);

      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload  = () => res(i);
        i.onerror = () => rej(new Error("Image failed to load. Try a different file."));
        i.src = previewSrc;
      });

      setProgress(50);

      const canvas    = document.createElement("canvas");
      canvas.width    = targetW;
      canvas.height   = targetH;
      const ctx       = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);
      setProgress(70);

      const mimeMap: Record<OutputFormat, string> = {
        jpeg: "image/jpeg",
        png:  "image/png",
        webp: "image/webp",
      };
      const mime = mimeMap[outputFormat];

      let dataUrl: string;

      if (outputFormat === "png") {
        dataUrl = canvas.toDataURL(mime);
      } else {
        let lo = 0.05, hi = 1.0;
        dataUrl = canvas.toDataURL(mime, quality / 100);

        if (targetKB > 0) {
          for (let i = 0; i < 14; i++) {
            const mid  = (lo + hi) / 2;
            const test = canvas.toDataURL(mime, mid);
            const kb   = estimateBase64KB(test, mime);

            if (kb <= targetKB) {
              lo      = mid;
              dataUrl = test;
              if (targetKB - kb < 0.5) break;
            } else {
              hi = mid;
            }
          }
          dataUrl = canvas.toDataURL(mime, lo);
        }
      }

      setProgress(90);

      const finalKB = estimateBase64KB(dataUrl, mime);

      setResult({
        dataUrl,
        sizeKB:  finalKB,
        width:   targetW,
        height:  targetH,
        format:  outputFormat,
      });

      setProgress(100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [file, previewSrc, selectedPreset, customW, customH, customKB, format, quality, activePreset]);

  /* ── Download — FIX-2: Chrome PDF MIME safe pattern ──── */

  const handleDownload = () => {
    if (!result || !file) return;
    const ext      = result.format === "jpeg" ? "jpg" : result.format;
    const name     = file.name.replace(/\.[^.]+$/, "");
    const filename = `${name}_${result.width}x${result.height}.${ext}`;
    const url      = result.dataUrl;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // dataUrl — no blob URL to revoke
  };

  /* ── Reset ─────────────────────────────────────────────── */

  const handleReset = () => {
    setFile(null);
    setPreviewSrc(null);
    setOrigDims(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Cleanup blob URL on unmount / change ─────────────── */
  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  /* ── Render ───────────────────────────────────────────── */
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh", background: "var(--bg-subtle)", fontFamily: "var(--font)" }}>

        {/* ── AdSense Auto Ad (Top) — flush under navbar ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <div className="container-sm" style={{ padding: "36px 20px 80px" }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "var(--brand-light)", border: "1px solid var(--brand-border)",
              borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🖼️ Free Image Tool
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900,
              letterSpacing: "-0.8px", color: "var(--text-primary)",
              lineHeight: 1.15, marginBottom: "10px",
            }}>
              Image Resize — Free Online
            </h1>

            <p style={{
              fontSize: "14.5px", color: "var(--text-muted)",
              maxWidth: "460px", margin: "0 auto 16px", lineHeight: 1.65,
            }}>
              Resize photos for SSC, Railway, UPSC, VYAPAM, Passport & more.{" "}
              <strong style={{ color: "var(--brand)" }}>Your file never leaves your device.</strong>
            </p>

            {/* ── Trust Pills ── */}
            <div style={{
              display: "flex", gap: "8px", justifyContent: "center",
              flexWrap: "wrap", marginBottom: "18px",
            }}>
              {[
                { icon: "🔒", text: "100% Private" },
                { icon: "⚡", text: "Instant" },
                { icon: "📱", text: "Mobile Ready" },
                { icon: "₹", text: "Free Forever" },
              ].map((t) => (
                <span key={t.text} style={{
                  fontSize: "11.5px", padding: "4px 11px",
                  background: "var(--brand-light)", color: "var(--brand)",
                  borderRadius: "99px", fontWeight: 700,
                  border: "1px solid var(--brand-mid)",
                }}>
                  {t.icon} {t.text}
                </span>
              ))}
            </div>

            {/* ── FIX-14: ← All Tools button ── */}
            <a
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand-border)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
            >
              ← All Tools
            </a>
          </div>

          {/* ════════════════════════════════════════
              STEP 1 — UPLOAD
          ════════════════════════════════════════ */}
          <section
            aria-labelledby="step1-label"
            style={{
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "26px",
              marginBottom: "16px", boxShadow: "var(--shadow-sm)",
            }}
          >
            <StepLabel number="1" text="Upload Your Photo" />

            {!file ? (
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload image — click or drag and drop"
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className="upload-zone"
                style={{
                  border: `2px dashed ${isDragging ? "var(--brand)" : "var(--brand-border)"}`,
                  borderRadius: "var(--radius-lg)", padding: "44px 24px",
                  textAlign: "center", cursor: "pointer",
                  background: isDragging ? "var(--brand-light)" : "var(--bg-muted)",
                  transition: "all 0.18s ease",
                  outline: "none",
                }}
              >
                <div style={{ fontSize: "38px", marginBottom: "10px" }}>📸</div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "5px" }}>
                  Drag & drop or click to upload
                </p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  JPG, PNG, WebP · max 20 MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  aria-label="File input"
                  style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>
            ) : (
              <div style={{
                display: "flex", gap: "16px", alignItems: "center",
                flexWrap: "wrap",
                padding: "14px", background: "var(--bg-muted)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
              }}>
                {previewSrc && (
                  <img
                    src={previewSrc}
                    alt="Original preview"
                    style={{
                      width: "72px", height: "72px", objectFit: "cover",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-light)",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)", marginBottom: "3px" }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {fmtKB(file.size)}
                    {origDims ? ` · ${origDims.w}×${origDims.h} px` : ""}
                    {` · ${file.type.split("/")[1]?.toUpperCase()}`}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  aria-label="Remove uploaded file"
                  className="btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 14px", color: "#dc2626", borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
                >
                  ✕ Remove
                </button>
              </div>
            )}

            {/* ── FIX-15: Error via .alert-error ── */}
            {error && (
              <div className="alert-error" role="alert" style={{ marginTop: "14px" }}>
                ⚠️ {error}
              </div>
            )}
          </section>

          {/* ════════════════════════════════════════
              STEP 2 — PRESET / SIZE
          ════════════════════════════════════════ */}
          <section
            aria-labelledby="step2-label"
            style={{
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "26px",
              marginBottom: "16px", boxShadow: "var(--shadow-sm)",
            }}
          >
            <StepLabel number="2" text="Choose Size / Preset" />

            {/* Preset grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
              gap: "9px", marginBottom: "20px",
            }}>
              {PRESETS.map((preset) => {
                const isActive = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    aria-pressed={isActive}
                    style={{
                      border: `2px solid ${isActive ? "var(--brand)" : "var(--border-light)"}`,
                      borderRadius: "var(--radius-md)", padding: "11px 13px",
                      background: isActive ? "var(--brand-light)" : "#fff",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s ease", fontFamily: "var(--font)",
                      position: "relative",
                    }}
                  >
                    {/* FIX-3: Badge — CSS vars only, no hardcoded hex */}
                    {preset.badge && (
                      <span style={{
                        position: "absolute", top: "7px", right: "8px",
                        fontSize: "8px", fontWeight: 800, letterSpacing: "0.5px",
                        background: preset.badge === "HOT" ? "var(--brand-light)" : "var(--bg-muted)",
                        color: preset.badge === "HOT" ? "var(--accent)" : "var(--brand)",
                        border: `1px solid ${preset.badge === "HOT" ? "var(--brand-border)" : "var(--brand-mid)"}`,
                        borderRadius: "4px", padding: "2px 5px",
                      }}>
                        {preset.badge}
                      </span>
                    )}
                    <div style={{
                      fontSize: "12.5px", fontWeight: 700, marginBottom: "3px",
                      color: isActive ? "var(--brand)" : "var(--text-primary)",
                      paddingRight: preset.badge ? "30px" : "0",
                    }}>
                      {preset.label}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {preset.subLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom inputs */}
            {selectedPreset === "custom" && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px", marginBottom: "20px",
                padding: "16px", background: "var(--bg-muted)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
              }}>
                {[
                  { label: "Width (px)",    value: customW,  set: setCustomW,  ph: "800" },
                  { label: "Height (px)",   value: customH,  set: setCustomH,  ph: "600" },
                  { label: "Max Size (KB)", value: customKB, set: setCustomKB, ph: "200" },
                ].map(({ label, value, set, ph }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "5px" }}>
                      {label}
                    </label>
                    <input
                      type="number"
                      value={value}
                      placeholder={ph}
                      min={1}
                      max={5000}
                      onChange={(e) => set(e.target.value)}
                      className="input"
                      style={{ padding: "9px 10px", fontSize: "14px" }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Format + Quality */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label htmlFor="format-select" style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Output Format
                </label>
                <select
                  id="format-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="input"
                  style={{ width: "100%", padding: "9px 12px", cursor: "pointer" }}
                >
                  <option value="jpeg">JPEG — Smallest file (recommended)</option>
                  <option value="png">PNG — Lossless / transparent</option>
                  <option value="webp">WebP — Modern, ultra-small</option>
                </select>
              </div>

              {format !== "png" && (
                <div style={{ flex: 2, minWidth: "200px" }}>
                  <label
                    htmlFor="quality-slider"
                    style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "11.5px", fontWeight: 700, color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    <span>Quality</span>
                    <span style={{ color: "var(--brand)", fontWeight: 800 }}>{quality}%</span>
                  </label>
                  <input
                    id="quality-slider"
                    type="range"
                    min={10} max={100} step={5}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--brand)", cursor: "pointer" }}
                  />
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "10px", color: "var(--text-hint)", marginTop: "2px",
                  }}>
                    <span>Smaller file</span>
                    <span>Best quality</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── FIX-16: Progress bar ── */}
          {processing && progress > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%`, transition: "width 0.4s ease" }}
                />
              </div>
              <p style={{ fontSize: "11px", color: "var(--brand)", textAlign: "center", marginTop: "6px", fontWeight: 600 }}>
                Processing image…
              </p>
            </div>
          )}

          {/* ── RESIZE BUTTON ── */}
          <button
            onClick={processImage}
            disabled={!file || processing}
            className={file && !processing ? "btn-primary" : ""}
            aria-label="Resize image"
            aria-busy={processing}
            style={{
              width: "100%", padding: "15px",
              fontSize: "15px", fontWeight: 800,
              borderRadius: "var(--radius-lg)",
              cursor: !file || processing ? "not-allowed" : "pointer",
              background: !file || processing ? "var(--border-light)" : undefined,
              color: !file || processing ? "var(--text-hint)" : undefined,
              border: "none", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              marginBottom: "20px",
            }}
          >
            {processing ? (
              <>
                <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                Processing…
              </>
            ) : (
              "🖼️ Resize Image — Free"
            )}
          </button>

          {/* ════════════════════════════════════════
              RESULT
          ════════════════════════════════════════ */}
          {result && (
            <section
              aria-label="Resized image result"
              style={{
                background: "#fff", border: "2px solid var(--brand)",
                borderRadius: "var(--radius-xl)", padding: "26px",
                marginBottom: "24px", boxShadow: "var(--shadow-md)",
                animation: "fadeUp 0.3s ease",
              }}
            >
              <StepLabel number="3" text="Download Your Image" />

              {/* Before / After */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "14px", marginBottom: "18px",
              }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px", fontWeight: 800, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                    BEFORE
                  </p>
                  {previewSrc && (
                    <img
                      src={previewSrc}
                      alt="Original image before resize"
                      style={{
                        maxWidth: "100%", maxHeight: "170px", objectFit: "contain",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-light)",
                      }}
                    />
                  )}
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                    {file ? fmtKB(file.size) : ""}
                    {origDims ? ` · ${origDims.w}×${origDims.h}` : ""}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "10px", fontWeight: 800, color: "var(--brand)", marginBottom: "8px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                    AFTER ✓
                  </p>
                  <img
                    src={result.dataUrl}
                    alt="Resized image result"
                    style={{
                      maxWidth: "100%", maxHeight: "170px", objectFit: "contain",
                      borderRadius: "var(--radius-md)",
                      border: "2px solid var(--brand)",
                    }}
                  />
                  <p style={{ fontSize: "12px", color: "var(--brand)", marginTop: "6px", fontWeight: 700 }}>
                    {result.sizeKB} KB · {result.width}×{result.height}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                <StatChip label="File Size"  value={`${result.sizeKB} KB`} />
                <StatChip label="Dimensions" value={`${result.width}×${result.height}`} />
                <StatChip label="Format"     value={result.format.toUpperCase()} />
              </div>

              {/* Size reduction % */}
              {file && (
                <div className="alert-success" style={{ marginBottom: "16px" }}>
                  ✅ Size reduced by{" "}
                  <strong>
                    {Math.max(0, Math.round((1 - (result.sizeKB * 1024) / file.size) * 100))}%
                  </strong>{" "}
                  — from {fmtKB(file.size)} to {result.sizeKB} KB
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleDownload}
                  className="btn-primary"
                  style={{ flex: 2, padding: "13px", fontSize: "14px", fontWeight: 800, borderRadius: "var(--radius-md)", cursor: "pointer", border: "none", minWidth: "160px" }}
                >
                  ⬇️ Download Image
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{ flex: 1, padding: "13px", fontSize: "13px", borderRadius: "var(--radius-md)", cursor: "pointer", minWidth: "110px" }}
                >
                  🔄 New Image
                </button>
              </div>

              {/* Back to Home */}
              <div style={{ textAlign: "center", marginTop: "14px" }}>
                <a href="/" style={{ fontSize: "12.5px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none" }}>
                  ← Back to All Tools
                </a>
              </div>
            </section>
          )}

          {/* ── Mid Ad (Auto Ads) ── */}
          <div aria-hidden="true" style={{ margin: "24px 0" }}>
            <ins
              className="adsbygoogle"
              style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          {/* ── How to Use ── */}
          <section
            aria-label="How to use"
            style={{
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "26px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px", color: "var(--text-primary)" }}>
              📖 How to Use
            </h2>
            {[
              { n: "1", title: "Upload Your Photo",  desc: "Click or drag & drop a JPG, PNG, or WebP image (up to 20 MB)." },
              { n: "2", title: "Select Exam Preset", desc: "Choose from SSC, Railway, UPSC, VYAPAM, Passport — or enter custom dimensions." },
              { n: "3", title: "Click Resize Image", desc: "Processing takes 1–2 seconds and happens entirely in your browser." },
              { n: "4", title: "Download",           desc: "Your resized image downloads instantly. Nothing is sent to any server." },
            ].map(({ n, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--brand)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 900, flexShrink: 0,
                }}>
                  {n}
                </div>
                <div>
                  <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{title}</p>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* ── Exam Specs Reference Table ── */}
          <section
            aria-label="Government exam photo specifications"
            style={{
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "26px",
              marginBottom: "16px", overflowX: "auto",
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
              📋 Official Exam Photo Specifications
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "var(--bg-muted)" }}>
                  {["Exam", "Size (px)", "Max KB", "Format"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left",
                      fontWeight: 800, color: "var(--text-secondary)",
                      borderBottom: "1.5px solid var(--border-light)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["SSC CGL / CHSL",    "200 × 230",  "20 KB",   "JPEG"],
                  ["Railway RRB/NTPC",  "200 × 230",  "15 KB",   "JPEG"],
                  ["IBPS PO / Clerk",   "200 × 230",  "50 KB",   "JPEG"],
                  ["UPSC / IAS",        "300 × 400",  "300 KB",  "JPEG"],
                  ["VYAPAM / MP PEB",   "200 × 230",  "30 KB",   "JPEG"],
                  ["MP Police",         "200 × 230",  "20 KB",   "JPEG"],
                  ["Bihar PSC (BPSC)",  "140 × 160",  "20 KB",   "JPEG"],
                  ["NEET / JEE (NTA)",  "413 × 531",  "100 KB",  "JPEG"],
                  ["Passport / Visa",   "600 × 600",  "50 KB",   "JPEG"],
                ].map(([exam, size, kb, fmt], i) => (
                  <tr key={exam} style={{ background: i % 2 === 0 ? "#fff" : "var(--bg-subtle)" }}>
                    <td style={{ padding: "9px 12px", fontWeight: 700, color: "var(--text-primary)", borderBottom: "1px solid var(--border-light)" }}>{exam}</td>
                    <td style={{ padding: "9px 12px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-light)" }}>{size}</td>
                    <td style={{ padding: "9px 12px", color: "var(--brand)", fontWeight: 700, borderBottom: "1px solid var(--border-light)" }}>{kb}</td>
                    <td style={{ padding: "9px 12px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-light)" }}>{fmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "11px", color: "var(--text-hint)", marginTop: "10px" }}>
              * Specifications subject to change per official exam notifications. Always verify on the official portal before submission.
            </p>
          </section>

          {/* ── FAQ ── */}
          <section
            aria-label="Frequently asked questions"
            style={{
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)", padding: "26px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px", color: "var(--text-primary)" }}>
              ❓ Frequently Asked Questions
            </h2>
            {[
              {
                q: "What is the correct photo size for SSC CGL / CHSL?",
                a: "SSC CGL and CHSL require a photo of 200×230 pixels in JPEG format, with a maximum file size of 20 KB. Use the SSC CGL / CHSL preset to resize your photo automatically.",
              },
              {
                q: "Is my photo uploaded to any server?",
                a: "No. Everything happens inside your browser using the HTML5 Canvas API. Your image is never sent to any server — 100% private and secure.",
              },
              {
                q: "What is the Railway RRB / NTPC photo size?",
                a: "Railway RRB and NTPC recruitment notifications specify a photo size of 200×230 pixels in JPEG format with a maximum size of 15 KB.",
              },
              {
                q: "What size photo is required for VYAPAM / MP PEB exams?",
                a: "MP VYAPAM (MP PEB) requires a photo of 200×230 pixels in JPEG format, with a file size not exceeding 30 KB.",
              },
              {
                q: "Can I use WebP format for government exam forms?",
                a: "Most government portals accept only JPEG format. We recommend keeping JPEG selected for all government exam photo uploads to avoid rejection.",
              },
              {
                q: "What photo size does UPSC / IAS require?",
                a: "UPSC Civil Services requires a photo of 300×400 pixels in JPEG format, with a maximum file size of 300 KB.",
              },
            ].map((faq, i, arr) => (
              <div
                key={faq.q}
                style={{
                  marginBottom: i < arr.length - 1 ? "18px" : "0",
                  paddingBottom: i < arr.length - 1 ? "18px" : "0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none",
                }}
              >
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Q: {faq.q}
                </p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </section>

          {/* ── Related Tools (8 cards) ── */}
          <section aria-label="Related tools">
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px", color: "var(--text-secondary)" }}>
              🔗 Related Tools
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
              {[
                { icon: "🪪", title: "Photo + Signature",  href: "/photo-joiner",  desc: "Merge for govt forms" },
                { icon: "📄", title: "Image to PDF",        href: "/image-to-pdf",  desc: "Combine images" },
                { icon: "🎨", title: "Image Crop",          href: "/image-crop",    desc: "Crop to any ratio" },
                { icon: "🗜️", title: "PDF Compress",        href: "/pdf-compress",  desc: "Shrink PDF size" },
                { icon: "🔀", title: "PDF Merge",           href: "/pdf-merge",     desc: "Combine PDFs" },
                { icon: "✂️", title: "PDF Split",           href: "/pdf-split",     desc: "Split pages" },
                { icon: "🔒", title: "PDF Protect",         href: "/pdf-protect",   desc: "Password protect" },
                { icon: "🤖", title: "AI Letter Writer",    href: "/ai-letter",     desc: "Write with AI" },
              ].map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className="tool-card"
                  style={{ padding: "14px" }}
                >
                  <div className="tool-card-icon" style={{ marginBottom: "8px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* ── Bottom Ad (Auto Ads) ── */}
        <div aria-hidden="true">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* ── FIX-12: Shared Footer component ── */}
        <Footer />

      </main>
    </>
  );
}

/*
export const metadata = {
  title: "Image Resize Online Free — SSC, Railway, VYAPAM, Passport | EzSeva",
  description:
    "Resize photo for SSC CGL, Railway RRB, UPSC, VYAPAM, Passport and more. Free online image resizer — files never leave your device. No signup needed.",
  keywords: [
    "image resize online free",
    "SSC photo resize",
    "Railway form photo size",
    "VYAPAM photo resize",
    "passport photo resize",
    "photo size kaise karein",
    "sarkari exam photo size",
    "MP PEB photo resize",
  ],
  openGraph: {
    title: "Free Image Resize — SSC, Railway, VYAPAM, Passport | EzSeva",
    description: "Resize exam photos instantly. 100% private — files never leave your device.",
    url: "https://ezseva.in/image-resize",
    siteName: "EzSeva",
  },
  alternates: {
    canonical: "https://ezseva.in/image-resize",
  },
};
*/