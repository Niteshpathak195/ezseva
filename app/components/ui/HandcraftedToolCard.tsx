"use client";

import { Tool, CATEGORY_META } from "../../data/tools";

interface Props {
  tool: Tool;
  delay?: number;
}

export default function HandcraftedToolCard({ tool, delay = 0 }: Props) {
  const meta = CATEGORY_META[tool.cat as keyof typeof CATEGORY_META];

  return (
    <a
      href={tool.href}
      className="ez-hc-card"
      data-cat={tool.cat}
      style={
        {
          animationDelay: `${delay}ms`,
          "--hc-accent": meta?.accent ?? "var(--brand)",
          "--hc-accent-soft": meta?.accentSoft ?? "var(--brand-light)",
          "--hc-grad": meta?.grad ?? "var(--grad-brand)",
        } as React.CSSProperties
      }
      aria-label={`${tool.title} — ${tool.desc}`}
    >
      <div className="ez-hc-card-mesh" aria-hidden="true" />
      <div className="ez-hc-card-shine" aria-hidden="true" />

      {tool.hot && (
        <span className="ez-hc-hot" aria-label="Popular tool">
          🔥 HOT
        </span>
      )}

      <div className="ez-hc-icon-ring">
        <span className="ez-hc-icon">{tool.icon}</span>
      </div>

      <span className="ez-hc-cat">{meta?.label ?? tool.cat}</span>
      <h3 className="ez-hc-title">{tool.title}</h3>
      <p className="ez-hc-desc">{tool.desc}</p>

      <div className="ez-hc-footer">
        <span className="ez-hc-uses">{tool.uses} uses</span>
        <span className="ez-hc-cta">
          Open
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3 7h8M8 4l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}
