import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use EzSeva Tools — Complete Guide | Image, PDF, Typing | EzSeva",
  description:
    "Step-by-step guide for all EzSeva tools — resize photo for SSC/VYAPAM, compress PDF for DigiLocker, merge certificates for admission, typing test for CPCT. Free & private.",
  keywords: [
    /* ── How-to searches — high volume India ── */
    "how to resize photo for SSC online",
    "how to compress pdf for government portal",
    "how to merge pdf for admission",
    "how to protect pdf with password free",
    "how to split pdf online free",
    "image to pdf kaise banaye",
    "photo signature merge kaise karein",
    "VYAPAM photo resize kaise karein",
    "DigiLocker pdf compress kaise karein",
    "pdf merge kaise karein hindi",

    /* ── Tool-specific guide searches ── */
    "ezseva guide",
    "ezseva how to use",
    "ezseva tools tutorial",
    "image resize tutorial india",
    "pdf compress tutorial india",
    "CPCT typing test kaise dein",
    "typing speed test hindi guide",

    /* ── Use case keywords ── */
    "marksheet certificate merge pdf guide",
    "aadhaar pan pdf merge guide",
    "sarkari form photo resize guide",
    "government exam photo size guide",
    "free pdf tools guide india",
    "how to use pdf tools online india",
    "how to use image tools free india",

    /* ── Long tail ── */
    "how to combine images into pdf free",
    "how to crop passport size photo online",
    "how to add password to pdf free",
    "how to extract pages from pdf free",
  ],
  openGraph: {
    title: "EzSeva Tools Guide — How to Resize, Compress, Merge, Split & Protect | EzSeva",
    description:
      "Complete step-by-step guide for all EzSeva tools — photo resize for SSC/VYAPAM, PDF compress for DigiLocker, merge for admission docs, CPCT typing test.",
    url: "https://www.ezseva.in/guide",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EzSeva Tools Guide — Image, PDF, Typing Test | EzSeva",
    description:
      "Step-by-step guide for all tools. Photo resize, PDF compress, merge, split, protect, typing test. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/guide" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}