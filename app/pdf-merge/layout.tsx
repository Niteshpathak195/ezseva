import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merge Free — Combine PDFs | Marksheet, GST, Loan, Admission | EzSeva",
  description:
    "Merge PDFs instantly — marksheets + certificates for admission, GST invoices for CA, loan docs for bank, visa papers, scholarship forms. No upload. 100% private. Free.",
  keywords: [
    "merge pdf online free",
    "combine pdf files free",
    "pdf merge kaise karein",
    "marksheet certificate pdf merge",
    "admission documents pdf combine",
    "scholarship form pdf merge",
    "engineering admission pdf combine",
    "MBA application pdf merge",
    "domicile income certificate pdf join",
    "GST invoice pdf combine",
    "home loan documents pdf merge",
    "CA filing pdf combine",
    "visa application pdf merge",
    "insurance claim pdf merge",
    "multiple pdf ek mein",
    "freelancer invoice merge pdf",
    "bank statement pdf combine",
    "college application documents merge",
    "internship application pdf combine",
    "pdf joiner online free india",
    "UPSC documents pdf merge",
    "SSC application pdf combine",
  ],
  openGraph: {
    title: "Free PDF Merge — Marksheet, GST, Loan, Admission | EzSeva",
    description:
      "Combine PDFs — marksheets, admission docs, GST invoices, loan papers. No upload — 100% private. Free.",
    url: "https://www.ezseva.in/pdf-merge",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Merge — Marksheet, GST, Admission | EzSeva",
    description: "Combine multiple PDFs instantly. No upload. 100% private. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/pdf-merge" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}