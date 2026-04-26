/**
 * @jest-environment node
 */

import { generateMetadata as generateTagMetadata } from '@/app/blog/tag/[tag]/page';
import { generateMetadata as generateCategoryMetadata } from '@/app/blog/category/[category]/page';

describe('blog metadata contracts', () => {
  it('returns canonical and open graph URL for a valid tag archive', async () => {
    const metadata = await generateTagMetadata({
      params: Promise.resolve({ tag: 'faith' }),
    });

    expect(metadata.alternates?.canonical).toBe('/blog/tag/faith');
    expect(metadata.openGraph?.url).toBe('/blog/tag/faith');
    expect(metadata.title).toBe('Tag: Faith');
  });

  it('returns canonical and open graph URL for a valid category archive', async () => {
    const metadata = await generateCategoryMetadata({
      params: Promise.resolve({ category: 'daily-word' }),
    });

    expect(metadata.alternates?.canonical).toBe('/blog/category/daily-word');
    expect(metadata.openGraph?.url).toBe('/blog/category/daily-word');
    expect(metadata.title).toBe('Daily Word — Archive');
  });
});
