import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Split Free — Extract Pages | Bank Statement, ITR, Textbook | EzSeva",
  description:
    "Split PDF & extract specific pages — 3-month bank statement for KYC, ITR first page, textbook chapters, admit card from merged PDF. No upload. 100% private. Free.",
  keywords: [
    "split pdf online free",
    "pdf pages extract online",
    "pdf split kaise karein",
    "bank statement 3 months extract",
    "ITR first page extract pdf",
    "ITR pdf split",
    "KYC pdf split",
    "textbook pdf chapter extract",
    "pdf pages separate karna",
    "specific pages nikalna pdf se",
    "admit card extract from pdf",
    "marksheet page extract",
    "contract page extract pdf",
    "DigiLocker document split",
    "pdf cutter online india free",
    "pdf page alag karna",
    "semester result pdf split",
    "internship certificate page extract",
  ],
  openGraph: {
    title: "Free PDF Split — Bank Statement, ITR, Textbook Pages | EzSeva",
    description:
      "Extract pages from PDF — bank statement, ITR, textbook chapters, admit card. No upload — 100% private.",
    url: "https://ezseva.in/pdf-split",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Split — Bank Statement, ITR, Textbook | EzSeva",
    description: "Extract any pages from PDF. No upload. 100% private. Free forever.",
  },
  alternates: { canonical: "https://ezseva.in/pdf-split" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}