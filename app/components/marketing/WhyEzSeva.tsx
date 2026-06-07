import { WHY_EZSEVA } from "../../data/site-content";

export default function WhyEzSeva() {
  return (
    <div className="ez-why-grid">
      {WHY_EZSEVA.map((r, i) => (
        <article
          key={r.title}
          className="ez-why-card"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="ez-why-icon">{r.icon}</div>
          <h3 className="ez-why-title">{r.title}</h3>
          <p className="ez-why-desc">{r.desc}</p>
        </article>
      ))}
    </div>
  );
}
