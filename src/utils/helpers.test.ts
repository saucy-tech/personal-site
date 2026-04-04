import { formatPostDate } from '@/utils/helpers';

describe('helpers', () => {
  it('formats frontmatter dates without timezone drift', () => {
    expect(formatPostDate('2026-04-03')).toBe('April 3, 2026');
  });

  it('returns the original value for invalid post dates', () => {
    expect(formatPostDate('not-a-date')).toBe('not-a-date');
  });
});
