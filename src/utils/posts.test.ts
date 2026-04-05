import { getAllPostsMeta, getPostBySlug, getPostOgMeta } from '@/utils/posts';
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

    expect(metadata).not.toBeNull();
    expect(metadata?.openGraph?.images).toEqual([
      {
        url: `https://saucy.tech/blog/${posts[0]!.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: posts[0]!.title,
      },
    ]);
    expect(metadata?.twitter?.images).toEqual([
      `https://saucy.tech/blog/${posts[0]!.slug}/opengraph-image`,
    ]);
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
});
