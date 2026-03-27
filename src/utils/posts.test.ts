import { getAllPostsMeta, getPostBySlug, getPostOgMeta } from '@/utils/posts';
import { POST_CATEGORIES } from '@/utils/post-taxonomy';

describe('posts utilities', () => {
  it('returns null for a missing post slug', async () => {
    await expect(getPostBySlug('does-not-exist')).resolves.toBeNull();
    await expect(getPostOgMeta('does-not-exist')).resolves.toBeNull();
  });

  it('loads and sorts post metadata from the repo content', async () => {
    const posts = getAllPostsMeta();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]?.date >= posts[posts.length - 1]!.date).toBe(true);
    expect(posts[0]?.category in POST_CATEGORIES).toBe(true);

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
});
