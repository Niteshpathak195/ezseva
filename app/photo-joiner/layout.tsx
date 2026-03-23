import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Signature Joiner Free — SSC, IBPS, VYAPAM, UPSC Form Ready | EzSeva",
  description:
    "Merge photo & signature side-by-side for SSC, Railway, IBPS, VYAPAM, UPSC, NEET, JEE, scholarship forms. Also KYC & HR onboarding. No upload. 100% private. Free.",
  keywords: [
    "photo signature joiner online free",
    "photo aur signature ek image mein",
    "SSC form photo signature",
    "Railway RRB photo signature",
    "IBPS photo signature joiner",
    "VYAPAM photo signature",
    "UPSC photo signature combine",
    "NEET photo signature joiner",
    "JEE photo signature",
    "scholarship form photo signature",
    "join photo and signature online",
    "KYC photo signature combine",
    "bank form photo signature",
    "HR onboarding photo signature",
    "government form photo signature free",
    "photo signature merge without watermark",
  ],
  openGraph: {
    title: "Free Photo + Signature Joiner — SSC, IBPS, VYAPAM, UPSC | EzSeva",
    description:
      "Merge photo & signature for SSC, Railway, IBPS, VYAPAM, NEET, KYC, HR forms. No upload — 100% private.",
    url: "https://www.ezseva.in/photo-joiner",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Photo + Signature Joiner — SSC, VYAPAM, IBPS | EzSeva",
    description: "Merge photo & signature instantly. No upload. 100% private. Free.",
  },
  alternates: { canonical: "https://www.ezseva.in/photo-joiner" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}