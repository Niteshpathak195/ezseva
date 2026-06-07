/** Shared canvas helpers for image tools */

export type FitMode = "cover" | "contain" | "stretch";

export function fmtKB(bytes: number): string {
  const kb = bytes / 1024;
  return kb >= 1000 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
}

export function estimateBase64KB(dataUrl: string, mime: string): number {
  const prefix = `data:${mime};base64,`;
  const base64Len = dataUrl.length - prefix.length;
  return Math.ceil((base64Len * 3) / 4 / 1024);
}

/** Crop-to-fill — preserves aspect ratio, no face stretch */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  const scale = Math.max(dw / sw, dh / sh);
  const cw = sw * scale;
  const ch = sh * scale;
  const ox = dx + (dw - cw) / 2;
  const oy = dy + (dh - ch) / 2;
  ctx.drawImage(img, ox, oy, cw, ch);
}

/** Letterbox — full image visible with padding */
export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  bg = "#ffffff"
) {
  ctx.fillStyle = bg;
  ctx.fillRect(dx, dy, dw, dh);
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  const scale = Math.min(dw / sw, dh / sh);
  const cw = sw * scale;
  const ch = sh * scale;
  const ox = dx + (dw - cw) / 2;
  const oy = dy + (dh - ch) / 2;
  ctx.drawImage(img, ox, oy, cw, ch);
}

export function drawImageWithFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  mode: FitMode,
  bg = "#ffffff"
) {
  if (mode === "stretch") {
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(dx, dy, dw, dh);
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }
  if (mode === "contain") {
    drawImageContain(ctx, img, dx, dy, dw, dh, bg);
    return;
  }
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(dx, dy, dw, dh);
  }
  drawImageCover(ctx, img, dx, dy, dw, dh);
}

export async function compressCanvasToDataUrl(
  canvas: HTMLCanvasElement,
  mime: string,
  targetKB: number,
  initialQuality = 0.85
): Promise<string> {
  if (mime === "image/png") {
    return canvas.toDataURL(mime);
  }

  let lo = 0.05;
  let hi = 1.0;
  let dataUrl = canvas.toDataURL(mime, initialQuality);

  if (targetKB <= 0) return dataUrl;

  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    const test = canvas.toDataURL(mime, mid);
    const kb = estimateBase64KB(test, mime);

    if (kb <= targetKB) {
      lo = mid;
      dataUrl = test;
      if (targetKB - kb < 0.5) break;
    } else {
      hi = mid;
    }
  }
  return canvas.toDataURL(mime, lo);
}

export function kbPassFail(sizeKB: number, maxKB: number): "pass" | "fail" | "none" {
  if (maxKB <= 0) return "none";
  return sizeKB <= maxKB ? "pass" : "fail";
}
