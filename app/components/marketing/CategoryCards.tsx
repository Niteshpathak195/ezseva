import { TOOLS, type Category } from "../../data/tools";

const CATEGORIES: {
  cat: Category;
  title: string;
  desc: string;
  icon: string;
  accent: string;
  bg: string;
  href: string;
}[] = [
  {
    cat: "Image",
    title: "Image Tools",
    desc: "Resize, crop, merge photo & signature for govt exams",
    icon: "🖼️",
    accent: "linear-gradient(135deg, #22D3EE, #00C4B4)",
    bg: "#E8FFFC",
    href: "/#tools?cat=Image",
  },
  {
    cat: "PDF",
    title: "PDF Tools",
    desc: "Compress, merge, split and password-protect PDFs",
    icon: "📄",
    accent: "linear-gradient(135deg, #6366F1, #2582A1)",
    bg: "#EEF2FF",
    href: "/#tools?cat=PDF",
  },
  {
    cat: "Practice",
    title: "Typing Test",
    desc: "Hindi & English speed test for CPCT, SSC, Railway",
    icon: "⌨️",
    accent: "linear-gradient(135deg, #10B981, #059669)",
    bg: "#ECFDF5",
    href: "/typing-test",
  },
];

export default function CategoryCards() {
  return (
    <div className="ez-cat-grid">
      {CATEGORIES.map((c) => {
        const count = TOOLS.filter((t) => t.cat === c.cat).length;
        return (
          <a
            key={c.cat}
            href={c.href}
            className="ez-cat-card"
            style={
              {
                "--cat-accent": c.accent,
                "--cat-bg": c.bg,
              } as Record<string, string>
            }
          >
            <div className="ez-cat-icon" style={{ background: c.bg }}>
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
