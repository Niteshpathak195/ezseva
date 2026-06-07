import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EzSeva | In-Browser Processing & Cookies",
  description:
    "EzSeva Privacy Policy (June 2026). Tool processing happens in your browser. We use Google Analytics and AdSense on the live site. No signup required.",
  openGraph: {
    title: "Privacy Policy — EzSeva",
    description: "In-browser tool processing. Google Analytics & AdSense on live site.",
    url: "https://www.ezseva.in/privacy",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://www.ezseva.in/privacy" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}