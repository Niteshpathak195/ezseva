// ─────────────────────────────────────────────
// Exam presets — single source for image tools
// Always verify against official notification
// ─────────────────────────────────────────────

export type OutputFormat = "jpeg" | "png" | "webp";

export interface ResizePreset {
  id: string;
  label: string;
  subLabel: string;
  badge?: string;
  width: number;
  height: number;
  maxKB: number;
  format: OutputFormat;
}

export const RESIZE_PRESETS: ResizePreset[] = [
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
    width: 200,
    height: 230,
    maxKB: 50,
    format: "jpeg",
  },
  {
    id: "sbi",
    label: "SBI PO / Clerk",
    subLabel: "200×230 px · max 50 KB · JPEG",
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
    id: "rrc",
    label: "RRC Group D",
    subLabel: "200×230 px · max 20 KB · JPEG",
    width: 200,
    height: 230,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "ssc-cpo",
    label: "SSC CPO / SI",
    subLabel: "200×230 px · max 20 KB · JPEG",
    width: 200,
    height: 230,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "cpct",
    label: "CPCT",
    subLabel: "200×230 px · max 30 KB · JPEG",
    width: 200,
    height: 230,
    maxKB: 30,
    format: "jpeg",
  },
  {
    id: "upsc",
    label: "UPSC / IAS",
    subLabel: "300×400 px · max 300 KB · JPEG",
    width: 300,
    height: 400,
    maxKB: 300,
    format: "jpeg",
  },
  {
    id: "bpsc",
    label: "Bihar PSC / BPSC",
    subLabel: "140×160 px · max 20 KB · JPEG",
    width: 140,
    height: 160,
    maxKB: 20,
    format: "jpeg",
  },
  {
    id: "neet",
    label: "NEET / JEE / NTA",
    subLabel: "413×531 px · max 100 KB · JPEG",
    width: 413,
    height: 531,
    maxKB: 100,
    format: "jpeg",
  },
  {
    id: "passport",
    label: "Passport / Visa",
    subLabel: "600×600 px · max 50 KB · JPEG",
    width: 600,
    height: 600,
    maxKB: 50,
    format: "jpeg",
  },
  {
    id: "custom",
    label: "Custom Size",
    subLabel: "Set your own dimensions",
    width: 0,
    height: 0,
    maxKB: 0,
    format: "jpeg",
  },
];

/** Spec rows for FAQ / reference tables */
export const EXAM_SPEC_ROWS = RESIZE_PRESETS.filter((p) => p.id !== "custom").map(
  (p) => ({
    exam: p.label,
    size: `${p.width}×${p.height} px`,
    maxKB: `${p.maxKB} KB`,
    format: p.format.toUpperCase(),
  })
);

export type JoinerPresetKey =
  | "ssc"
  | "ibps"
  | "sbi"
  | "railway"
  | "rrc"
  | "ssc-cpo"
  | "vyapam"
  | "upsc"
  | "custom";

export interface JoinerPreset {
  label: string;
  desc: string;
  photoW: number;
  photoH: number;
  sigW: number;
  sigH: number;
  maxKB: number;
  layout: "left" | "top";
}

