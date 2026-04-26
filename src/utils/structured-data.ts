import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/utils/constants';

interface SiteJsonLdInput {
  authorName: string;
  authorImagePath: string;
  sameAs: string[];
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
          target: absoluteUrl('/blog?query={search_term_string}'),
          'query-input': 'required name=search_term_string',
        },
      },
    ],
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
