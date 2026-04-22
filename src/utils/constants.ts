export const SITE_NAME = 'Saucy.Tech';
export const SITE_DESCRIPTION = 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin';

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!configuredUrl) {
    return 'https://saucy.tech';
  }
  return normalizeSiteUrl(configuredUrl);
}

export const SITE_URL = getSiteUrl();

export function absoluteUrl(pathname = '/'): string {
  return new URL(pathname, `${SITE_URL}/`).toString();
}
