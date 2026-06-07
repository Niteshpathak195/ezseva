import { kbPassFail } from "../../lib/image-utils";

interface Props {
  sizeKB: number;
  maxKB: number;
  className?: string;
}

/** Portal-ready pass/fail indicator for exam file size limits */
export default function KBStatusBadge({ sizeKB, maxKB, className = "" }: Props) {
  const status = kbPassFail(sizeKB, maxKB);
  if (status === "none") return null;

  const pass = status === "pass";

  return (
    <span
      className={`ez-kb-badge ${pass ? "ez-kb-badge--pass" : "ez-kb-badge--fail"} ${className}`}
      role="status"
    >
      {pass ? "✓ Portal ready" : "✗ Over limit"} — {sizeKB.toFixed(1)} KB / max {maxKB} KB
    </span>
  );
}
