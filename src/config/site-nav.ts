export type NavMatch = 'exact' | 'prefix';

export type SiteNavItem = {
  href: string;
  label: string;
  match: NavMatch;
};

/** Secondary destinations, kept out of the primary header. */
export const FOOTER_EXTRA_NAV: SiteNavItem[] = [
  { href: '/bitcoin', label: 'Bitcoin', match: 'exact' },
  { href: '/links', label: 'Links', match: 'exact' },
  { href: '/about#work-with-me', label: 'Client work', match: 'exact' },
  { href: '/support', label: 'Support', match: 'exact' },
  { href: '/privacy', label: 'Privacy', match: 'exact' },
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
  return [
    { href: '/portfolio', label: 'Portfolio', match: 'exact' },
    { href: '/about', label: 'About', match: 'exact' },
    { href: '/notes', label: 'Notes', match: 'exact' },
  ];
}

export function getFooterNavItems(): SiteNavItem[] {
  return [...getSiteNavItems(), ...FOOTER_EXTRA_NAV];
}
