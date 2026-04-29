interface ReportHeaderProps {
  title: string;
  /** e.g. "April 2026" */
  periodLabel: string;
  kicker?: string;
}

export default function ReportHeader({ title, periodLabel, kicker }: ReportHeaderProps) {
  return (
    <header className="space-y-3">
      {kicker && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-(--text-muted)">{kicker}</p>
      )}
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-(--text-primary) sm:text-3xl">
        {title} <span className="font-normal text-(--text-secondary)">— {periodLabel}</span>
      </h1>
    </header>
  );
}
