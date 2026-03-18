"use client";

// ─────────────────────────────────────────────
// EzSeva — Contact Page
// app/contact/page.tsx
// ─────────────────────────────────────────────
// Route   : /contact
// Type    : Client Component (hover states needed)
// Updated : March 2026
//
// SECURITY NOTE:
//   - No form tag used — onClick handler only
//   - No server API call — mailto: link opens email client
//   - No user data stored anywhere
//   - No localStorage / sessionStorage
// ─────────────────────────────────────────────

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {

  const contactOptions = [
    {
      icon: "📧",
      title: "Email Us",
      desc: "Best for bugs, feature requests, or business enquiries.",
      action: "hello@ezseva.in",
      href: "mailto:hello@ezseva.in",
      label: "Send Email",
    },
    {
      icon: "🐛",
      title: "Report a Bug",
      desc: "Found something broken? Tell us exactly what happened.",
      action: "bugs@ezseva.in",
      href: "mailto:bugs@ezseva.in?subject=Bug Report — EzSeva",
      label: "Report Bug",
    },
    {
      icon: "💡",
      title: "Suggest a Tool",
      desc: "Have an idea for a tool that India needs? We&apos;re listening.",
      action: "ideas@ezseva.in",
      href: "mailto:ideas@ezseva.in?subject=Tool Idea — EzSeva",
      label: "Share Idea",
    },
  ];

  const faqs = [
    {
      q: "My file is not processing correctly. What should I do?",
      a: "Try refreshing the page and uploading the file again. If the issue persists, please email us with the tool name and file type (e.g., PDF, JPG). Do NOT send us the actual file — we cannot receive files.",
    },
    {
      q: "Can I request a new tool?",
      a: "Yes! We love suggestions. Email us at ideas@ezseva.in with your idea. Tools that help Indian govt exam candidates get priority.",
    },
    {
      q: "I want to advertise on EzSeva. Who do I contact?",
      a: "Currently EzSeva uses Google AdSense only. For direct advertising enquiries, email hello@ezseva.in.",
    },
    {
      q: "How do I report a privacy or security issue?",
      a: "Please email hello@ezseva.in with the subject 'Security Issue'. We take all security reports seriously and will respond within 48 hours.",
    },
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
                💬 Get in Touch
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Contact EzSeva
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "460px", margin: "0 auto" }}>
              We&apos;re a small team building tools for India. We read every message and reply within 1–2 working days.
            </p>
          </div>

          {/* ── Contact Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {contactOptions.map((opt) => (
              <div key={opt.title} style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "22px 20px", boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>{opt.title}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6, flex: 1 }}>{opt.desc}</p>
                <a
                  href={opt.href}
                  className="btn-primary"
                  style={{ fontSize: "12.5px", padding: "9px 16px", marginTop: "4px", textAlign: "center" }}
                >
                  {opt.label}
                </a>
              </div>
            ))}
          </div>

          {/* ── Response Time Banner ── */}
          <div style={{ background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏱️</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--brand-dark)", marginBottom: "2px" }}>
                Typical response time: 1–2 working days
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                We are a small indie team. We appreciate your patience and read every message carefully.
              </p>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ background: "var(--bg-base)", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "20px" }}>
              ❓ Common Questions
            </h2>
            {faqs.map((faq, i) => (
              <div key={faq.q} style={{ marginBottom: i < faqs.length - 1 ? "18px" : 0, paddingBottom: i < faqs.length - 1 ? "18px" : 0, borderBottom: i < faqs.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Q: {faq.q}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* ── Important Note ── */}
          <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: "var(--radius-xl)", padding: "16px 20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>⚠️ Please do not send us your files</p>
            <p style={{ fontSize: "12.5px", color: "#78350F", lineHeight: 1.6 }}>
              EzSeva cannot receive, open, or process files sent via email. All tool processing happens in your browser only. If you need help with a specific tool, describe the issue in text — do not attach files.
            </p>
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
  title: "Contact | EzSeva",
  description: "Contact the EzSeva team — report bugs, suggest tools, or ask questions. We reply within 1-2 working days.",
  alternates: { canonical: "https://ezseva.in/contact" },
};
*/