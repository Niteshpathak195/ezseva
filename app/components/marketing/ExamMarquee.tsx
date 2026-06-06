"use client";

const EXAMS = [
  "SSC CGL", "Railway RRB", "VYAPAM", "UPSC", "IBPS PO", "MP Police",
  "CPCT", "SSC CHSL", "State PSC", "NTPC", "Delhi Police", "BPSC",
] as const;

export default function ExamMarquee() {
  const items = [...EXAMS, ...EXAMS];

  return (
    <section aria-label="Supported exams" className="ez-marquee-wrap">
      <div className="ez-marquee-track">
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="ez-marquee-item">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
