import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Unlock Free — Remove PDF Password Online | EzSeva",
  description:
    "Remove password from PDF online free. Unlock encrypted PDFs for editing, compressing, or merging. 100% in-browser — your file never uploads to any server.",
  keywords: [
    "pdf unlock online free",
    "remove password from pdf",
    "pdf password remover india",
    "unlock pdf without software",
    "pdf decrypt online",
    "pdf se password kaise hataye",
    "open password protected pdf",
    "pdf unlock browser only",
  ],
  openGraph: {
    title: "Free PDF Unlock — Remove PDF Password | EzSeva",
    description:
      "Unlock password-protected PDFs instantly in your browser. No upload. Free forever.",
    url: "https://www.ezseva.in/pdf-unlock",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Unlock — Remove PDF Password | EzSeva",
    description: "Remove PDF password in your browser. No upload. 100% private.",
  },
  alternates: { canonical: "https://www.ezseva.in/pdf-unlock" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
