'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

// The address is kept in pieces and only joined in the browser, so it never
// appears in the server HTML or the RSC payload where scrapers harvest it.
// Do not pass the address in as a prop or put it in a data file: both end up
// in the page source.
const USER = 'brandon';
const HOST = ['saucy', 'tech'];

const subscribe = () => () => {};

interface EmailLinkProps {
  className?: string;
  /** Link text. Defaults to the address itself once the page has loaded. */
  children?: ReactNode;
  /** Shown in place of the address until the browser fills it in. */
  fallback?: string;
  subject?: string;
}

export default function EmailLink({
  className,
  children,
  fallback = 'my email address',
  subject,
}: EmailLinkProps) {
  const inBrowser = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!inBrowser) {
    return <a className={className}>{children ?? fallback}</a>;
  }

  const address = `${USER}@${HOST.join('.')}`;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';

  return (
    <a href={`mailto:${address}${query}`} className={className}>
      {children ?? address}
    </a>
  );
}
