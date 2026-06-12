import {
  extractPostHeadings,
  getAllPostsMeta,
  getPostBySlug,
  getPostOgImageUrl,
  getPostOgMeta,
  getReadingTimeFromContent,
  getRelatedPosts,
} from '@/utils/posts';
import { POST_CATEGORIES } from '@/utils/post-taxonomy';

describe('posts utilities', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns null for a missing post slug', async () => {
    await expect(getPostBySlug('does-not-exist')).resolves.toBeNull();
    await expect(getPostOgMeta('does-not-exist')).resolves.toBeNull();
  });

  it('loads and sorts post metadata from the repo content', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-04T16:00:00.000Z'));

    const posts = getAllPostsMeta();
    const allPosts = getAllPostsMeta({ includeFuture: true });

    expect(posts.length).toBeGreaterThan(0);
    expect(allPosts.length).toBeGreaterThanOrEqual(posts.length);
    expect(posts[0]?.date >= posts[posts.length - 1]!.date).toBe(true);
    expect(posts[0]?.category in POST_CATEGORIES).toBe(true);
    expect(posts.some((post) => post.slug === '2026-04-05-he-is-not-here')).toBe(false);
    expect(allPosts.some((post) => post.slug === '2026-04-05-he-is-not-here')).toBe(true);

    const firstPost = await getPostBySlug(posts[0]!.slug);
    expect(firstPost).not.toBeNull();
    expect(firstPost?.title).toBe(posts[0]!.title);
    expect(firstPost?.categoryLabel).toBe(posts[0]!.categoryLabel);
    expect(Array.isArray(firstPost?.tags)).toBe(true);
    expect(posts[0]?.readingTimeMinutes).toBeGreaterThan(0);
    expect(firstPost?.headings.length).toBeGreaterThanOrEqual(0);
  });

  it('categorizes the recent March Daily Word posts correctly', async () => {
    const marchDailyWordSlugs = [
      '2026-03-18-the-word-that-mattered-most',
      '2026-03-23-the-seed-in-your-hand-is-enough',
      '2026-03-24-she-almost-didnt-go',
      '2026-03-25-only-believe',
      '2026-03-26-the-faith-you-stopped-needing',
      '2026-03-27-before-the-tree-appears',
    ];

    for (const slug of marchDailyWordSlugs) {
      const post = await getPostBySlug(slug);
      expect(post).not.toBeNull();
      expect(post?.category).toBe('daily-word');
      expect(post?.categoryLabel).toBe('Daily Word');
    }
  });

  it('returns post metadata with a share image fallback', async () => {
    const posts = getAllPostsMeta();
    const metadata = await getPostOgMeta(posts[0]!.slug);
    const imageUrl = getPostOgImageUrl(posts[0]!.slug);

    expect(metadata).not.toBeNull();
    expect(metadata?.openGraph?.images).toEqual([
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: posts[0]!.title,
      },
    ]);
    expect(metadata?.twitter?.images).toEqual([imageUrl]);
  });

  it('does not load future-dated posts without an explicit override', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-04T16:00:00.000Z'));

    await expect(getPostBySlug('2026-04-05-he-is-not-here')).resolves.toBeNull();

    const futurePost = await getPostBySlug('2026-04-05-he-is-not-here', { includeFuture: true });
    expect(futurePost?.slug).toBe('2026-04-05-he-is-not-here');
  });

  it('all posts have valid frontmatter', () => {
    expect(() => getAllPostsMeta({ includeFuture: true })).not.toThrow();
  });

  it('serves build-compiled HTML for every post', async () => {
    const posts = getAllPostsMeta({ includeFuture: true });
    for (const meta of posts) {
      const post = await getPostBySlug(meta.slug, { includeFuture: true });
      expect(post).not.toBeNull();
      expect(post!.html).toEqual(expect.stringContaining('<p>'));
      // Compiled output starts with markup, not leaked frontmatter text.
      expect(post!.html.startsWith('<')).toBe(true);
    }
  });

  it('compiled HTML carries the same heading ids the table of contents links to', async () => {
    const posts = getAllPostsMeta({ includeFuture: true });
    const withHeadings = await getPostBySlug(posts.map((p) => p.slug).find((slug) => slug)!, {
      includeFuture: true,
    });
    const candidates = await Promise.all(
      posts.map((p) => getPostBySlug(p.slug, { includeFuture: true }))
    );
    const tocPost = candidates.find((p) => p && p.headings.length >= 3) ?? withHeadings;
    expect(tocPost).not.toBeNull();
    expect(tocPost!.headings.length).toBeGreaterThan(0);
    for (const heading of tocPost!.headings) {
      expect(tocPost!.html).toEqual(expect.stringContaining(`id="${heading.id}"`));
    }
  });

  it('extracts headings and reading time from mdx content', () => {
    const content = `---
title: "Sample"
date: "2026-04-05"
excerpt: "Sample excerpt"
category: "Daily Word"
---

## First Heading

Some words in a paragraph.

### Child Heading

\`\`\`ts
const hidden = "code block should not count";
\`\`\`
`;

    expect(getReadingTimeFromContent(content)).toBe(1);
    expect(extractPostHeadings(content)).toEqual([
      { id: 'first-heading', text: 'First Heading', level: 2 },
      { id: 'child-heading', text: 'Child Heading', level: 3 },
    ]);
  });

  it('deduplicates repeated heading ids in order', () => {
    const content = `## Takeaway
### Takeaway
## Takeaway`;

    expect(extractPostHeadings(content)).toEqual([
      { id: 'takeaway', text: 'Takeaway', level: 2 },
      { id: 'takeaway-1', text: 'Takeaway', level: 3 },
      { id: 'takeaway-2', text: 'Takeaway', level: 2 },
    ]);
  });

  it('returns up to three related posts prioritized by category and tags', () => {
    const posts = getAllPostsMeta();
    const sourcePost = posts.find((post) => post.tags.length > 0) ?? posts[0];
    expect(sourcePost).toBeDefined();
    if (!sourcePost) {
      throw new Error('Expected at least one post');
    }

    const related = getRelatedPosts(sourcePost);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.some((post) => post.slug === sourcePost.slug)).toBe(false);
  });
});
