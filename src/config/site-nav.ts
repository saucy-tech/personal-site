export type NavMatch = 'exact' | 'prefix';

export type SiteNavItem = {
  href: string;
  label: string;
  match: NavMatch;
};

/** Shown in the footer after primary nav items (RSS, utility links). */
export const FOOTER_EXTRA_NAV: SiteNavItem[] = [
  { href: '/bitcoin', label: 'Bitcoin', match: 'exact' },
  { href: '/links', label: 'Links', match: 'exact' },
  { href: '/rss.xml', label: 'RSS', match: 'exact' },
];

export function isNavActive(pathname: string, item: SiteNavItem, allItems: SiteNavItem[]): boolean {
  if (item.match === 'exact') {
    return pathname === item.href;
  }
  const hasExactForPath = allItems.some((i) => i.match === 'exact' && i.href === pathname);
  if (hasExactForPath) {
    return false;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getSiteNavItems(): SiteNavItem[] {
  const items: SiteNavItem[] = [{ href: '/blog', label: 'Writing', match: 'prefix' }];
  items.push(
    { href: '/portfolio', label: 'Projects', match: 'exact' },
    { href: '/about', label: 'About', match: 'exact' },
    { href: '/about#work-with-me', label: 'Work with me', match: 'exact' },
    { href: '/field-notes', label: 'Field notes', match: 'exact' },
    { href: 'https://morningportion.com', label: 'Morning Portion', match: 'exact' },
    { href: '/support', label: 'Support', match: 'exact' }
  );
  return items;
}

export function getFooterNavItems(): SiteNavItem[] {
  return [...getSiteNavItems(), ...FOOTER_EXTRA_NAV];
}
