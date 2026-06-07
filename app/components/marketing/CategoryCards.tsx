import { TOOLS, CATEGORY_META, type Category } from "../../data/tools";

const CATEGORIES: {
  cat: Category;
  title: string;
  desc: string;
  icon: string;
  href: string;
}[] = [
  {
    cat: "Image",
    title: "Image Tools",
    desc: "Resize, crop, merge photo & signature for govt exams",
    icon: "🖼️",
    href: "/#tools?cat=Image",
  },
  {
    cat: "PDF",
    title: "PDF Tools",
    desc: "Compress, merge, split and password-protect PDFs",
    icon: "📄",
    href: "/#tools?cat=PDF",
  },
  {
    cat: "Practice",
    title: "Typing Test",
    desc: "Hindi & English speed test for CPCT, SSC, Railway",
    icon: "⌨️",
    href: "/typing-test",
  },
];

export default function CategoryCards() {
  return (
    <div className="ez-cat-grid">
      {CATEGORIES.map((c) => {
        const count = TOOLS.filter((t) => t.cat === c.cat).length;
        const meta = CATEGORY_META[c.cat as keyof typeof CATEGORY_META];
        return (
          <a
            key={c.cat}
            href={c.href}
            className="ez-cat-card"
            style={
              {
                "--cat-accent": meta?.grad ?? "var(--grad-brand)",
                "--cat-bg": meta?.accentSoft ?? "var(--brand-light)",
              } as Record<string, string>
            }
          >
            <div className="ez-cat-icon" style={{ background: meta?.accentSoft }}>
              {c.icon}
            </div>
            <h3 className="ez-cat-title">{c.title}</h3>
            <p className="ez-cat-desc">{c.desc}</p>
            <span className="ez-cat-count">{count} tool{count !== 1 ? "s" : ""} →</span>
          </a>
        );
      })}
    </div>
  );
}
