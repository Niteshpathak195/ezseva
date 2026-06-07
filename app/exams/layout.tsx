import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam Photo Size Guides — SSC, Railway, UPSC & More | EzSeva",
  description:
    "Official photo dimensions for SSC, Railway, IBPS, UPSC, VYAPAM, NEET and more. Free resize tools — processed in your browser.",
  alternates: { canonical: "https://www.ezseva.in/exams" },
};

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
