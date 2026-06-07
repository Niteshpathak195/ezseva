import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  EXAM_LANDING_PAGES,
  getExamLanding,
  RESIZE_PRESETS,
} from "../../data/exam-presets";
import { EXAM_DISCLAIMER } from "../../data/site-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXAM_LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getExamLanding(slug);
  if (!page) return { title: "Exam Guide | EzSeva" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://www.ezseva.in/exams/${slug}`,
      siteName: "EzSeva",
      locale: "en_IN",
      type: "article",
    },
    alternates: { canonical: `https://www.ezseva.in/exams/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ExamLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getExamLanding(slug);
  if (!page) notFound();

  const preset = RESIZE_PRESETS.find((p) => p.id === page.presetId)!;

  return (
    <>
      <Navbar />
      <main className="ez-tool-page">
        <header
          className="ez-tool-hero"
          style={
            {
              "--tool-accent": "var(--brand)",
              "--tool-accent-soft": "var(--brand-light)",
            } as React.CSSProperties
          }
        >
          <div className="container-sm ez-tool-hero-inner">
            <nav className="ez-tool-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <a href="/#tools">Tools</a>
              <span aria-hidden="true">/</span>
              <span className="ez-tool-breadcrumb-current">{page.title}</span>
            </nav>
            <div className="ez-tool-hero-row">
              <div className="ez-tool-hero-icon" aria-hidden="true">
                📐
              </div>
              <div className="ez-tool-hero-copy">
                <div className="ez-tool-eyebrow">
                  <span className="ez-tool-eyebrow-dot" />
                  Exam guide · Free resize tool
                </div>
                <h1 className="ez-tool-h1">{page.title}</h1>
                <p className="ez-tool-sub">{page.intro}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container-sm ez-tool-body">
          <section
            style={{
              background: "#fff",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)",
              padding: 24,
              marginBottom: 16,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>
              Official dimensions (verify in notification)
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                { label: "Width", value: `${preset.width} px` },
                { label: "Height", value: `${preset.height} px` },
                { label: "Max size", value: `${preset.maxKB} KB` },
                { label: "Format", value: preset.format.toUpperCase() },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--brand-light)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "var(--brand)" }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={`/image-resize?preset=${page.presetId}`}
                className="btn-primary"
                style={{ textDecoration: "none", flex: "1 1 200px", textAlign: "center" }}
              >
                🖼️ Resize photo now
              </a>
              <a
                href="/photo-joiner"
                className="btn-secondary"
                style={{ textDecoration: "none", flex: "1 1 160px", textAlign: "center" }}
              >
                🪪 Photo + signature
              </a>
            </div>
          </section>

          <section
            style={{
              background: "#fff",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)",
              padding: 24,
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Tips for {preset.label}</h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.75, color: "var(--text-secondary)", fontSize: 13.5 }}>
              {page.tips.map((tip) => (
                <li key={tip} style={{ marginBottom: 6 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section
            style={{
              background: "#fff",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)",
              padding: 24,
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>All exam photo specs</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--brand-light)" }}>
                    {["Exam", "Size", "Max KB", "Guide"].map((h) => (
                      <th
                        key={h}
                        style={{ padding: "9px 12px", textAlign: "left", fontWeight: 800, color: "var(--brand-dark)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESIZE_PRESETS.filter((p) => p.id !== "custom").map((p, i) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: "1px solid var(--border-light)",
                          background: i % 2 === 0 ? "#fff" : "var(--bg-subtle)",
                        }}
                      >
                        <td style={{ padding: "9px 12px", fontWeight: 700 }}>{p.label}</td>
                        <td style={{ padding: "9px 12px" }}>{p.width}×{p.height} px</td>
                        <td style={{ padding: "9px 12px" }}>{p.maxKB} KB</td>
                        <td style={{ padding: "9px 12px" }}>
                          {p.id !== page.presetId ? (
                            <a href={`/exams/${p.id}`} style={{ color: "var(--brand)", fontWeight: 700, fontSize: 12 }}>
                              View →
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Current</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="ez-tool-disclaimer" role="note">
            {EXAM_DISCLAIMER}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