export const JOINER_PRESETS: Record<JoinerPresetKey, JoinerPreset> = {
  ssc: {
    label: "SSC CGL / CHSL / MTS",
    desc: "Photo 200×230 + Sig 200×75 · Max 50 KB",
    photoW: 200,
    photoH: 230,
    sigW: 200,
    sigH: 75,
    maxKB: 50,
    layout: "left",
  },
  ibps: {
    label: "IBPS PO / Clerk / SO",
    desc: "Photo 200×230 + Sig 140×60 · Max 100 KB",
    photoW: 200,
    photoH: 230,
    sigW: 140,
    sigH: 60,
    maxKB: 100,
    layout: "left",
  },
  sbi: {
    label: "SBI PO / Clerk",
    desc: "Photo 200×230 + Sig 140×60 · Max 100 KB",
    photoW: 200,
    photoH: 230,
    sigW: 140,
    sigH: 60,
    maxKB: 100,
    layout: "left",
  },
  railway: {
    label: "Railway RRB NTPC / Group D",
    desc: "Photo 132×170 + Sig 140×60 · Max 40 KB",
    photoW: 132,
    photoH: 170,
    sigW: 140,
    sigH: 60,
    maxKB: 40,
    layout: "left",
  },
  rrc: {
    label: "RRC Group D",
    desc: "Photo 200×230 + Sig 140×60 · Max 40 KB",
    photoW: 200,
    photoH: 230,
    sigW: 140,
    sigH: 60,
    maxKB: 40,
    layout: "left",
  },
  "ssc-cpo": {
    label: "SSC CPO / SI",
    desc: "Photo 200×230 + Sig 200×75 · Max 50 KB",
    photoW: 200,
    photoH: 230,
    sigW: 200,
    sigH: 75,
    maxKB: 50,
    layout: "left",
  },
  vyapam: {
    label: "MP Vyapam / MP PEB",
    desc: "Photo 200×230 + Sig 200×75 · Max 50 KB",
    photoW: 200,
    photoH: 230,
    sigW: 200,
    sigH: 75,
    maxKB: 50,
    layout: "left",
  },
  upsc: {
    label: "UPSC Civil Services",
    desc: "Photo 300×350 + Sig 140×60 · Max 300 KB",
    photoW: 300,
    photoH: 350,
    sigW: 140,
    sigH: 60,
    maxKB: 300,
    layout: "left",
  },
  custom: {
    label: "Custom",
    desc: "Set your own canvas size",
    photoW: 200,
    photoH: 230,
    sigW: 140,
    sigH: 60,
    maxKB: 100,
    layout: "left",
  },
};

/** PDF portal target sizes (KB) */
export const PDF_TARGET_KB_PRESETS = [
  { id: "100", label: "100 KB", kb: 100 },
  { id: "200", label: "200 KB", kb: 200 },
  { id: "500", label: "500 KB", kb: 500 },
  { id: "1024", label: "1 MB", kb: 1024 },
  { id: "2048", label: "2 MB", kb: 2048 },
] as const;

/** SEO landing pages — /exams/[slug] */
export interface ExamLandingPage {
  slug: string;
  presetId: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  tips: string[];
}

const LANDING_COPY: Record<
  string,
  { intro: string; tips: string[]; keywords: string[] }
