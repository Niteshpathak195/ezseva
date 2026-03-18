// ─────────────────────────────────────────────
// EzSeva — Data Layer
// app/data/tools.ts
// ─────────────────────────────────────────────

export type Category = "All" | "Image" | "PDF" | "AI Tools";

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

  /* ── AI Tools ─────────────────────────────────────────── */
  {
    icon: "✍️",
    title: "Letter Writer",
    desc: "Official Hindi & English letters with AI",
    href: "/ai-letter",
    cat: "AI Tools",
    ai: true,
    hot: true,
    uses: "890K",
  },
  {
    icon: "📋",
    title: "Resume Builder",
    desc: "Professional resume in seconds with AI",
    href: "/ai-resume",
    cat: "AI Tools",
    ai: true,
    hot: true,
    uses: "540K",
  },
  {
    icon: "🤖",
    title: "AI Biodata",
    desc: "Marriage biodata generated with AI",
    href: "/ai-biodata",
    cat: "AI Tools",
    ai: true,
    hot: false,
    uses: "380K",
  },
  {
    icon: "⌨️",
    title: "Typing Test",
    desc: "Hindi & English typing speed test",
    href: "/typing-test",
    cat: "AI Tools",
    ai: false,
    hot: false,
    uses: "290K",
  },
];

export const NAV_ITEMS = [
  { label: "Image Tools", cat: "Image"    as Category, icon: "🖼️" },
  { label: "PDF Tools",   cat: "PDF"      as Category, icon: "📄" },
  { label: "AI Tools",    cat: "AI Tools" as Category, icon: "🤖" },
];

export const STATS = [
  { value: "20+",  label: "Free Tools"    },
  { value: "100%", label: "Private"       },
  { value: "₹0",   label: "Always Free"   },
  { value: "0",    label: "Signup Needed" },
] as const;

export const TRUST = [
  "No file upload to server",
  "No account needed",
  "No data tracking",
  "Works offline",
] as const;

export const FILTER_TABS: Category[] = ["All", "Image", "PDF", "AI Tools"];