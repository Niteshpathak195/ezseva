"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LEGAL_TERMS, SITE } from "../data/site-content";

const CARD: React.CSSProperties = {
  background: "var(--bg-base)",
  border: "1.5px solid var(--border-light)",
  borderRadius: "var(--radius-xl)",
  padding: "24px 28px",
  marginBottom: "14px",
  boxShadow: "var(--shadow-md)",
};

const ICON_BOX: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "var(--radius-md)",
  background: "var(--brand-light)",
  border: "1.5px solid var(--brand-mid)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  flexShrink: 0,
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
      <main
        style={{
          background: "var(--bg-subtle)",
          minHeight: "100vh",
          paddingBottom: "56px",
          fontFamily: "var(--font)",
        }}
      >
        <div className="container-sm" style={{ padding: "40px 20px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "var(--brand-light)",
                border: "1px solid var(--brand-border)",
                borderRadius: "var(--radius-sm)",
                padding: "4px 12px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "var(--brand)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Legal
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontWeight: 900,
                letterSpacing: "-0.8px",
                color: "var(--text-primary)",
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              {LEGAL_TERMS.title}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              {LEGAL_TERMS.intro}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-hint)",
                marginTop: "12px",
              }}
            >
              Last updated: {SITE.legalUpdated} · {SITE.domain}
            </p>
          </div>

          {LEGAL_TERMS.sections.map((section) => (
            <div key={section.title} style={CARD}>
              <div style={ICON_BOX}>{section.icon}</div>
              <h2 style={SECTION_TITLE}>{section.title}</h2>
              {"body" in section &&
                section.body?.map((para, i) => (
                  <p
                    key={para.slice(0, 40)}
                    style={{ ...BODY_TEXT, marginTop: i > 0 ? "12px" : 0 }}
                  >
                    {para}
                  </p>
                ))}
              {"list" in section && section.list && (
                <>
                  <p style={BODY_TEXT}>
                    {section.title.includes("Permitted")
                      ? "You may use EzSeva for:"
                      : "You may not use EzSeva to:"}
                  </p>
                  <ul
                    style={{
                      ...BODY_TEXT,
                      marginTop: "10px",
                      paddingLeft: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}

          <div
            style={{
              background: "var(--bg-muted)",
              border: "1.5px solid var(--brand-mid)",
              borderRadius: "var(--radius-xl)",
              padding: "24px 28px",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Questions about these terms?
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "14px",
              }}
            >
              Email {SITE.email.general}
            </p>
            <a
              href="/contact"
              className="btn-primary"
              style={{ fontSize: "13px", padding: "10px 24px" }}
            >
              Contact Us
            </a>
          </div>

          <div style={{ textAlign: "center", paddingBottom: "20px" }}>
            <a
              href="/"
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Back to All Tools
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
