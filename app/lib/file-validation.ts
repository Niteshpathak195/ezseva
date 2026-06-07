/** Shared client-side file type checks (MIME + extension fallback) */

export function isPdfFile(file: File): boolean {
  return (
    (file.type === "application/pdf" || !file.type) &&
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function isAcceptedImageFile(
  file: File,
  allowedMime: readonly string[],
  allowedExt: readonly string[]
): boolean {
  const isValidMime = allowedMime.includes(file.type);
  const isValidExt = allowedExt.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );
  return isValidMime || isValidExt;
}

export function isImageFile(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    isHeicFile(file) ||
    isAcceptedImageFile(
      file,
      ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"],
      [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".heic", ".heif"]
    )
  );
}

function isHeicFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    ["image/heic", "image/heif"].includes(file.type) ||
    lower.endsWith(".heic") ||
    lower.endsWith(".heif")
  );
}
