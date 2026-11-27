'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/helpers';

interface NotesSectionIndexProps {
  sections: { id: string; title: string }[];
  /**
   * `rail` (default, `/notes`): horizontal chip row on narrow screens, left
   * rail from `md` up. `bar` (`/portfolio`): horizontal chip row at every width.
   */
  layout?: 'rail' | 'bar';
}

/**
 * Sticky section index. Renders as a horizontal chip row pinned to the top and,
 * in the `rail` layout, as a left rail from `md` up. Highlights the section
 * currently in view (same IntersectionObserver recipe as PostTableOfContents),
 * keeps the active or focused chip scrolled into view, and fades the right edge
 * while more chips sit off-screen.
 */
export default function NotesSectionIndex({ sections, layout = 'rail' }: NotesSectionIndexProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const isRail = layout === 'rail';

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

  // The fade only shows while chips overflow to the right, so the last chip is
  // never dimmed once the row is scrolled to its end.
  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const update = () => {
      setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    };

    update();
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      list.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sections]);

  return (
    <nav
      aria-label="Sections"
      className={cn(
        'sticky top-0 z-20 -mx-4 border-b border-(--surface-border) bg-(--background) px-4 py-2 sm:-mx-6 sm:px-6',
        isRail
          ? 'md:top-24 md:mx-0 md:self-start md:border-0 md:bg-transparent md:px-0 md:py-0'
          : 'md:mx-0 md:px-0'
      )}
    >
      <ul
        ref={listRef}
        className={cn(
          // scroll-pe keeps chips revealed by scrollIntoView clear of the fade.
          'no-scrollbar flex scroll-pe-10 gap-2 overflow-x-auto',
          canScrollRight &&
            (isRail
              ? 'max-md:[mask-image:linear-gradient(to_left,transparent,#000_2.5rem)]'
              : '[mask-image:linear-gradient(to_left,transparent,#000_2.5rem)]'),
          isRail && 'md:flex-col md:gap-1 md:overflow-visible'
        )}
      >
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              onFocus={(event) => {
                event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              }}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={cn(
                'a11y-focus-ring focus-visible:ring-inset focus-visible:ring-offset-0 block rounded-full border px-3 py-1 text-xs whitespace-nowrap transition',
                isRail && 'md:rounded-sm md:border-0 md:px-2 md:text-sm md:whitespace-normal',
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
