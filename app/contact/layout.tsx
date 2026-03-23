import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact EzSeva — Feedback, Support & Suggestions | EzSeva",
  description:
    "Contact EzSeva team for feedback, bug reports, tool suggestions or support. We are building free tools for India — your feedback helps us improve.",
  openGraph: {
    title: "Contact EzSeva — Feedback & Support",
    description: "Send feedback, report bugs or suggest new tools to the EzSeva team.",
    url: "https://www.ezseva.in/contact",
    siteName: "EzSeva",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://www.ezseva.in/contact" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
