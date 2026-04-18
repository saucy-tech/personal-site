interface ReportNavItem {
  href: string;
  ordinal: string;
  label: string;
}

interface ReportNavProps {
  items: ReportNavItem[];
}

export default function ReportNav({ items }: ReportNavProps) {
  return (
    <nav aria-label="On this page" className="font-mono text-sm text-[var(--text-secondary)]">
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex items-baseline gap-2 border-b border-transparent transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
            >
              <span className="tabular-nums text-[var(--text-muted)]">{item.ordinal}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
