import { SITE_NAME } from './constants';
import { DEFAULT_OG_IMAGE, siteOpenGraph } from './open-graph';

describe('siteOpenGraph', () => {
  it('keeps the site-wide fields when a page only sets a url', () => {
    expect(siteOpenGraph({ url: '/blog' })).toEqual({
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      images: [DEFAULT_OG_IMAGE],
      url: '/blog',
    });
  });

  it('declares the default card as a 1200x630 PNG', () => {
    expect(DEFAULT_OG_IMAGE).toMatchObject({
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      type: 'image/png',
    });
  });

  it('lets a page override the type and image', () => {
    const images = [{ url: '/custom.png', width: 1200, height: 630 }];
    expect(siteOpenGraph({ type: 'profile', images })).toMatchObject({
      type: 'profile',
      images,
      siteName: SITE_NAME,
    });
  });
});
