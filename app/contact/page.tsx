"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CONTACT_CONTENT, SITE } from "../data/site-content";

export default function ContactPage() {
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
                {CONTACT_CONTENT.eyebrow}
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
              {CONTACT_CONTENT.title}
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
              {CONTACT_CONTENT.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {CONTACT_CONTENT.options.map((opt) => (
              <div
                key={opt.title}
                style={{
                  background: "var(--bg-base)",
                  border: "1.5px solid var(--border-light)",
                  borderRadius: "var(--radius-xl)",
                  padding: "22px 20px",
                  boxShadow: "var(--shadow-md)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {opt.title}
                </p>
                <p
                  style={{
                    fontSize: "12.5px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {opt.desc}
                </p>
                <a
                  href={opt.href}
                  className="btn-primary"
                  style={{
                    fontSize: "12.5px",
                    padding: "9px 16px",
                    marginTop: "4px",
                    textAlign: "center",
                  }}
                >
                  {opt.label}
                </a>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "var(--brand-light)",
              border: "1.5px solid var(--brand-border)",
              borderRadius: "var(--radius-xl)",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏱️</span>
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--brand-dark)",
                  marginBottom: "2px",
                }}
              >
                Typical response: 1–2 working days
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Small team — we read every message at {SITE.email.general}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-base)",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--radius-xl)",
              padding: "24px 28px",
              marginBottom: "14px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "20px",
              }}
            >
              Common Questions
            </h2>
            {CONTACT_CONTENT.faqs.map((faq, i) => (
              <div
                key={faq.q}
                style={{
                  marginBottom: i < CONTACT_CONTENT.faqs.length - 1 ? "18px" : 0,
                  paddingBottom:
                    i < CONTACT_CONTENT.faqs.length - 1 ? "18px" : 0,
                  borderBottom:
                    i < CONTACT_CONTENT.faqs.length - 1
                      ? "1px solid var(--border-light)"
                      : "none",
                }}
              >
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {faq.q}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#FFFBEB",
              border: "1.5px solid #FDE68A",
              borderRadius: "var(--radius-xl)",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#92400E",
                marginBottom: "4px",
              }}
            >
              Do not email your files
            </p>
            <p
              style={{
                fontSize: "12.5px",
                color: "#78350F",
                lineHeight: 1.6,
              }}
            >
              {CONTACT_CONTENT.fileWarning}
            </p>
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
