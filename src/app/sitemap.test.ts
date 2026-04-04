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
});
