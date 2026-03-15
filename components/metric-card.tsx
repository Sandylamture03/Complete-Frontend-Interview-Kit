type MetricCardProps = {
  label: string;
  value: number | string;
  tone?: "default" | "warm" | "accent";
  hint?: string;
};

export function MetricCard({ label, value, tone = "default", hint }: MetricCardProps) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  );
}
