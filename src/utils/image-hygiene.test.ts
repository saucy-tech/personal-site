import {
  classifyImageSize,
  extractMarkdownImages,
  hasMeaningfulAltText,
} from '@/utils/image-hygiene';

describe('image hygiene utilities', () => {
  it('extracts markdown image definitions', () => {
    const content = `
![Hero image](/images/blog/post-hero.png)
Text
![Chart](https://example.com/chart.png)
`;
    expect(extractMarkdownImages(content)).toEqual([
      { alt: 'Hero image', src: '/images/blog/post-hero.png' },
      { alt: 'Chart', src: 'https://example.com/chart.png' },
    ]);
  });

  it('detects meaningful alt text', () => {
    expect(hasMeaningfulAltText('A chart showing weekly growth')).toBe(true);
    expect(hasMeaningfulAltText('')).toBe(false);
    expect(hasMeaningfulAltText('   ')).toBe(false);
  });

  it('classifies file sizes against warning and error thresholds', () => {
    expect(classifyImageSize(140_000, 250_000, 1_000_000)).toBe('ok');
    expect(classifyImageSize(400_000, 250_000, 1_000_000)).toBe('warn');
    expect(classifyImageSize(1_200_000, 250_000, 1_000_000)).toBe('error');
  });
});
