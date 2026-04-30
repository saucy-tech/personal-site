import { MetadataRoute } from 'next';

import { absoluteUrl } from '@/utils/constants';
import { POST_CATEGORIES, type PostCategory } from '@/utils/post-taxonomy';
import {
  getAllPostsMeta,
  getAllSeries,
  getAllTagSlugEntries,
  getAllYearMonthArchiveParams,
} from '@/utils/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMeta().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const seriesPages = getAllSeries().map((series) => ({
    url: absoluteUrl(`/blog/series/${series.slug}`),
    lastModified: series.posts[series.posts.length - 1]?.date ?? new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tagPages = getAllTagSlugEntries().map(({ slug }) => ({
    url: absoluteUrl(`/blog/tag/${slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.55,
  }));

  const categoryPages = (Object.keys(POST_CATEGORIES) as PostCategory[]).map((category) => ({
    url: absoluteUrl(`/blog/category/${category}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.55,
  }));

  const archivePages = getAllYearMonthArchiveParams().map(({ year, month }) => ({
    url: absoluteUrl(`/blog/archive/${year}/${month}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.45,
  }));

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/support'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/daily-word'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/field-notes'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    },
    {
      url: absoluteUrl('/links'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/projects'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: absoluteUrl('/bitcoin'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: absoluteUrl('/rss.xml'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/blog/series'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...seriesPages,
    ...tagPages,
    ...categoryPages,
    ...archivePages,
    ...posts,
  ];
}
