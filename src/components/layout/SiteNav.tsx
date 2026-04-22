'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type SiteNavItem, isNavActive } from '@/config/site-nav';
import { cn } from '@/utils/helpers';

const linkClass =
  'text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] rounded-sm';

const activeClass = 'text-[var(--accent)] font-medium';

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
          'flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm list-none m-0 p-0',
          listClassName
        )}
      >
        {items.map((item) => {
          const active = isNavActive(pathname, item, items);
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className={cn(linkClass, active && activeClass)}
                aria-current={active ? 'page' : undefined}
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
