"use client";

// ─────────────────────────────────────────────
// EzSeva — About Page
// app/about/page.tsx
// ─────────────────────────────────────────────
// Route   : /about
// Type    : Client Component (hover states)
// Updated : March 2026
// ─────────────────────────────────────────────

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

export default function AboutPage() {

  const values = [
    { icon: "🔒", title: "Privacy First", desc: "Your files never leave your device. We built EzSeva so that even we cannot see what you process. This is not a feature — it is the foundation." },
    { icon: "₹0", title: "Free Forever", desc: "Every Indian deserves access to powerful tools regardless of income. EzSeva is free to use and will remain free. We sustain ourselves through non-intrusive ads." },
    { icon: "📱", title: "Mobile Ready", desc: "Over 70% of India browses on mobile. Every EzSeva tool is built to work perfectly on a ₹8,000 Android phone on a slow connection — not just on a MacBook." },
    { icon: "🇮🇳", title: "India First", desc: "We design for India — VYAPAM photo sizes, SSC document formats, Railway application presets. Not generic tools translated to India. Tools built for India from day one." },
  ];

  const stats = [
    { value: "12+", label: "Free Tools" },
    { value: "100%", label: "Browser-based" },
    { value: "0", label: "Server uploads" },
    { value: "₹0", label: "Cost to use" },
  ];

  const toolCategories = [
    { icon: "🖼️", name: "Image Tools", desc: "Resize, crop, convert — built for govt exam photo requirements" },
    { icon: "📄", name: "PDF Tools", desc: "Compress, merge, split, protect — all in your browser" },
    { icon: "🤖", name: "AI Tools", desc: "Letter writer, resume builder — coming soon" },
  ];

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px", fontFamily: "var(--font)" }}>

        <div className="container-sm" style={{ padding: "40px 20px 0" }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🌏 Our Story
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              About EzSeva
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "480px", margin: "0 auto" }}>
              Free browser tools built for India&apos;s 1.4 billion people — students, job seekers, cyber cafe owners, and everyday citizens who deserve great software.
            </p>
          </div>

          {/* ── Logo Hero ── */}
          <div style={{ background: "linear-gradient(135deg, #0A2E2B 0%, #134E4A 60%, #0D9488 100%)", borderRadius: "var(--radius-2xl)", padding: "40px 24px", marginBottom: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <Logo size="icon" />
              </div>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginBottom: "8px" }}>
                Built for Billions.
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.65, maxWidth: "380px", margin: "0 auto" }}>
                India&apos;s own free utility platform — like iLovePDF but built for every Indian, in every city, on every device.
              </p>
            </div>
          </div>

          {/* ── Stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "16px 12px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, color: "var(--brand)", letterSpacing: "-0.5px", marginBottom: "4px" }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Mission ── */}
          <div style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--brand-light)", border: "1.5px solid var(--brand-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>🎯</div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>Our Mission</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "12px" }}>
              Millions of Indians need to resize a photo for a government form, compress a PDF to upload on a portal, or write a formal letter — but they either pay at cyber cafes, struggle with complex software, or upload sensitive files to foreign servers they can&apos;t trust.
            </p>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.75 }}>
              EzSeva was built to fix that. <strong style={{ color: "var(--text-secondary)" }}>100% free. 100% private. 100% in your browser.</strong> No account. No upload. No cost. Just get your work done.
            </p>
          </div>

          {/* ── Values ── */}
          <div style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "20px" }}>
              💎 What We Stand For
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {values.map((v, i) => (
                <div key={v.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start", paddingBottom: i < values.length - 1 ? "18px" : 0, borderBottom: i < values.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--brand-light)", border: "1.5px solid var(--brand-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "var(--brand)", flexShrink: 0 }}>
                    {v.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>{v.title}</p>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tools ── */}
          <div style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
              🛠️ What We Build
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {toolCategories.map((cat) => (
                <div key={cat.name} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 14px", background: "var(--bg-muted)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</span>
                  <div>
                    <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{cat.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Who We Are ── */}
          <div style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--brand-light)", border: "1.5px solid var(--brand-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>👨‍💻</div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>Who We Are</h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "12px" }}>
              EzSeva is an independent project started in Bhopal, Madhya Pradesh. We are a small team with a simple goal: make powerful tools available to every Indian for free.
            </p>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.75 }}>
              We are not a large corporation. We are people who understand what it means to wait at a cyber cafe, to pay ₹20 per page to resize a photo, or to worry about uploading sensitive documents to an unknown website. EzSeva is our answer to all of that.
            </p>
          </div>

          {/* ── CTA ── */}
          <div style={{ background: "var(--bg-muted)", border: "1.5px solid var(--brand-mid)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Ready to try EzSeva?
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              All tools are free. No account needed. Start now.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/" className="btn-primary" style={{ fontSize: "13px", padding: "10px 24px" }}>
                Explore All Tools →
              </a>
              <a href="/contact" className="btn-secondary" style={{ fontSize: "13px", padding: "10px 24px" }}>
                Contact Us
              </a>
            </div>
          </div>

          {/* ── Back ── */}
          <div style={{ textAlign: "center", paddingBottom: "20px" }}>
            <a href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}>
              ← Back to All Tools
            </a>
          </div>

        </div>
        <Footer />
      </main>
    </>
  );
}

/*
export const metadata = {
  title: "About EzSeva — Built for Billions",
  description: "EzSeva is a free browser-based tool platform built for India. PDF tools, image tools, AI tools — 100% private, no uploads, free forever.",
  alternates: { canonical: "https://ezseva.in/about" },
};
*/