import {
  getBlogListingJsonLd,
  getPostJsonLd,
  getProfilePageJsonLd,
  getSiteJsonLd,
} from '@/utils/structured-data';
import { SITE_URL, absoluteUrl } from '@/utils/constants';

describe('structured data helpers', () => {
  it('adds SearchAction to the website graph node', () => {
    const jsonLd = getSiteJsonLd({
      authorName: 'Brandon',
      authorImagePath: '/headshot.jpeg',
      sameAs: ['https://x.com/Saucy_Tech'],
    });

    const websiteNode = jsonLd['@graph'].find((node) => node['@type'] === 'WebSite');
    expect(websiteNode).toBeDefined();
    expect(websiteNode?.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: absoluteUrl('/blog?query={search_term_string}'),
      'query-input': 'required name=search_term_string',
    });
  });

  it('builds ProfilePage JSON-LD with a Person mainEntity', () => {
    const jsonLd = getProfilePageJsonLd({
      path: '/portfolio',
      name: 'Brandon Sauceda',
      jobTitle: 'IT Development Manager · Software Engineer',
      description: 'Ten years in Georgia government technology.',
      imagePath: '/headshot.jpeg',
      sameAs: ['https://github.com/saucy-tech'],
      dateModified: '2026-05-21',
    });

    expect(jsonLd['@type']).toBe('ProfilePage');
    expect(jsonLd.url).toBe(absoluteUrl('/portfolio'));
    expect(jsonLd.dateModified).toBe('2026-05-21');
    expect(jsonLd.mainEntity).toEqual({
      '@type': 'Person',
      name: 'Brandon Sauceda',
      url: SITE_URL,
      image: absoluteUrl('/headshot.jpeg'),
      jobTitle: 'IT Development Manager · Software Engineer',
      description: 'Ten years in Georgia government technology.',
      sameAs: ['https://github.com/saucy-tech'],
    });
  });

  it('omits dateModified from ProfilePage JSON-LD when not provided', () => {
    const jsonLd = getProfilePageJsonLd({
      path: '/portfolio',
      name: 'Brandon Sauceda',
      jobTitle: 'Software Engineer',
      description: 'Builder.',
      imagePath: '/headshot.jpeg',
      sameAs: [],
    });

    expect(jsonLd).not.toHaveProperty('dateModified');
  });

  it('includes breadcrumb list for blog posts', () => {
    const jsonLd = getPostJsonLd({
      slug: '2026-04-24-death-hath-no-more-dominion',
      title: 'Death Hath No More Dominion',
      excerpt: 'A short reflection about resurrection hope and confidence in Christ.',
      date: '2026-04-24',
      category: 'daily-word',
      tags: ['faith', 'hope'],
      imageUrl:
        'https://www.brandonssite.com/blog/2026-04-24-death-hath-no-more-dominion/opengraph-image',
      authorName: 'Brandon',
    });

    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.breadcrumb).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: absoluteUrl('/blog'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Death Hath No More Dominion',
          item: absoluteUrl('/blog/2026-04-24-death-hath-no-more-dominion'),
        },
      ],
    });
  });

  it('builds listing JSON-LD for archive pages', () => {
    const jsonLd = getBlogListingJsonLd({
      path: '/blog/tag/faith',
      title: 'Tag: Faith',
      description: 'Posts tagged "Faith".',
      posts: [
        {
          slug: '2026-04-24-death-hath-no-more-dominion',
          title: 'Death Hath No More Dominion',
          excerpt: 'A short reflection about resurrection hope and confidence in Christ.',
          date: '2026-04-24',
        },
      ],
    });

    expect(jsonLd['@type']).toBe('CollectionPage');
    expect(jsonLd.url).toBe(absoluteUrl('/blog/tag/faith'));
    expect(jsonLd.mainEntity).toEqual({
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: 1,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: absoluteUrl('/blog/2026-04-24-death-hath-no-more-dominion'),
          item: {
            '@type': 'BlogPosting',
            headline: 'Death Hath No More Dominion',
            description: 'A short reflection about resurrection hope and confidence in Christ.',
            datePublished: '2026-04-24',
            url: absoluteUrl('/blog/2026-04-24-death-hath-no-more-dominion'),
          },
        },
      ],
    });
    expect(jsonLd.breadcrumb).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: absoluteUrl('/blog'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Tag: Faith',
          item: absoluteUrl('/blog/tag/faith'),
        },
      ],
    });
  });
});
