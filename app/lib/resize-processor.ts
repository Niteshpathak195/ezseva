import {
  drawImageWithFit,
  compressCanvasToDataUrl,
  estimateBase64KB,
  type FitMode,
} from "./image-utils";
import type { OutputFormat } from "../data/exam-presets";

export interface ResizeOptions {
  targetW: number;
  targetH: number;
  targetKB: number;
  outputFormat: OutputFormat;
  quality: number;
  fitMode: FitMode;
}

export interface ResizeOutput {
  dataUrl: string;
  blob: Blob;
  sizeKB: number;
  width: number;
  height: number;
  format: OutputFormat;
  maxKB: number;
}

export async function resizeImageFromSource(
  imageSrc: string,
  options: ResizeOptions
): Promise<ResizeOutput> {
  const { targetW, targetH, targetKB, outputFormat, quality, fitMode } = options;

  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Image failed to load."));
    i.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (outputFormat === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  }

  drawImageWithFit(ctx, img, 0, 0, targetW, targetH, fitMode, "#ffffff");

  const mimeMap: Record<OutputFormat, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  const mime = mimeMap[outputFormat];

  const dataUrl =
    outputFormat === "png"
      ? canvas.toDataURL(mime)
      : await compressCanvasToDataUrl(canvas, mime, targetKB, quality / 100);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Export failed"))),
      mime,
      outputFormat === "png" ? undefined : quality / 100
    );
  });

  return {
    dataUrl,
    blob,
    sizeKB: estimateBase64KB(dataUrl, mime),
    width: targetW,
    height: targetH,
    format: outputFormat,
    maxKB: targetKB,
  };
}

export function resolveResizeTargets(
  presetId: string,
  presets: { id: string; width: number; height: number; maxKB: number; format: OutputFormat }[],
  custom: { w: string; h: string; kb: string; format: OutputFormat }
): Pick<ResizeOptions, "targetW" | "targetH" | "targetKB" | "outputFormat"> {
  if (presetId === "custom") {
    return {
      targetW: Math.max(1, Math.min(5000, parseInt(custom.w) || 800)),
      targetH: Math.max(1, Math.min(5000, parseInt(custom.h) || 600)),
      targetKB: Math.max(1, Math.min(10000, parseInt(custom.kb) || 200)),
      outputFormat: custom.format,
    };
  }
  const p = presets.find((x) => x.id === presetId)!;
  return {
    targetW: p.width,
    targetH: p.height,
    targetKB: p.maxKB,
    outputFormat: p.format,
  };
}
