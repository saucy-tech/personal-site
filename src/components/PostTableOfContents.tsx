'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils/helpers';
import type { PostHeading } from '@/utils/post-taxonomy';

interface PostTableOfContentsProps {
  headings: PostHeading[];
}

export default function PostTableOfContents({ headings }: PostTableOfContentsProps) {
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId, setActiveId] = useState<string | null>(headingIds[0] ?? null);

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    const observedElements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (observedElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0]!.target.id);
        }
      },
      {
        rootMargin: '-20% 0% -65% 0%',
        threshold: [0, 1],
      }
    );

    for (const element of observedElements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [headingIds]);

  if (headings.length === 0) {
    return null;
  }

  const resolvedActiveId = activeId ?? headingIds[0] ?? null;

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 xl:sticky xl:top-24">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">On this page</p>
      <nav aria-label="Table of contents">
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li key={`${heading.id}-${index}`}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  'a11y-focus-ring block rounded px-2 py-1 text-sm transition',
                  heading.level === 3 && 'pl-5',
                  resolvedActiveId === heading.id
                    ? 'bg-[var(--accent-transparent)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="a11y-focus-ring text-sm font-medium text-[var(--accent)] transition hover:text-[var(--text-primary)]"
      >
        Back to top
      </button>
    </div>
  );
}
