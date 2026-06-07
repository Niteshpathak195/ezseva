import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — EzSeva | Free Online Tools India",
  description:
    "EzSeva Terms of Service. Free image, PDF, and typing tools. Not affiliated with government exam bodies. Verify official requirements before submission.",
  openGraph: {
    title: "Terms of Service — EzSeva",
    description: "Free to use. No signup. Browser-based tools — no server upload.",
    url: "https://www.ezseva.in/terms",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://www.ezseva.in/terms" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}