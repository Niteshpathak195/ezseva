import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Crop Free — Passport Size, Exam Photo, LinkedIn, Thumbnail | EzSeva",
  description:
    "Crop image for passport, exam forms (SSC, VYAPAM, UPSC), LinkedIn, YouTube thumbnail, Instagram, WhatsApp DP, product photos. No watermark. No upload. Free forever.",
  keywords: [
    "image crop online free",
    "photo crop online no watermark",
    "crop image to passport size",
    "exam photo crop SSC UPSC",
    "VYAPAM photo crop",
    "LinkedIn profile photo crop",
    "YouTube thumbnail crop",
    "Instagram square photo crop",
    "WhatsApp DP photo crop",
    "product photo crop free",
    "custom ratio crop free",
    "image crop kaise karein",
    "scholarship photo crop",
    "profile picture crop free",
    "photo crop without app",
    "admit card photo crop",
  ],
  openGraph: {
    title: "Free Image Crop — Passport, Exam, LinkedIn, Thumbnail | EzSeva",
    description:
      "Crop for passport, SSC, VYAPAM, LinkedIn, YouTube, Instagram, WhatsApp. No watermark. No upload. Free.",
    url: "https://www.ezseva.in/image-crop",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Crop — Passport, Exam, LinkedIn, Thumbnail | EzSeva",
    description: "Crop to any ratio. No watermark. No upload. 100% private. Free.",
  },
  alternates: { canonical: "https://www.ezseva.in/image-crop" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}