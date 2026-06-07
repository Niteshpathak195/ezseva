// ─────────────────────────────────────────────
// EzSeva — Data Layer
// app/data/tools.ts
// ─────────────────────────────────────────────

export type Category = "All" | "Image" | "PDF" | "Practice";

export interface Tool {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cat: Category;
  ai: boolean;
  hot: boolean;
  uses: string;
}

export const TOOLS: Tool[] = [
  /* ── Image ─────────────────────────────────────────────── */
  {
    icon: "🖼️",
    title: "Image Resize",
    desc: "SSC, Railway, VYAPAM & custom sizes",
    href: "/image-resize",
    cat: "Image",
    ai: false,
    hot: true,
    uses: "2.1M",
  },
  {
    icon: "🪪",
    title: "Photo + Signature",
    desc: "Merge photo & signature for govt forms",
    href: "/photo-joiner",
    cat: "Image",
    ai: false,
    hot: true,
    uses: "1.4M",
  },
  {
    icon: "📄",
    title: "Image to PDF",
    desc: "Combine multiple images into one PDF",
    href: "/image-to-pdf",
    cat: "Image",
    ai: false,
    hot: false,
    uses: "980K",
  },
  {
    icon: "🎨",
    title: "Image Crop",
    desc: "Crop to any ratio or custom dimension",
    href: "/image-crop",
    cat: "Image",
    ai: false,
    hot: false,
    uses: "760K",
  },

  /* ── PDF ─────────────────────────────────────────────── */
  {
    icon: "🗜️",
    title: "PDF Compress",
    desc: "Shrink PDF file size in seconds",
    href: "/pdf-compress",
    cat: "PDF",
    ai: false,
    hot: true,
    uses: "1.8M",
  },
  {
    icon: "📑",
    title: "PDF Merge",
    desc: "Combine multiple PDFs into one file",
    href: "/pdf-merge",
    cat: "PDF",
    ai: false,
    hot: false,
    uses: "1.1M",
  },
  {
    icon: "✂️",
    title: "PDF Split",
    desc: "Extract specific pages from any PDF",
    href: "/pdf-split",
    cat: "PDF",
    ai: false,
    hot: false,
    uses: "640K",
  },
  {
    icon: "🔒",
    title: "PDF Protect",
    desc: "Add password protection to your PDF",
    href: "/pdf-protect",
    cat: "PDF",
    ai: false,
    hot: false,
    uses: "420K",
  },
  {
    icon: "🔓",
    title: "PDF Unlock",
    desc: "Remove password from protected PDFs",
    href: "/pdf-unlock",
    cat: "PDF",
    ai: false,
    hot: false,
    uses: "380K",
  },

  /* ── Practice ─────────────────────────────────────────── */
  {
    icon: "⌨️",
    title: "Typing Test",
    desc: "Hindi & English typing speed test",
    href: "/typing-test",
    cat: "Practice",
    ai: false,
    hot: false,
    uses: "290K",
  },
];

/** Single source for tool count — use instead of hardcoding in copy */
export const TOOL_COUNT = TOOLS.length;

export const NAV_ITEMS = [
  { label: "Image Tools", cat: "Image" as Category, icon: "🖼️" },
  { label: "PDF Tools",   cat: "PDF"   as Category, icon: "📄" },
];

export const TRUST = [
  "No file upload for tool processing",
  "No account required",
  "Works on mobile browsers",
  "Free to use — supported by ads",
] as const;

export const STATS = [
  { value: String(TOOL_COUNT), label: "Free Tools"       },
  { value: "100%", label: "In-browser"     },
  { value: "₹0",   label: "Always Free"    },
  { value: "0",    label: "Signup Needed"  },
] as const;

export const FILTER_TABS: Category[] = ["All", "Image", "PDF", "Practice"];

/* ── Category accents (cards + tool pages) ── */
export const CATEGORY_META: Record<
  Exclude<Category, "All">,
  { label: string; accent: string; accentSoft: string; grad: string }
> = {
  Image: {
    label: "Image Tools",
    accent: "#0D9488",
    accentSoft: "#F0FDFA",
    grad: "var(--cat-image-grad)",
  },
  PDF: {
    label: "PDF Tools",
    accent: "#6366F1",
    accentSoft: "#EEF2FF",
    grad: "var(--cat-pdf-grad)",
  },
  Practice: {
    label: "Practice",
    accent: "#7C3AED",
    accentSoft: "#F5F3FF",
    grad: "var(--cat-practice-grad)",
  },
};

/** Extended copy for tool page heroes */
export const TOOL_PAGE_COPY: Record<
  string,
  { headline: string; subtitle: string }
> = {
  "/image-resize": {
    headline: "Image Resize — Free Online",
    subtitle:
      "Resize photos for SSC, Railway, UPSC, VYAPAM, Passport & more. Processed locally in your browser — not uploaded to EzSeva.",
  },
  "/photo-joiner": {
    headline: "Photo + Signature Joiner",
    subtitle:
      "Combine photo and signature for SSC, IBPS, Railway, UPSC & Vyapam forms. Processed locally in your browser.",
  },
  "/image-to-pdf": {
    headline: "Image to PDF Converter",
    subtitle:
      "Convert JPG, PNG, WebP into one PDF — reorder pages, set margins, choose page size. 100% free & private.",
  },
  "/image-crop": {
    headline: "Image Crop — Free Online Cropper",
    subtitle:
      "Crop to passport, SSC, or custom dimensions with pixel-perfect control. Nothing uploads to any server.",
  },
  "/pdf-compress": {
    headline: "PDF Compress — Free Online",
    subtitle:
      "Shrink PDF file size for form uploads and email. Fast, private compression entirely in your browser.",
  },
  "/pdf-merge": {
    headline: "PDF Merge — Combine PDFs Free",
    subtitle:
      "Combine multiple PDF files into one document. Drag to reorder — no upload, no signup.",
  },
  "/pdf-split": {
    headline: "PDF Split — Extract Pages Free",
    subtitle:
      "Extract specific pages or split a PDF into separate files. Private, instant, works on mobile.",
  },
  "/pdf-protect": {
    headline: "PDF Protect — Add Password Free",
    subtitle:
      "Add password protection to sensitive PDFs before sharing. Encrypted locally — never sent to a server.",
  },
  "/pdf-unlock": {
    headline: "PDF Unlock — Remove Password Free",
    subtitle:
      "Remove password from PDF files to compress, merge, or edit. 100% in-browser — your password never leaves your device.",
  },
  "/typing-test": {
    headline: "Online Typing Speed Test",
    subtitle:
      "Practice Hindi & English typing for CPCT, SSC, and government exams. Track WPM, accuracy & errors live.",
  },
};

export function getToolByHref(href: string): Tool | undefined {
  return TOOLS.find((t) => t.href === href);
}

export function getRelatedTools(href: string, limit = 8): Tool[] {
  const current = getToolByHref(href);
  if (!current) return TOOLS.filter((t) => t.href !== href).slice(0, limit);
  const same = TOOLS.filter((t) => t.href !== href && t.cat === current.cat);
  const other = TOOLS.filter((t) => t.href !== href && t.cat !== current.cat);
  return [...same, ...other].slice(0, limit);
}
