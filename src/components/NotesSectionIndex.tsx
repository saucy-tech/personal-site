'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/helpers';

interface NotesSectionIndexProps {
  sections: { id: string; title: string }[];
}

/**
 * Sticky section index for `/notes`. Renders as a horizontal chip row pinned
 * to the top on narrow screens and as a left rail from `md` up. Highlights the
 * section currently in view (same IntersectionObserver recipe as
 * PostTableOfContents) and keeps the active chip scrolled into view.
 */
export default function NotesSectionIndex({ sections }: NotesSectionIndexProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observedElements = sections
      .map((section) => document.getElementById(section.id))
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
  }, [sections]);

  useEffect(() => {
    if (!activeId) {
      return;
    }
    listRef.current
      ?.querySelector(`a[href="#${activeId}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  return (
    <nav
      aria-label="Sections"
      className="sticky top-0 z-20 -mx-4 border-b border-(--surface-border) bg-(--background) px-4 py-2 sm:-mx-6 sm:px-6 md:top-24 md:mx-0 md:self-start md:border-0 md:bg-transparent md:px-0 md:py-0"
    >
      <ul
        ref={listRef}
        className="no-scrollbar flex gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible"
      >
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={cn(
                'a11y-focus-ring block rounded-full border px-3 py-1 text-xs whitespace-nowrap transition md:rounded-sm md:border-0 md:px-2 md:text-sm',
                activeId === section.id
                  ? 'border-(--accent) bg-(--accent-transparent) text-(--text-primary)'
                  : 'border-(--surface-border) text-(--text-secondary) hover:text-(--text-primary)'
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
