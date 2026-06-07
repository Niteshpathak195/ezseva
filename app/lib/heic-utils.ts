/** HEIC/HEIF → JPEG conversion (iPhone photos) — browser only */

const HEIC_EXTS = [".heic", ".heif"];
const HEIC_MIMES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

export function isHeicFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    HEIC_MIMES.includes(file.type) ||
    HEIC_EXTS.some((ext) => lower.endsWith(ext))
  );
}

/** Returns JPEG File when input is HEIC; otherwise returns the same file */
export async function normalizeImageFile(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;

  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  const blob = Array.isArray(result) ? result[0] : result;
  const baseName = file.name.replace(/\.(heic|heif)$/i, "") || "photo";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
