import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About EzSeva — Free Tools Built for Billions of Indians | EzSeva",
  description:
    "EzSeva is a free browser-based tool platform built for Indian students, govt exam aspirants & professionals. 100% private — files never leave your device. No signup ever.",
  keywords: [
    "about ezseva",
    "ezseva free tools india",
    "free online tools for india",
    "built for billions",
    "ezseva pdf image tools",
    "free tools indian students",
    "government exam tools free",
    "ezseva about us",
  ],
  openGraph: {
    title: "About EzSeva — Free Tools Built for Billions | EzSeva",
    description:
      "EzSeva — free browser-based tools for Indian students & professionals. 100% private. No signup.",
    url: "https://www.ezseva.in/about",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About EzSeva — Built for Billions",
    description: "Free tools for India. 100% private. No signup. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/about" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}