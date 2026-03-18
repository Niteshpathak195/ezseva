"use client";

// ─────────────────────────────────────────────
// EzSeva — Terms of Service
// app/terms/page.tsx
// ─────────────────────────────────────────────
// Route   : /terms
// Type    : Server Component
// Updated : March 2026
// ─────────────────────────────────────────────

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CARD: React.CSSProperties = {
  background: "var(--bg-base)",
  border: "1.5px solid var(--border-light)",
  borderRadius: "var(--radius-xl)",
  padding: "24px 28px",
  marginBottom: "14px",
  boxShadow: "var(--shadow-md)",
};

const ICON_BOX: React.CSSProperties = {
  width: 42, height: 42,
  borderRadius: "var(--radius-md)",
  background: "var(--brand-light)",
  border: "1.5px solid var(--brand-mid)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 20, flexShrink: 0,
  marginBottom: 14,
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 800,
  color: "var(--text-primary)",
  marginBottom: "8px",
  letterSpacing: "-0.2px",
};

const BODY_TEXT: React.CSSProperties = {
  fontSize: "13.5px",
  color: "var(--text-muted)",
  lineHeight: 1.75,
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px", fontFamily: "var(--font)" }}>

        <div className="container-sm" style={{ padding: "40px 20px 0" }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                📄 Legal
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "480px", margin: "0 auto 8px" }}>
              By using EzSeva, you agree to these simple, fair terms. We&apos;ve written them in plain language — no legalese.
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-hint)", marginTop: "12px" }}>
              Last updated: March 2026
            </p>
          </div>

          {/* ── Section 1 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>✅</div>
            <h2 style={SECTION_TITLE}>1. Acceptance of Terms</h2>
            <p style={BODY_TEXT}>
              By accessing or using EzSeva (ezseva.in), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use EzSeva. These terms apply to all visitors and users of the website.
            </p>
          </div>

          {/* ── Section 2 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>🛠️</div>
            <h2 style={SECTION_TITLE}>2. What EzSeva Provides</h2>
            <p style={BODY_TEXT}>
              EzSeva is a free, browser-based utility tool platform. All tools — including PDF processing, image editing, and AI writing tools — are provided &quot;as is&quot; for personal and professional use. EzSeva processes all files locally in your browser. We do not store, access, or transmit your files.
            </p>
            <p style={{ ...BODY_TEXT, marginTop: "12px" }}>
              We strive to keep all tools available and accurate, but we do not guarantee uninterrupted access or error-free operation at all times.
            </p>
          </div>

          {/* ── Section 3 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>✔️</div>
            <h2 style={SECTION_TITLE}>3. Permitted Use</h2>
            <p style={BODY_TEXT}>You may use EzSeva for:</p>
            <ul style={{ ...BODY_TEXT, marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Personal document processing (resizing photos, compressing PDFs, etc.)</li>
              <li>Professional or business document preparation</li>
              <li>Educational purposes</li>
              <li>Government form preparation (SSC, Railway, VYAPAM, UPSC, etc.)</li>
            </ul>
          </div>

          {/* ── Section 4 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>🚫</div>
            <h2 style={SECTION_TITLE}>4. Prohibited Use</h2>
            <p style={BODY_TEXT}>You may not use EzSeva to:</p>
            <ul style={{ ...BODY_TEXT, marginTop: "10px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Process, distribute, or create illegal content</li>
              <li>Infringe on the copyright or intellectual property of others</li>
              <li>Attempt to reverse-engineer, copy, or exploit EzSeva&apos;s source code without permission</li>
              <li>Use automated bots or scrapers to access or overload our services</li>
              <li>Misrepresent documents or use EzSeva to commit fraud</li>
            </ul>
          </div>

          {/* ── Section 5 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>⚠️</div>
            <h2 style={SECTION_TITLE}>5. Disclaimer of Warranties</h2>
            <p style={BODY_TEXT}>
              EzSeva is provided &quot;as is&quot; without warranty of any kind, express or implied. We do not warrant that the tools will always be accurate, complete, or suitable for your specific use case. Always verify important documents before submission to government or official bodies.
            </p>
            <p style={{ ...BODY_TEXT, marginTop: "12px" }}>
              We are not liable for any loss of data or damage arising from your use of EzSeva. Since all processing is local, we have no access to your files and cannot be held responsible for the content you process.
            </p>
          </div>

          {/* ── Section 6 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>💡</div>
            <h2 style={SECTION_TITLE}>6. Intellectual Property</h2>
            <p style={BODY_TEXT}>
              The EzSeva name, logo, design, and all original content on this website are the intellectual property of EzSeva. You may not copy, reproduce, or distribute our branding or content without written permission.
            </p>
            <p style={{ ...BODY_TEXT, marginTop: "12px" }}>
              Files you process using EzSeva remain your property. We claim no rights over any content you upload or download.
            </p>
          </div>

          {/* ── Section 7 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>💰</div>
            <h2 style={SECTION_TITLE}>7. Free Service & Advertising</h2>
            <p style={BODY_TEXT}>
              EzSeva is free to use. To sustain the service, we display advertisements via Google AdSense. By using EzSeva, you acknowledge that ads may appear on the site. You may use an ad blocker — we understand, and it will not affect tool functionality.
            </p>
          </div>

          {/* ── Section 8 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>⚖️</div>
            <h2 style={SECTION_TITLE}>8. Governing Law</h2>
            <p style={BODY_TEXT}>
              These Terms of Service are governed by the laws of India. Any disputes arising from the use of EzSeva will be subject to the jurisdiction of the courts in Bhopal, Madhya Pradesh, India.
            </p>
          </div>

          {/* ── Section 9 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>🔄</div>
            <h2 style={SECTION_TITLE}>9. Changes to Terms</h2>
            <p style={BODY_TEXT}>
              We may update these Terms of Service at any time. Continued use of EzSeva after any changes means you accept the updated terms. The &quot;Last updated&quot; date at the top of this page will reflect any changes.
            </p>
          </div>

          {/* ── Contact ── */}
          <div style={{ background: "var(--bg-muted)", border: "1.5px solid var(--brand-mid)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              Questions about our terms?
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
              We&apos;re a small team and we&apos;re happy to explain anything.
            </p>
            <a href="/contact" className="btn-primary" style={{ fontSize: "13px", padding: "10px 24px" }}>
              Contact Us
            </a>
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
  title: "Terms of Service | EzSeva",
  description: "EzSeva terms of service — simple, fair terms for using our free browser-based tools.",
  alternates: { canonical: "https://ezseva.in/terms" },
};
*/