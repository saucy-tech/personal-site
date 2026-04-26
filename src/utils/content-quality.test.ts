import { evaluatePostContentQuality } from '@/utils/content-quality';

describe('evaluatePostContentQuality', () => {
  it('returns no issues for well-formed quality inputs', () => {
    const result = evaluatePostContentQuality({
      title: 'When Faith Feels Small but Still Moves You Forward',
      excerpt:
        'A practical reflection on trusting God in small steps, staying present in uncertainty, and choosing obedience before outcomes are visible.',
      tags: ['Faith', 'Trust', 'Obedience'],
    });

    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns on title and excerpt bounds violations', () => {
    const result = evaluatePostContentQuality({
      title: 'Too short',
      excerpt: 'Short excerpt.',
      tags: ['Faith'],
    });

    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('title length'),
        expect.stringContaining('excerpt length'),
      ])
    );
  });

  it('warns for missing tags and duplicate tags', () => {
    const noTags = evaluatePostContentQuality({
      title: 'A Valid Title Length for Post Metadata Checks',
      excerpt:
        'This excerpt is long enough to pass strict metadata quality checks while keeping the validator deterministic and easy to maintain.',
      tags: [],
    });
    expect(noTags.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('missing tags')])
    );

    const duplicateTags = evaluatePostContentQuality({
      title: 'Another Valid Metadata Title for Content Quality Validation',
      excerpt:
        'This excerpt also meets expected quality length while allowing duplicate tag detection to surface maintainability issues in content metadata.',
      tags: ['Faith', 'faith', 'Trust'],
    });
    expect(duplicateTags.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('duplicate tags')])
    );
  });
});
