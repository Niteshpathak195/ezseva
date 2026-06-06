const STEPS = [
  {
    num: "01",
    title: "Pick a tool",
    desc: "Choose from 9 free tools — image, PDF, or typing. No signup needed.",
  },
  {
    num: "02",
    title: "Upload & process",
    desc: "Everything runs in your browser. Your files never touch our servers.",
  },
  {
    num: "03",
    title: "Download instantly",
    desc: "Get exam-ready output in seconds — SSC size, compressed PDF, and more.",
  },
] as const;

export default function HowItWorks() {
  return (
    <div className="ez-steps-grid">
      {STEPS.map((s) => (
        <article key={s.num} className="ez-step-card">
          <div className="ez-step-num">{s.num}</div>
          <h3 className="ez-step-title">{s.title}</h3>
          <p className="ez-step-desc">{s.desc}</p>
        </article>
      ))}
    </div>
  );
}
