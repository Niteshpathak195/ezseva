import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compress Free — Reduce PDF Size | DigiLocker, VYAPAM, Gmail | EzSeva",
  description:
    "Compress PDF for DigiLocker (200KB limit), VYAPAM, SSC, NPS, ITR portal, Gmail, WhatsApp. Marksheets, certificates, admit cards, rent agreement — sab. No upload. Free.",
  keywords: [
    "compress pdf online free",
    "pdf size kaise kam karein",
    "reduce pdf size online",
    "pdf compress for DigiLocker",
    "DigiLocker 200KB limit pdf",
    "VYAPAM pdf size limit",
    "SSC pdf compress",
    "NPS portal pdf upload",
    "ITR portal pdf compress",
    "pdf compress for government portal",
    "gmail attachment pdf compress",
    "whatsapp pdf share compress",
    "marksheet pdf compress",
    "admit card pdf size reduce",
    "certificate pdf compress",
    "rent agreement pdf compress",
    "scholarship form pdf size",
    "income certificate pdf compress",
    "domicile certificate pdf size",
    "GST invoice pdf compress",
    "resume pdf size reduce",
    "bank statement pdf compress",
    "pdf compressor india no upload",
    "pdf kb mein kaise karein",
    "pdf compress without quality loss",
  ],
  openGraph: {
    title: "Free PDF Compress — DigiLocker, VYAPAM, Gmail, WhatsApp | EzSeva",
    description:
      "Compress PDF for DigiLocker, VYAPAM, SSC, Gmail & WhatsApp. Marksheets, certificates, admit cards. No upload.",
    url: "https://www.ezseva.in/pdf-compress",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Compress — DigiLocker, VYAPAM, Gmail | EzSeva",
    description: "Compress PDF for any portal instantly. No upload. 100% private. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/pdf-compress" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}