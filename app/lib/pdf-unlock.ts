/** Decrypt password-protected PDFs — RC4 native first, PDF.js raster fallback */

import { PDFDocument } from "pdf-lib";
import {
  decryptRc4Pdf,
  isPdfEncrypted,
  getPdfPageCount,
} from "./pdf-rc4-unlock";

const PDFJS_VERSION = "5.6.205";

let workerReady = false;

async function setupPdfJsWorker() {
  if (workerReady) return;
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
  workerReady = true;
}

function isPasswordError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: string; code?: number; message?: string };
  if (e.name === "PasswordException") return true;
  const msg = (e.message ?? "").toLowerCase();
  return msg.includes("password") || msg.includes("incorrect");
}

/** Raster fallback for AES / unknown encryption (PDF.js) */
async function unlockViaPdfJs(
  bytes: Uint8Array,
  password: string,
  onProgress?: (pct: number, msg: string) => void
): Promise<Uint8Array> {
  await setupPdfJsWorker();
  const pdfjs = await import("pdfjs-dist");

  onProgress?.(15, "Opening PDF…");

  let doc: Awaited<ReturnType<typeof pdfjs.getDocument>>["promise"] extends Promise<infer T>
    ? T
    : never;

  try {
    const loading = pdfjs.getDocument({
      data: bytes.slice(),
      password: password || undefined,
      isEvalSupported: false,
    });
    doc = await loading.promise;
  } catch (err: unknown) {
    if (isPasswordError(err)) throw new Error("Incorrect password");
    throw err;
  }

  const outDoc = await PDFDocument.create();
  const total = doc.numPages;

  for (let i = 1; i <= total; i++) {
    onProgress?.(20 + Math.round((i / total) * 70), `Rendering page ${i} of ${total}…`);

    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const pngBytes = await new Promise<Uint8Array>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("Page render failed"));
        resolve(new Uint8Array(await blob.arrayBuffer()));
      }, "image/png");
    });

    const embedded = await outDoc.embedPng(pngBytes);
    const w = embedded.width;
    const h = embedded.height;
    const pdfPage = outDoc.addPage([w, h]);
    pdfPage.drawImage(embedded, { x: 0, y: 0, width: w, height: h });
  }

  onProgress?.(95, "Saving unlocked PDF…");
  return outDoc.save({ useObjectStreams: true });
}

export async function unlockPdfBytes(
  bytes: Uint8Array,
  password: string,
  onProgress?: (pct: number, msg: string) => void
): Promise<Uint8Array> {
  onProgress?.(8, "Checking encryption…");

  const rc4Result = await decryptRc4Pdf(bytes, password);

  if (rc4Result === "not_encrypted") {
    onProgress?.(100, "Done!");
    return bytes;
  }

  if (rc4Result === "wrong_password") {
    throw new Error("Incorrect password");
  }

  if (rc4Result instanceof Uint8Array) {
    onProgress?.(100, "Decryption complete!");
    return rc4Result;
  }

  // AES or other — PDF.js raster fallback
  onProgress?.(12, "Trying advanced decryption…");
  return unlockViaPdfJs(bytes, password, onProgress);
}

export { isPdfEncrypted, getPdfPageCount };
