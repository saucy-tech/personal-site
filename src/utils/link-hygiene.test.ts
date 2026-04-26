import {
  extractMarkdownLinkTargets,
  isExternalOrAnchorLink,
  normalizeLinkTarget,
  validateRelativeLinkUsage,
} from '@/utils/link-hygiene';

describe('link hygiene utils', () => {
  it('extracts markdown links and image targets', () => {
    const content = `
[Read this](/blog/2026-04-24-death-hath-no-more-dominion)
![hero](/images/blog/example.png)
[External](https://example.com)
`;
    const targets = extractMarkdownLinkTargets(content).map((item) => item.target);
    expect(targets).toEqual([
      '/blog/2026-04-24-death-hath-no-more-dominion',
      '/images/blog/example.png',
      'https://example.com',
    ]);
  });

  it('normalizes hash and query from target', () => {
    expect(normalizeLinkTarget('/blog/post-a?ref=home#section')).toBe('/blog/post-a');
  });

  it('detects external and anchor links', () => {
    expect(isExternalOrAnchorLink('https://example.com')).toBe(true);
    expect(isExternalOrAnchorLink('#top')).toBe(true);
    expect(isExternalOrAnchorLink('/blog/post-a')).toBe(false);
  });

  it('warns on relative links', () => {
    expect(validateRelativeLinkUsage('./other-post')).toEqual(
      expect.objectContaining({
        level: 'warning',
      })
    );
    expect(validateRelativeLinkUsage('/blog/post-a')).toBeNull();
  });
});
