import { HOW_IT_WORKS } from "../../data/site-content";

export default function HowItWorks() {
  return (
    <div className="ez-steps-grid">
      {HOW_IT_WORKS.map((s) => (
        <article key={s.num} className="ez-step-card">
          <div className="ez-step-num">{s.num}</div>
          <h3 className="ez-step-title">{s.title}</h3>
          <p className="ez-step-desc">{s.desc}</p>
        </article>
      ))}
    </div>
  );
}
