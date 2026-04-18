import type { ReactNode } from 'react';

interface ReportSectionProps {
  /** Two-digit chapter label, e.g. "01" */
  ordinal: string;
  id: string;
  title: string;
  children: ReactNode;
}

export default function ReportSection({ ordinal, id, title, children }: ReportSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/[0.08] pt-10 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-sm tabular-nums tracking-tight text-[var(--text-muted)]">
          {ordinal}
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-section">{children}</div>
    </section>
  );
}
