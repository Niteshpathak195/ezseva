interface WorkflowStep {
  label: string;
  href: string;
}

interface Props {
  steps: WorkflowStep[];
  title?: string;
}

/** Cross-tool workflow links (e.g. Crop → Resize → Joiner) */
export default function ToolWorkflowCTA({
  steps,
  title = "Complete your form workflow",
}: Props) {
  if (steps.length === 0) return null;

  return (
    <div className="ez-workflow-cta">
      <p className="ez-workflow-cta-title">{title}</p>
      <div className="ez-workflow-cta-steps">
        {steps.map((step, i) => (
          <span key={step.href} className="ez-workflow-cta-item">
            {i > 0 && <span className="ez-workflow-cta-arrow" aria-hidden="true">→</span>}
            <a href={step.href}>{step.label}</a>
          </span>
        ))}
      </div>
    </div>
  );
}