> = {
  ssc: {
    intro:
      "SSC CGL, CHSL, and MTS online forms require a passport-style JPEG photo — typically 200×230 pixels and under 20 KB. EzSeva resizes and compresses locally in your browser.",
    tips: [
      "Use a plain white or light background",
      "Face should occupy 70–80% of the frame",
      "No cap, sunglasses, or filters",
      "Save as JPEG — PNG is usually too large",
    ],
    keywords: ["ssc photo size", "ssc cgl photo resize", "ssc photo 20kb"],
  },
  rrb: {
    intro:
      "Railway RRB NTPC and Group D applications need a small JPEG photo — 200×230 px, often capped at 15 KB. Resize without uploading to any server.",
    tips: ["Recent colour photo on light background", "Ears visible, face forward", "Avoid heavy jewellery or shadows"],
    keywords: ["railway photo size", "rrb ntpc photo resize", "railway form photo kb"],
  },
  ibps: {
    intro:
      "IBPS PO, Clerk, and SO registration requires a 200×230 px JPEG photo, usually under 50 KB. EzSeva matches portal specs automatically.",
    tips: ["Formal or semi-formal attire", "Neutral expression, eyes open", "Crop tightly to reduce file size"],
    keywords: ["ibps photo size", "ibps po photo resize", "ibps clerk photo kb"],
  },
  sbi: {
    intro:
      "SBI PO and Clerk online applications accept a 200×230 px JPEG photo up to 50 KB. Process your photo privately on any device.",
    tips: ["White background preferred", "High contrast between face and background", "Use crop-to-fill to avoid stretch"],
    keywords: ["sbi po photo size", "sbi clerk photo resize"],
  },
  vyapam: {
    intro:
      "MP Vyapam and MP PEB exams require a 200×230 px JPEG photo, typically under 30 KB. Built for Madhya Pradesh government form uploads.",
    tips: ["Follow latest Vyapam notification for exact KB limit", "Use good lighting — phone flash can blow highlights"],
    keywords: ["vyapam photo size", "mp peb photo resize", "vyapam photo kb"],
  },
  mppolice: {
    intro:
      "MP Police recruitment forms need a 200×230 px JPEG photo under 20 KB. EzSeva compresses to portal limits in one click.",
    tips: ["Recent photo within notification date limit", "No uniform unless notification allows"],
    keywords: ["mp police photo size", "mp police photo resize"],
  },
  rrc: {
    intro:
      "RRC Group D and railway category forms use a 200×230 px JPEG photo, often under 20 KB. Free, instant, no signup.",
    tips: ["Match official notification dimensions", "Combine with Photo Joiner for signature sheet"],
    keywords: ["rrc group d photo size", "rrc photo resize"],
  },
  "ssc-cpo": {
    intro:
      "SSC CPO and Sub-Inspector applications require 200×230 px JPEG photos with strict KB limits. Resize and verify before upload.",
    tips: ["Same specs as SSC CGL for most cycles — verify notification", "Use signature joiner for combined upload if allowed"],
    keywords: ["ssc cpo photo size", "ssc si photo resize"],
  },
  cpct: {
    intro:
      "CPCT and similar typing-certificate portals often need a 200×230 px photo under 30 KB. Pair with EzSeva Typing Test for full prep.",
    tips: ["Keep filename simple — no spaces if portal is picky", "Practice typing after resizing photo"],
    keywords: ["cpct photo size", "cpct photo resize mp"],
  },
  upsc: {
    intro:
      "UPSC Civil Services and IAS online forms allow a larger photo — 300×400 px, up to 300 KB JPEG. Higher quality than most state exams.",
    tips: ["Professional appearance — collared shirt recommended", "Higher KB limit — don't over-compress"],
    keywords: ["upsc photo size", "ias photo resize", "upsc photo dimensions"],
  },
  bpsc: {
    intro:
      "Bihar PSC (BPSC) and similar state PSC forms may require smaller photos — 140×160 px under 20 KB. EzSeva has a dedicated preset.",
    tips: ["Small dimensions — crop face tightly", "Verify latest BPSC notification"],
    keywords: ["bpsc photo size", "bihar psc photo resize"],
  },
  neet: {
    intro:
      "NEET, JEE, and NTA exams use larger passport photos — 413×531 px, up to 100 KB JPEG. Standard NTA dimensions supported.",
    tips: ["NTA spec is taller than SSC — use NEET preset", "Check NTA brochure each year"],
    keywords: ["neet photo size", "nta photo resize", "jee photo dimensions"],
  },
  passport: {
    intro:
      "Passport and visa online applications often need a square 600×600 px JPEG under 50 KB. EzSeva crop-to-fill keeps face proportion correct.",
    tips: ["Plain white background mandatory for most passports", "Neutral expression, both ears visible if possible"],
    keywords: ["passport photo size india", "passport photo 600x600", "visa photo resize"],
  },
};

export const EXAM_LANDING_PAGES: ExamLandingPage[] = RESIZE_PRESETS.filter(
  (p) => p.id !== "custom"
).map((p) => {
  const copy = LANDING_COPY[p.id] ?? {
    intro: `${p.label} online forms require a ${p.width}×${p.height} px ${p.format.toUpperCase()} photo, typically under ${p.maxKB} KB.`,
    tips: ["Verify dimensions in the official notification", "Use a recent colour photo on a plain background"],
    keywords: [`${p.id} photo size`, `${p.label.toLowerCase()} photo resize`],
  };
  return {
    slug: p.id,
    presetId: p.id,
    title: `${p.label} Photo Size & Resize`,
    metaTitle: `${p.label} Photo Size ${p.width}×${p.height} px ${p.maxKB} KB — Free Resize | EzSeva`,
    metaDescription: `Resize photo for ${p.label}: ${p.width}×${p.height} px, max ${p.maxKB} KB ${p.format.toUpperCase()}. Free, private, in-browser — no upload to EzSeva.`,
    intro: copy.intro,
    keywords: copy.keywords,
    tips: copy.tips,
  };
});

export function getExamLanding(slug: string): ExamLandingPage | undefined {
  return EXAM_LANDING_PAGES.find((p) => p.slug === slug);
}
