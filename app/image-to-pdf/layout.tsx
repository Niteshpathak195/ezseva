import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Free — JPG PNG to PDF | Aadhaar, Marksheet, Invoice | EzSeva",
  description:
    "Convert JPG/PNG to PDF instantly. Aadhaar card, marksheets, admit cards, certificates, income proof, rent agreement, bills, invoices — sab PDF mein. No upload. Free.",
  keywords: [
    "image to pdf online free",
    "jpg to pdf converter",
    "png to pdf free",
    "photo to pdf",
    "Aadhaar card to pdf",
    "marksheet to pdf",
    "admit card image to pdf",
    "certificate to pdf",
    "income proof image to pdf",
    "rent agreement photo to pdf",
    "domicile certificate to pdf",
    "bill image to pdf",
    "invoice photo to pdf",
    "multiple images to one pdf",
    "scan to pdf free india",
    "whatsapp photo to pdf",
    "images ko pdf kaise banaye",
    "class 10 marksheet to pdf",
    "scholarship documents photo to pdf",
    "product photo to pdf catalogue",
    "hospital report image to pdf",
  ],
  openGraph: {
    title: "Free Image to PDF — Aadhaar, Marksheet, Admit Card, Invoice | EzSeva",
    description:
      "Convert JPG/PNG to PDF — Aadhaar, marksheets, admit cards, bills, invoices. No upload — 100% private. Free.",
    url: "https://www.ezseva.in/image-to-pdf",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to PDF — Aadhaar, Marksheet, Invoice | EzSeva",
    description: "Convert any image to PDF instantly. No upload. 100% private. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/image-to-pdf" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}