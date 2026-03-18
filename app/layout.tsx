// ─────────────────────────────────────────────
// EzSeva — Root Layout
// app/layout.tsx
// ─────────────────────────────────────────────
// Version : 1.1.0 (Audit Fix)
// Updated : March 2026
//
// FIXES:
//   ✅ FIX 1 — Geist font REMOVED → Plus Jakarta Sans via globals.css @import
//              (EzSeva design token: --font: 'Plus Jakarta Sans', sans-serif)
//   ✅ FIX 2 — title: "EzSeva — Free PDF & Image Tools Online"
//   ✅ FIX 3 — description: proper SEO description for Indian users
//   ✅ FIX 4 — lang="en-IN" (India-first SEO signal)
//   ✅ FIX 5 — AdSense auto-ads script added in <head>
//              (no data-ad-slot — Auto Ads mode)
//   ✅ FIX 6 — viewport, themeColor, OpenGraph metadata added
//   ✅ FIX 7 — No className on body — font handled by CSS variable
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

/* ── Viewport (separate export per Next.js 14 spec) ── */
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
    // FIX 4: lang="en-IN" — India-first SEO signal
    <html lang="en-IN">
      <head>
        {/*
          FIX 5: Google AdSense Auto Ads script
          - crossOrigin="anonymous" for security
          - async — never blocks rendering
          - No data-ad-slot — Auto Ads mode handles placement
          - Replace "ca-pub-XXXXXXXXXXXXXXXXX" with your actual Publisher ID
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      {/*
        FIX 1: No font className on body
        Plus Jakarta Sans loaded via @import in globals.css
        Applied globally via: body { font-family: var(--font); }
        No Geist font — that was Next.js boilerplate, not EzSeva design
      */}
      <body>
        {children}
      </body>
    </html>
  );
}