"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import { ABOUT_CONTENT, SITE } from "../data/site-content";
import { TOOLS, TOOL_COUNT } from "../data/tools";

export default function AboutPage() {
  const stats = [
    { value: String(TOOL_COUNT), label: "Free Tools" },
    { value: "100%", label: "In-browser processing" },
    { value: "0", label: "Signup required" },
    { value: "₹0", label: "Cost to use" },
  ];

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
                {ABOUT_CONTENT.eyebrow}
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
              {ABOUT_CONTENT.title}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              {ABOUT_CONTENT.subtitle}
            </p>
          </div>

          <div
            className="ez-privacy-v2"
            style={{ marginBottom: "24px", textAlign: "center" }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Logo size="icon" />
              </div>
              <h2
                style={{
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: "8px",
                }}
              >
                {ABOUT_CONTENT.heroTitle}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.65,
                  maxWidth: "420px",
                  margin: "0 auto",
                }}
              >
                {ABOUT_CONTENT.heroSub}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--bg-base)",
                  border: "1.5px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 12px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 900,
                    color: "var(--brand)",
                    letterSpacing: "-0.5px",
                    marginBottom: "4px",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
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
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "var(--radius-md)",
                background: "var(--brand-light)",
                border: "1.5px solid var(--brand-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                marginBottom: 14,
              }}
            >
              🎯
            </div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}
            >
              Our Mission
            </h2>
            {ABOUT_CONTENT.mission.map((p, i) => (
              <p
                key={p.slice(0, 30)}
                style={{
                  fontSize: "13.5px",
                  color: "var(--text-muted)",
                  lineHeight: 1.75,
                  marginBottom: i < ABOUT_CONTENT.mission.length - 1 ? "12px" : 0,
                }}
              >
                {p}
              </p>
            ))}
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
              What We Stand For
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {ABOUT_CONTENT.values.map((v, i) => (
                <div
                  key={v.title}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    paddingBottom:
                      i < ABOUT_CONTENT.values.length - 1 ? "18px" : 0,
                    borderBottom:
                      i < ABOUT_CONTENT.values.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background: "var(--brand-light)",
                      border: "1.5px solid var(--brand-mid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {v.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      {v.title}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                      }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
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
                marginBottom: "16px",
              }}
            >
              What We Build ({TOOLS.length} tools)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ABOUT_CONTENT.toolCategories.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "12px 14px",
                    background: "var(--bg-muted)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</span>
                  <div>
                    <p
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {cat.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {cat.desc}
                    </p>
                  </div>
                </div>
              ))}
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
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "var(--radius-md)",
                background: "var(--brand-light)",
                border: "1.5px solid var(--brand-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                marginBottom: 14,
              }}
            >
              👨‍💻
            </div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}
            >
              Who We Are
            </h2>
            {ABOUT_CONTENT.whoWeAre.map((p, i) => (
              <p
                key={p.slice(0, 30)}
                style={{
                  fontSize: "13.5px",
                  color: "var(--text-muted)",
                  lineHeight: 1.75,
                  marginBottom: i < ABOUT_CONTENT.whoWeAre.length - 1 ? "12px" : 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>

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
                fontSize: "15px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Ready to try EzSeva?
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "16px",
              }}
            >
              All tools are free. No account needed.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/"
                className="btn-primary"
                style={{ fontSize: "13px", padding: "10px 24px" }}
              >
                Explore All Tools →
              </a>
              <a
                href="/contact"
                className="btn-secondary"
                style={{ fontSize: "13px", padding: "10px 24px" }}
              >
                Contact Us
              </a>
            </div>
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
