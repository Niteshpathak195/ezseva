"use client";

import { useState, useCallback, useEffect } from "react";
import JSZip from "jszip";
import ToolPageShell from "../components/tools/ToolPageShell";
import KBStatusBadge from "../components/tools/KBStatusBadge";
import ToolWorkflowCTA from "../components/tools/ToolWorkflowCTA";
import ImageCaptureUpload from "../components/tools/ImageCaptureUpload";
import { RESIZE_PRESETS, type OutputFormat } from "../data/exam-presets";
import { fmtKB, type FitMode } from "../lib/image-utils";
import { isImageFile } from "../lib/file-validation";
import { normalizeImageFile } from "../lib/heic-utils";
import {
  resizeImageFromSource,
  resolveResizeTargets,
  type ResizeOutput,
} from "../lib/resize-processor";

interface ProcessedResult {
  dataUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  format: OutputFormat;
  maxKB: number;
}

interface BatchItem {
  id: string;
  file: File;
  previewSrc: string;
}

interface BatchResult {
  id: string;
  name: string;
  blob: Blob;
  sizeKB: number;
  width: number;
  height: number;
  maxKB: number;
}

const PRESETS = RESIZE_PRESETS;
const MAX_BATCH = 20;

function uid() {
  return Math.random().toString(36).slice(2, 9);
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
  const [mode, setMode] = useState<"single" | "batch">("single");

  /* Upload */
  const [file, setFile]             = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [origDims, setOrigDims]     = useState<{ w: number; h: number } | null>(null);
  /* Settings */
  const [selectedPreset, setSelectedPreset] = useState<string>("ssc");
  const [customW, setCustomW]               = useState("800");
  const [customH, setCustomH]               = useState("600");
  const [customKB, setCustomKB]             = useState("200");
  const [format, setFormat]                 = useState<OutputFormat>("jpeg");
  const [quality, setQuality]               = useState(85);
  const [fitMode, setFitMode]               = useState<FitMode>("cover");

  /* Output */
  const [result, setResult]         = useState<ProcessedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const [batchItems, setBatchItems]     = useState<BatchItem[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);

  const activePreset = PRESETS.find((p) => p.id === selectedPreset)!;

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("preset");
    if (p && PRESETS.some((x) => x.id === p)) setSelectedPreset(p);
  }, []);

  const getTargets = useCallback(() => {
    const t = resolveResizeTargets(selectedPreset, PRESETS, {
      w: customW,
      h: customH,
      kb: customKB,
      format,
    });
    if (selectedPreset !== "custom") setFormat(t.outputFormat);
    return t;
  }, [selectedPreset, customW, customH, customKB, format]);

  /* ── File handler ─────────────────────────────────────── */

  const handleFile = useCallback(async (f: File) => {
    if (!isImageFile(f)) {
      setError("Only image files allowed (JPG, PNG, WebP, GIF, HEIC).");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File exceeds 20 MB limit. Please use a smaller image.");
      return;
    }
    setError(null);
    setResult(null);
    setConverting(true);
    try {
      const normalized = await normalizeImageFile(f);
      setFile(normalized);
      const url = URL.createObjectURL(normalized);
      setPreviewSrc(url);
      const img = new Image();
      img.onload = () => setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
    } catch {
      setError("Could not read image. HEIC files from iPhone are supported — please try again.");
    } finally {
      setConverting(false);
    }
  }, []);

  const handleBatchFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const room = MAX_BATCH - batchItems.length;
    if (room <= 0) {
      setError(`Maximum ${MAX_BATCH} images in batch mode.`);
      return;
    }
    setError(null);
    setBatchResults([]);
    setConverting(true);
    const added: BatchItem[] = [];
    try {
      for (const f of arr.slice(0, room)) {
        if (!isImageFile(f) || f.size > 20 * 1024 * 1024) continue;
        const normalized = await normalizeImageFile(f);
        added.push({
          id: uid(),
          file: normalized,
          previewSrc: URL.createObjectURL(normalized),
        });
      }
      if (added.length === 0) {
        setError("No valid images added. Use JPG, PNG, WebP, GIF, or HEIC up to 20 MB each.");
        return;
      }
      setBatchItems((prev) => [...prev, ...added]);
    } catch {
      setError("Failed to load one or more images.");
    } finally {
      setConverting(false);
    }
  }, [batchItems.length]);

  const outputFromResize = (out: ResizeOutput): ProcessedResult => ({
    dataUrl: out.dataUrl,
    sizeKB: out.sizeKB,
    width: out.width,
    height: out.height,
    format: out.format,
    maxKB: out.maxKB,
  });

  /* ── Canvas processing ─────────────────────────────────── */

  const processImage = useCallback(async () => {
    if (!file || !previewSrc) return;

    setProcessing(true);
    setProgress(10);
    setError(null);
    setResult(null);

    try {
      const { targetW, targetH, targetKB, outputFormat } = getTargets();
      setProgress(40);
      const out = await resizeImageFromSource(previewSrc, {
        targetW,
        targetH,
        targetKB,
        outputFormat,
        quality,
        fitMode,
      });
      setProgress(100);
      setResult(outputFromResize(out));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [file, previewSrc, getTargets, quality, fitMode]);

  const processBatch = useCallback(async () => {
    if (batchItems.length === 0) return;
    setProcessing(true);
    setProgress(5);
    setError(null);
    setBatchResults([]);

    try {
      const { targetW, targetH, targetKB, outputFormat } = getTargets();
      const results: BatchResult[] = [];

      for (let i = 0; i < batchItems.length; i++) {
        const item = batchItems[i];
        setProgress(Math.round(((i + 1) / batchItems.length) * 95));
        const out = await resizeImageFromSource(item.previewSrc, {
          targetW,
          targetH,
          targetKB,
          outputFormat,
          quality,
          fitMode,
        });
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const base = item.file.name.replace(/\.[^.]+$/, "");
        results.push({
          id: item.id,
          name: `${base}_${targetW}x${targetH}.${ext}`,
          blob: out.blob,
          sizeKB: out.sizeKB,
          width: out.width,
          height: out.height,
          maxKB: targetKB,
        });
      }

      setBatchResults(results);
      setProgress(100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch processing failed.";
      setError(msg);
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [batchItems, getTargets, quality, fitMode]);

  const downloadBatchZip = useCallback(async () => {
    if (batchResults.length === 0) return;
    const zip = new JSZip();
    batchResults.forEach((r) => zip.file(r.name, r.blob));
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ezseva_resized_${batchResults.length}_images.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, [batchResults]);

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
    setBatchItems([]);
    setBatchResults([]);
    setError(null);
    setProgress(0);
  };

  const removeBatchItem = (id: string) => {
    setBatchItems((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewSrc);
      return prev.filter((x) => x.id !== id);
    });
    setBatchResults([]);
  };

  /* ── Cleanup blob URL on unmount / change ─────────────── */
  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  /* ── Render ───────────────────────────────────────────── */
  return (
    <ToolPageShell toolHref="/image-resize">

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {([
              { key: "single" as const, label: "📷 Single photo" },
              { key: "batch" as const, label: `📦 Batch (up to ${MAX_BATCH})` },
            ]).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setMode(key); setError(null); setResult(null); setBatchResults([]); }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${mode === key ? "var(--brand)" : "var(--border-light)"}`,
                  background: mode === key ? "var(--brand-light)" : "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: "var(--font)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ════════════════════════════════════════
              STEP 1 — UPLOAD
          ════════════════════════════════════════ */}
          <section
            aria-labelledby="step1-label"
            className="ez-tool-workspace"
            style={{ marginBottom: "16px" }}
          >
            <StepLabel number="1" text={mode === "batch" ? "Upload Photos (Batch)" : "Upload Your Photo"} />

            {mode === "single" && !file ? (
              <ImageCaptureUpload
                onFiles={(files) => {
                  const f = files instanceof FileList ? files[0] : files[0];
                  if (f) handleFile(f);
                }}
                title="Take a photo or pick from gallery"
                hint="JPG, PNG, WebP, HEIC · max 20 MB"
                icon="📸"
                disabled={converting}
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding: "44px 24px",
                  background: "var(--bg-muted)",
                }}
              />
            ) : mode === "single" && file ? (
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
            ) : (
              <>
                <ImageCaptureUpload
                  multiple
                  onFiles={handleBatchFiles}
                  title={`Add up to ${MAX_BATCH} photos`}
                  hint="Same preset applied to all · ZIP download"
                  icon="📦"
                  disabled={converting || batchItems.length >= MAX_BATCH}
                  style={{
                    borderRadius: "var(--radius-lg)",
                    padding: "32px 20px",
                    background: "var(--bg-muted)",
                    marginBottom: batchItems.length ? 14 : 0,
                  }}
                />
                {batchItems.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {batchItems.map((item) => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--bg-muted)", borderRadius: "var(--radius-md)" }}>
                        <img src={item.previewSrc} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.file.name}</span>
                        <button type="button" className="btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => removeBatchItem(item.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {(converting || processing) && (
              <p style={{ fontSize: 12, color: "var(--brand)", marginTop: 10, fontWeight: 600 }}>
                {converting ? "Converting HEIC…" : "Processing…"}
              </p>
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

            {/* Fit mode */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                Fit mode
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {([
                  { id: "cover" as FitMode, label: "Crop to fill", desc: "Best for exam photos" },
                  { id: "contain" as FitMode, label: "Fit inside", desc: "No cropping" },
                  { id: "stretch" as FitMode, label: "Stretch", desc: "May distort face" },
                ]).map(({ id, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFitMode(id)}
                    aria-pressed={fitMode === id}
                    style={{
                      flex: "1 1 120px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${fitMode === id ? "var(--brand)" : "var(--border-light)"}`,
                      background: fitMode === id ? "var(--brand-light)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "var(--font)",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: fitMode === id ? "var(--brand)" : "var(--text-primary)" }}>{label}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

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
            onClick={mode === "batch" ? processBatch : processImage}
            disabled={(mode === "single" ? !file : batchItems.length === 0) || processing || converting}
            className={(mode === "single" ? file : batchItems.length) && !processing ? "btn-primary" : ""}
            aria-label="Resize image"
            aria-busy={processing}
            style={{
              width: "100%", padding: "15px",
              fontSize: "15px", fontWeight: 800,
              borderRadius: "var(--radius-lg)",
              cursor: (mode === "single" ? !file : !batchItems.length) || processing ? "not-allowed" : "pointer",
              background: (mode === "single" ? !file : !batchItems.length) || processing ? "var(--border-light)" : undefined,
              color: (mode === "single" ? !file : !batchItems.length) || processing ? "var(--text-hint)" : undefined,
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
            ) : mode === "batch" ? (
              `📦 Resize ${batchItems.length} Image${batchItems.length !== 1 ? "s" : ""} — Free`
            ) : (
              "🖼️ Resize Image — Free"
            )}
          </button>

          {batchResults.length > 0 && (
            <section style={{ background: "#fff", border: "2px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: 22, marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Batch results ({batchResults.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {batchResults.map((r) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--bg-muted)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{r.name}</span>
                    <KBStatusBadge sizeKB={r.sizeKB} maxKB={r.maxKB} />
                  </div>
                ))}
              </div>
              <button type="button" className="btn-primary" onClick={downloadBatchZip} style={{ width: "100%", padding: 12 }}>
                📦 Download All as ZIP
              </button>
            </section>
          )}

          {/* ════════════════════════════════════════
              RESULT (single)
          ════════════════════════════════════════ */}
          {mode === "single" && result && (
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
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                <StatChip label="File Size"  value={`${result.sizeKB} KB`} />
                <StatChip label="Dimensions" value={`${result.width}×${result.height}`} />
                <StatChip label="Format"     value={result.format.toUpperCase()} />
              </div>

              <KBStatusBadge sizeKB={result.sizeKB} maxKB={result.maxKB} className="ez-kb-badge--block" />

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

          <ToolWorkflowCTA
            steps={[
              { label: "Crop photo", href: "/image-crop" },
              { label: "Merge photo + signature", href: "/photo-joiner" },
              { label: "Compress PDF", href: "/pdf-compress" },
            ]}
          />

    </ToolPageShell>
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