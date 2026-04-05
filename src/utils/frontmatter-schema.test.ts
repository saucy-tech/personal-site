import { frontmatterSchema } from '@/utils/frontmatter-schema';

describe('frontmatterSchema', () => {
  const validFrontmatter = {
    title: 'A valid title',
    date: '2026-04-05',
    excerpt: 'A valid excerpt',
    category: 'Daily Word',
  };

  it('accepts a real calendar date', () => {
    expect(() => frontmatterSchema.parse(validFrontmatter)).not.toThrow();
  });

  it('rejects impossible calendar dates', () => {
    const invalidDates = ['2026-02-31', '2026-13-01', '2026-00-10', '2026-04-00'];

    for (const date of invalidDates) {
      const result = frontmatterSchema.safeParse({ ...validFrontmatter, date });
      expect(result.success).toBe(false);
    }
  });
});
