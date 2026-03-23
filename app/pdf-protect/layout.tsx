import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Password Protect Free — RC4-128 Encryption | Lock PDF | EzSeva",
  description:
    "Lock PDF with real RC4-128 encryption — streams & strings both encrypted per PDF spec. Salary slips, Aadhaar, PAN, legal docs. Files never leave your device. Free.",
  keywords: [
    "pdf password protect online free",
    "pdf lock kaise karein",
    "pdf encrypt online free",
    "RC4 128 bit pdf encryption",
    "pdf encrypt streams and strings",
    "salary slip pdf password protect",
    "Aadhaar pdf lock",
    "PAN card pdf protect",
    "legal document pdf password",
    "marksheet pdf password protect",
    "confidential document pdf lock",
    "pdf ko password lagao",
    "protect pdf without software",
    "pdf lock online no upload",
    "personal document pdf password",
    "offer letter pdf protect",
    "bank statement pdf password",
    "medical report pdf lock",
    "pdf encrypt browser only",
    "pdf password without upload",
  ],
  openGraph: {
    title: "Free PDF Password Protect — Real RC4-128 Encryption | EzSeva",
    description:
      "Real RC4-128 PDF encryption — streams & strings both encrypted. Salary slips, Aadhaar, legal docs. Files never leave your device.",
    url: "https://www.ezseva.in/pdf-protect",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Lock — Real RC4-128 Encryption | EzSeva",
    description: "RC4-128 PDF encryption. Streams & strings both encrypted. No upload. Free.",
  },
  alternates: { canonical: "https://www.ezseva.in/pdf-protect" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}