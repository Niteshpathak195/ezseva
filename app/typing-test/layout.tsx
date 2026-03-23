import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Test Free — Hindi English | CPCT, SSC, Railway Speed Test | EzSeva",
  description:
    "Free typing speed test for CPCT MP, SSC, Railway, IBPS. Hindi & English typing — WPM & accuracy check. Exam presets included. No signup. 100% free.",
  keywords: [
    "typing test online free",
    "hindi typing test",
    "english typing test",
    "CPCT typing test",
    "CPCT MP typing speed",
    "SSC typing test online",
    "Railway typing test",
    "IBPS typing test",
    "typing speed test WPM",
    "typing test for government exam",
    "hindi typing speed check",
    "krutidev typing test",
    "mangal font typing test",
    "typing practice online free",
    "MP vyapam typing test",
  ],
  openGraph: {
    title: "Free Typing Test — CPCT, SSC, Railway, Hindi & English | EzSeva",
    description:
      "Check typing speed for CPCT, SSC, Railway, IBPS. Hindi & English. WPM + accuracy. Free forever.",
    url: "https://www.ezseva.in/typing-test",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Typing Test — CPCT, SSC, Railway | EzSeva",
    description: "Hindi & English typing speed test. CPCT presets. Free forever.",
  },
  alternates: { canonical: "https://www.ezseva.in/typing-test" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}