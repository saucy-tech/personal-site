export const SITE_NAME = 'Saucy.Tech';
export const LEGAL_ENTITY = 'Saucy Tech LLC';
export const SITE_DESCRIPTION = 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin';
export const SITE_DESCRIPTION_HIRING =
  'Brandon Sauceda, independent software engineer. He builds and runs The Morning Portion, Train Every Day, The Home Hive, and Health Dashboard, and takes on a few client projects a year.';

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
