import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resize Free — Photo KB Pixels | SSC, VYAPAM, DigiLocker, Passport | EzSeva",
  description:
    "Resize photo to exact KB/pixels — 20KB, 50KB, 100KB for SSC, VYAPAM, Railway, UPSC, DigiLocker, Passport, Aadhaar update, scholarship portal. No upload. Free forever.",
  keywords: [
    "image resize online free",
    "photo resize in kb",
    "resize image to 20kb",
    "resize image to 50kb",
    "resize image to 100kb",
    "photo resize for SSC",
    "VYAPAM photo resize",
    "Railway RRB photo size",
    "MP PEB photo resize",
    "CPCT MP photo size",
    "DigiLocker photo size",
    "passport photo resize online",
    "Aadhaar photo update size",
    "scholarship portal photo resize",
    "photo size kaise kam karein",
    "image resize without quality loss",
    "profile picture resize free",
    "product image resize online",
    "sarkari exam photo kb size",
    "IBPS photo size resize",
    "NEET photo resize",
    "JEE photo resize",
  ],
  openGraph: {
    title: "Free Image Resize — SSC, VYAPAM, DigiLocker, Passport | EzSeva",
    description:
      "Resize photo to exact KB/pixels — SSC, VYAPAM, Railway, DigiLocker, Passport, scholarship portals. No upload.",
    url: "https://www.ezseva.in/image-resize",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Resize — SSC, VYAPAM, DigiLocker, Passport | EzSeva",
    description: "Resize to exact KB/pixels. No upload. 100% private. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/image-resize" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}