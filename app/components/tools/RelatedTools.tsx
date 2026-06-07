"use client";

import { getRelatedTools, CATEGORY_META } from "../../data/tools";
import type { Tool } from "../../data/tools";

interface Props {
  excludeHref: string;
  limit?: number;
}

function RelatedCard({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.cat as keyof typeof CATEGORY_META];

  return (
    <a
      href={tool.href}
      className="ez-related-card"
      style={
        {
          "--hc-accent": meta?.accent ?? "var(--brand)",
          "--hc-accent-soft": meta?.accentSoft ?? "var(--brand-light)",
        } as React.CSSProperties
      }
    >
      <div className="ez-related-icon">{tool.icon}</div>
      <div className="ez-related-body">
        <div className="ez-related-title">{tool.title}</div>
        <div className="ez-related-desc">{tool.desc}</div>
      </div>
      <span className="ez-related-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}

export default function RelatedTools({ excludeHref, limit = 4 }: Props) {
  const tools = getRelatedTools(excludeHref, limit);
  if (tools.length === 0) return null;

  return (
    <section className="ez-related-section" aria-label="Related tools">
      <div className="ez-related-head">
        <h2>More free tools</h2>
        <p>Explore other EzSeva tools — same privacy, zero signup.</p>
      </div>
      <div className="ez-related-grid">
        {tools.map((tool) => (
          <RelatedCard key={tool.href} tool={tool} />
        ))}
      </div>
    </section>
  );
}
