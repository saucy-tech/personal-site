import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('includes individual blog post URLs', () => {
    const entries = sitemap();
    const blogEntries = entries.filter((entry) => entry.url.includes('/blog/'));

    expect(blogEntries.length).toBeGreaterThan(0);
    expect(
      blogEntries.some((entry) => entry.url.endsWith('/blog/2026-04-03-power-for-a-purpose'))
    ).toBe(true);
  });

  it('includes static pages, tag, category, and archive routes', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/links'))).toBe(true);
    expect(urls.some((u) => u.includes('/blog/tag/'))).toBe(true);
    expect(urls.some((u) => u.includes('/blog/category/daily-word'))).toBe(true);
    expect(urls.some((u) => u.includes('/blog/archive/'))).toBe(true);
  });
});
