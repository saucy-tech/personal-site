import Link from 'next/link';
import type { ReactNode } from 'react';

import TradeoffList from '@/components/editorial/TradeoffList';

interface RankedItemProps {
  /** Sub-index within a chapter, e.g. "01" */
  index: string;
  title: string;
  href?: string;
  tags?: string[];
  children?: ReactNode;
  pros?: string[];
  cons?: string[];
  external?: boolean;
}

export default function RankedItem({
  index,
  title,
  href,
  tags = [],
  children,
  pros,
  cons,
  external,
}: RankedItemProps) {
  const titleEl =
    href && external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-(--text-primary) underline decoration-white/20 underline-offset-4 transition hover:decoration-(--accent)"
      >
        {title}
      </a>
    ) : href ? (
      <Link
        href={href}
        className="text-(--text-primary) underline decoration-white/20 underline-offset-4 transition hover:decoration-(--accent)"
      >
        {title}
      </Link>
    ) : (
      <span className="text-(--text-primary)">{title}</span>
    );

  return (
    <article className="border-b border-white/6 pb-8 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="font-mono text-sm tabular-nums text-(--text-muted)">{index}</span>
        <h3 className="text-base font-semibold text-(--text-primary) sm:text-lg">{titleEl}</h3>
      </div>
      {tags.length > 0 && (
        <p className="mt-2 font-mono text-xs leading-relaxed text-(--text-muted)">
          {tags.join(' · ')}
        </p>
      )}
      {children && (
        <div className="mt-3 text-sm leading-relaxed text-(--text-secondary)">{children}</div>
      )}
      <TradeoffList pros={pros} cons={cons} />
    </article>
  );
}
