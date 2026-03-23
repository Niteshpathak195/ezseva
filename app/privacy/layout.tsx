import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EzSeva | Your Files Never Leave Your Device",
  description:
    "EzSeva privacy policy. All file processing is 100% client-side — your files never leave your device. No data collection, no tracking, no signup required.",
  openGraph: {
    title: "Privacy Policy — EzSeva",
    description: "100% client-side processing. Your files never leave your device.",
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