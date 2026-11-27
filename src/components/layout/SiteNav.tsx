'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type SiteNavItem, isNavActive } from '@/config/site-nav';
import { cn } from '@/utils/helpers';

// min-h-10 + px-2.5 gives every link a 40px-tall tap target without changing the text size.
const linkClass =
  'a11y-focus-ring inline-flex min-h-10 items-center rounded-sm px-2.5 py-2 text-(--text-secondary) transition-colors hover:bg-[var(--surface-hover,color-mix(in_srgb,var(--foreground)_6%,transparent))] hover:text-(--text-primary)';

const activeClass =
  'bg-(--accent-transparent) font-medium text-(--accent) hover:bg-(--accent-transparent) hover:text-(--accent)';

type SiteNavProps = {
  items: SiteNavItem[];
  className?: string;
  listClassName?: string;
  /** Landmark label for header vs footer navigation. */
  ariaLabel?: string;
};

export default function SiteNav({
  items,
  className,
  listClassName,
  ariaLabel = 'Site sections',
}: SiteNavProps) {
  const pathname = usePathname() ?? '';

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul
        className={cn(
          'flex flex-wrap justify-center gap-x-1 gap-y-1 text-sm list-none m-0 p-0',
          listClassName
        )}
      >
        {items.map((item) => {
          const active = isNavActive(pathname, item, items);
          const isExternal = /^https?:\/\//.test(item.href);
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className={cn(linkClass, active && activeClass)}
                aria-current={active ? 'page' : undefined}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
