"use client";

// ─────────────────────────────────────────────
// EzSeva — Privacy Policy
// app/privacy/page.tsx
// ─────────────────────────────────────────────
// Route   : /privacy
// Type    : Server Component (no interactivity needed)
// Updated : March 2026
// ─────────────────────────────────────────────

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Shared section styles as constants ── */
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

/* ── Page ── */
export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", paddingBottom: "56px", fontFamily: "var(--font)" }}>

        <div className="container-sm" style={{ padding: "40px 20px 0" }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🔒 Legal
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "480px", margin: "0 auto 8px" }}>
              Your privacy is our top priority. EzSeva is built on one core promise:
            </p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--brand)" }}>
              Your files never leave your device. Ever.
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-hint)", marginTop: "12px" }}>
              Last updated: March 2026
            </p>
          </div>

          {/* ── Trust Banner ── */}
          <div style={{ background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-xl)", padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>✅</span>
            <p style={{ fontSize: "13.5px", color: "var(--brand-dark)", fontWeight: 600, lineHeight: 1.6 }}>
              EzSeva processes all files locally in your browser. We have no servers that receive your documents, images, or any uploaded content.
            </p>
          </div>

          {/* ── Section 1 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>📁</div>
            <h2 style={SECTION_TITLE}>1. File Processing — 100% In Your Browser</h2>
            <p style={BODY_TEXT}>
              All EzSeva tools — PDF compress, merge, split, protect, image resize, crop, and all others — run entirely using JavaScript in your browser. When you select or drag a file, it is read into your browser&apos;s memory only. It is never uploaded to any server, never transmitted over the internet, and never stored anywhere outside your own device.
            </p>
            <p style={{ ...BODY_TEXT, marginTop: "12px" }}>
              This is not just a promise — it is technically impossible for us to receive your files because we have no backend server that accepts file uploads.
            </p>
          </div>

          {/* ── Section 2 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>🍪</div>
            <h2 style={SECTION_TITLE}>2. Cookies & Analytics</h2>
            <p style={BODY_TEXT}>
              EzSeva currently does not use any analytics service or tracking cookies. We do not monitor individual user behaviour, page views, or usage patterns at this time.
            </p>
            <p style={{ ...BODY_TEXT, marginTop: "12px" }}>
              In the future, if we add analytics or advertising (e.g. Google Analytics or Google AdSense), this Privacy Policy will be updated before those services go live, and a clear notice will be added here.
            </p>
          </div>

          {/* ── Section 3 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>👤</div>
            <h2 style={SECTION_TITLE}>3. No Account Required — No Personal Data Collected</h2>
            <p style={BODY_TEXT}>
              EzSeva does not require you to create an account, provide your name, email address, phone number, or any other personal information to use any of our tools. We do not collect, store, or process any personally identifiable information (PII).
            </p>
          </div>

          {/* ── Section 4 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>🔗</div>
            <h2 style={SECTION_TITLE}>4. Third-Party Links</h2>
            <p style={BODY_TEXT}>
              EzSeva may contain links to third-party websites (e.g., government portals, job sites). We are not responsible for the privacy practices of those sites. We encourage you to read the privacy policies of any external site you visit.
            </p>
          </div>

          {/* ── Section 5 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>👶</div>
            <h2 style={SECTION_TITLE}>5. Children&apos;s Privacy</h2>
            <p style={BODY_TEXT}>
              EzSeva does not knowingly collect any data from children under 13 years of age. Since we collect no personal data from any user, there is no specific risk of children&apos;s data being collected. Our tools are designed for general use including students of all ages.
            </p>
          </div>

          {/* ── Section 6 ── */}
          <div style={CARD}>
            <div style={ICON_BOX}>📝</div>
            <h2 style={SECTION_TITLE}>6. Changes to This Policy</h2>
            <p style={BODY_TEXT}>
              We may update this Privacy Policy from time to time — for example, when we add analytics or advertising services. Any changes will be posted on this page with an updated date. Since we do not collect your email, we cannot notify you directly.
            </p>
          </div>

          {/* ── Contact ── */}
          <div style={{ background: "var(--bg-muted)", border: "1.5px solid var(--brand-mid)", borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              Questions about privacy?
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
              We&apos;re happy to clarify anything. Reach out to us.
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
  title: "Privacy Policy | EzSeva",
  description: "EzSeva privacy policy — all file processing happens in your browser. No uploads, no data collection, 100% private.",
  alternates: { canonical: "https://ezseva.in/privacy" },
};
*/