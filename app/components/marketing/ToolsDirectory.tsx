"use client";

import {
  TOOLS,
  FILTER_TABS,
  CATEGORY_META,
  type Category,
  type Tool,
} from "../../data/tools";

interface Props {
  search: string;
  activeFilter: Category;
  onSearchChange: (value: string) => void;
  onFilterChange: (tab: Category) => void;
  onClear: () => void;
}

const GROUP_ORDER: Exclude<Category, "All">[] = ["Image", "PDF", "Practice"];

function filterTools(search: string, activeFilter: Category): Tool[] {
  return TOOLS.filter((t) => {
    const catOk = activeFilter === "All" || t.cat === activeFilter;
    const q = search.toLowerCase().trim();
    const searchOk =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.cat.toLowerCase().includes(q);
    return catOk && searchOk;
  });
}

function FeaturedCard({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.cat as keyof typeof CATEGORY_META];
  return (
    <a
      href={tool.href}
      className="ez-td-featured"
      style={
        {
          "--td-accent": meta?.accent,
          "--td-accent-soft": meta?.accentSoft,
          "--td-grad": meta?.grad,
        } as React.CSSProperties
      }
    >
      <div className="ez-td-featured-top">
        <span className="ez-td-featured-icon">{tool.icon}</span>
        <span className="ez-td-featured-badge">Popular</span>
      </div>
      <h3 className="ez-td-featured-title">{tool.title}</h3>
      <p className="ez-td-featured-desc">{tool.desc}</p>
      <div className="ez-td-featured-foot">
        <span>{tool.uses} uses</span>
        <span className="ez-td-arrow">→</span>
      </div>
    </a>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  const meta = CATEGORY_META[tool.cat as keyof typeof CATEGORY_META];
  return (
    <a
      href={tool.href}
      className="ez-td-row"
      style={
        {
          "--td-accent": meta?.accent,
          "--td-accent-soft": meta?.accentSoft,
        } as React.CSSProperties
      }
    >
      <span className="ez-td-row-icon">{tool.icon}</span>
      <div className="ez-td-row-body">
        <div className="ez-td-row-title-row">
          <h3 className="ez-td-row-title">{tool.title}</h3>
          {tool.hot && <span className="ez-td-row-hot">Popular</span>}
        </div>
        <p className="ez-td-row-desc">{tool.desc}</p>
      </div>
      <div className="ez-td-row-meta">
        <span className="ez-td-row-uses">{tool.uses}</span>
        <span className="ez-td-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </a>
  );
}

function CategoryGroup({
  cat,
  tools,
}: {
  cat: Exclude<Category, "All">;
  tools: Tool[];
}) {
  if (tools.length === 0) return null;
  const meta = CATEGORY_META[cat];
  return (
    <div className="ez-td-group">
      <div className="ez-td-group-head">
        <span
          className="ez-td-group-dot"
          style={{ background: meta?.accent }}
        />
        <h2 className="ez-td-group-title">{meta?.label ?? cat}</h2>
        <span className="ez-td-group-count">{tools.length}</span>
      </div>
      <div className="ez-td-row-list">
        {tools.map((tool) => (
          <ToolRow key={tool.href} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default function ToolsDirectory({
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onClear,
}: Props) {
  const filtered = filterTools(search, activeFilter);
  const showGrouped =
    activeFilter === "All" && !search.trim();
  const featured = TOOLS.filter((t) => t.hot);

  return (
    <section id="tools" aria-label="All tools" className="ez-td-section">
      <div className="container">
        <div className="ez-td-head">
          <div>
            <h2 className="ez-td-title">All free tools</h2>
            <p className="ez-td-sub">
              Browse by category or search — {TOOLS.length} tools, zero signup.
            </p>
          </div>
        </div>

        <div className="ez-td-toolbar">
          <div className="ez-td-search-wrap">
            <svg
              className="ez-td-search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="6.5" cy="6.5" r="5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              type="search"
              className="ez-td-search"
              placeholder="Search tools…"
              value={search}
              aria-label="Search tools"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="ez-td-search-clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="ez-td-toolbar-row">
            <div className="ez-td-filters" role="tablist" aria-label="Filter tools">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === tab}
                  onClick={() => onFilterChange(tab)}
                  className={`ez-td-filter${activeFilter === tab ? " is-active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="ez-td-count" aria-live="polite">
              {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ez-empty">
            <div style={{ fontSize: 44 }}>🔍</div>
            <p>No tools found{search ? ` for “${search}”` : ""}</p>
            <button type="button" className="ez-empty-clear" onClick={onClear}>
              Clear filters
            </button>
          </div>
        ) : showGrouped ? (
          <>
            <div className="ez-td-featured-grid">
              {featured.map((tool) => (
                <FeaturedCard key={tool.href} tool={tool} />
              ))}
            </div>
            {GROUP_ORDER.map((cat) => (
              <CategoryGroup
                key={cat}
                cat={cat}
                tools={TOOLS.filter(
                  (t) => t.cat === cat && !t.hot
                )}
              />
            ))}
          </>
        ) : (
          <div className="ez-td-row-list ez-td-row-list--flat">
            {filtered.map((tool) => (
              <ToolRow key={tool.href} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
