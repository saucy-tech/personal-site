import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/utils/constants';

interface SiteJsonLdInput {
  authorName: string;
  authorImagePath: string;
  sameAs: string[];
}

interface ProfilePageJsonLdInput {
  path: string;
  name: string;
  jobTitle: string;
  description: string;
  imagePath: string;
  sameAs: string[];
  dateModified?: string;
}

interface PostJsonLdInput {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
  authorName: string;
}

interface ListingPostInput {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

interface BlogListingJsonLdInput {
  path: `/blog${string}`;
  title: string;
  description: string;
  posts: ListingPostInput[];
}

type JsonLdGraphNode = {
  '@type': string;
  [key: string]: unknown;
};

export function getSiteJsonLd(input: SiteJsonLdInput): {
  '@context': string;
  '@graph': JsonLdGraphNode[];
} {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: input.authorName,
        url: SITE_URL,
        image: absoluteUrl(input.authorImagePath),
        sameAs: input.sameAs,
      },
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/blog?query={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function getProfilePageJsonLd(input: ProfilePageJsonLdInput): Record<string, unknown> {
  const pageUrl = absoluteUrl(input.path);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: pageUrl,
    name: input.name,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    mainEntity: {
      '@type': 'Person',
      name: input.name,
      url: SITE_URL,
      image: absoluteUrl(input.imagePath),
      jobTitle: input.jobTitle,
      description: input.description,
      sameAs: input.sameAs,
    },
  };
}

export function getPostJsonLd(input: PostJsonLdInput): Record<string, unknown> {
  const postUrl = absoluteUrl(`/blog/${input.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.excerpt,
    datePublished: input.date,
    dateModified: input.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    image: input.imageUrl,
    author: {
      '@type': 'Person',
      name: input.authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.ico'),
      },
    },
    articleSection: input.category,
    keywords: input.tags,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: input.title, item: postUrl },
      ],
    },
  };
}

export function getBlogListingJsonLd(input: BlogListingJsonLdInput): Record<string, unknown> {
  const listingUrl = absoluteUrl(input.path);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.title,
    description: input.description,
    url: listingUrl,
    isPartOf: {
      '@type': 'Blog',
      name: SITE_NAME,
      url: absoluteUrl('/blog'),
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: input.posts.length,
      itemListElement: input.posts.map((post, index) => {
        const postUrl = absoluteUrl(`/blog/${post.slug}`);

        return {
          '@type': 'ListItem',
          position: index + 1,
          url: postUrl,
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            url: postUrl,
          },
        };
      }),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: input.title, item: listingUrl },
      ],
    },
  };
}
