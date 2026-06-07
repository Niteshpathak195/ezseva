"use client";

export default function HeroMockup() {
  return (
    <div className="ez-hero-mock" aria-hidden>
      <span className="ez-mock-float-chip">🔒 100% private</span>
      <div className="ez-mock-card ez-animate-float">
        <div className="ez-mock-header">
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15 }}>
              EzSeva Tools
            </p>
            <p style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Browser-only · Zero upload</p>
          </div>
          <span className="ez-mock-badge">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
            Live
          </span>
        </div>
        <div className="ez-mock-body">
          {/* Slide 1 — Image Resize */}
          <div className="ez-mock-slide">
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              🖼️ Image Resize · SSC CGL
            </p>
            <div className="ez-mock-stat-row">
              <div className="ez-mock-stat">
                <b>200×230</b>
                <span>Target size</span>
              </div>
              <div className="ez-mock-stat">
                <b>18 KB</b>
                <span>Under 20 KB ✓</span>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                height: 8,
                borderRadius: 4,
                background: "var(--brand-light)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "92%",
                  height: "100%",
                  background: "var(--grad-brand)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Slide 2 — Photo Joiner */}
          <div className="ez-mock-slide">
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              🪪 Photo + Signature
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: 64,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, var(--brand-light), var(--brand-mid))",
                  border: "1px dashed var(--brand-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                📷
              </div>
              <div
                style={{
                  height: 64,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)",
                  border: "1px dashed #C7D2FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                ✍️
              </div>
            </div>
            <div className="ez-mock-stat">
              <b>Ready for upload</b>
              <span>Merged JPEG · govt form</span>
            </div>
          </div>

          {/* Slide 3 — PDF Compress */}
          <div className="ez-mock-slide">
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              🗜️ PDF Compress
            </p>
            <div className="ez-mock-stat-row">
              <div className="ez-mock-stat">
                <b>4.2 MB</b>
                <span>Before</span>
              </div>
              <div className="ez-mock-stat">
                <b>890 KB</b>
                <span>After · 79% saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
