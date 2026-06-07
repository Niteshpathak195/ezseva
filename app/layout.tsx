// ─────────────────────────────────────────────
// EzSeva — Root Layout
// app/layout.tsx
// ─────────────────────────────────────────────
// Version : 1.5.0
// Updated : March 2026
//
// CHANGES v1.5.0:
//   ✅ metadataBase added — fixes OG image absolute URLs
//   ✅ www.ezseva.in — consistent with sitemap.ts
//   ✅ openGraph url + canonical → www.ezseva.in
//   ✅ OG image URL → www.ezseva.in
//   ✅ Twitter image → www.ezseva.in
// ─────────────────────────────────────────────

import type { Metadata, Viewport } from "next";
import "./globals.css";
import JsonLd from "./components/seo/JsonLd";
import Providers from "./components/Providers";

/* ── SEO Metadata ── */
export const metadata: Metadata = {

  /* ── CRITICAL: metadataBase — tool layouts ke relative URLs
     automatically absolute ban jaate hain ── */
  metadataBase: new URL("https://www.ezseva.in"),

  title: {
    default: "EzSeva — Free PDF & Image Tools Online | Built for Billions",
    template: "%s | EzSeva",
  },
  description:
    "Free online tools for India — resize photos for SSC, Railway, VYAPAM; compress, merge & split PDFs; typing test for CPCT. Processing in your browser. No signup.",
  keywords: [
    "free pdf tools online india",
    "image resize online free",
    "SSC photo resize",
    "VYAPAM photo size",
    "compress pdf online",
    "merge pdf online free",
    "typing test CPCT",
    "photo signature merge online",
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
    url: "https://www.ezseva.in",          // ← www
    siteName: "EzSeva",
    title: "EzSeva — Free PDF & Image Tools | Built for Billions",
    description:
      "Free browser tools for Indian exam candidates. Resize photos, compress PDFs, practice typing — processing on your device.",
    images: [
      {
        url: "https://www.ezseva.in/og-image.png",  // ← www
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
    images: ["https://www.ezseva.in/og-image.png"],  // ← www
  },
  alternates: {
    canonical: "https://www.ezseva.in",    // ← www — sitemap se match
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
  themeColor: "#0C1222",
};

/* ── Root Layout ── */
const IS_PRODUCTION =
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_APP_URL === "https://www.ezseva.in";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {!IS_PRODUCTION && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {IS_PRODUCTION && (
          <>
            {/* ── Google Analytics (production only) ── */}
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

            {/* ── Google AdSense (production only) ── */}
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2223723556949185"
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body>
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
