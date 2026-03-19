// ─────────────────────────────────────────────
// EzSeva — Root Layout
// app/layout.tsx
// ─────────────────────────────────────────────
// Version : 1.3.0
// Updated : March 2026
//
// CHANGES:
//   ✅ Google Analytics G-1B50343XM7 added
//   ✅ Google Search Console verification added
//   ✅ AdSense placeholder — add ca-pub-XXXXX when approved
// ─────────────────────────────────────────────

import type { Metadata, Viewport } from "next";
import "./globals.css";

/* ── SEO Metadata ── */
export const metadata: Metadata = {
  title: {
    default: "EzSeva — Free PDF & Image Tools Online | Built for Billions",
    template: "%s | EzSeva",
  },
  description:
    "Free online tools for India — resize images for SSC/Railway/VYAPAM, compress PDFs, merge documents, add passwords, and write with AI. 100% private. No signup. Works on mobile.",
  keywords: [
    "free pdf tools online india",
    "image resize online free",
    "compress pdf online",
    "merge pdf online free",
    "vyapam photo resize",
    "ssc photo size online",
    "pdf password protect free",
    "image to pdf online",
    "ezseva",
    "built for billions",
  ],
  authors: [{ name: "EzSeva" }],
  creator: "EzSeva",
  publisher: "EzSeva",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  /* ── Google Search Console Verification ── */
  verification: {
    google: "nDYzTTfDtywNXhPoATZXES2G5J7E1lKan1xsvibXBZg",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ezseva.in",
    siteName: "EzSeva",
    title: "EzSeva — Free PDF & Image Tools | Built for Billions",
    description:
      "Free browser-based tools for Indian govt exam candidates. Resize photos, compress PDFs, merge documents. 100% private — files never leave your device.",
    images: [
      {
        url: "https://ezseva.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "EzSeva — Built for Billions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EzSeva — Free PDF & Image Tools",
    description: "Free browser-based tools for India. 100% private. No signup.",
    images: ["https://ezseva.in/og-image.png"],
  },
  alternates: {
    canonical: "https://ezseva.in",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* ── Viewport ── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D9488",
};

/* ── Root Layout ── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {/* ── Google Analytics ── */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1B50343XM7"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1B50343XM7');
            `,
          }}
        />

        {/* ── Google AdSense — uncomment when Publisher ID approved ──
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}