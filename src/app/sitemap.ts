import { MetadataRoute } from 'next';

import { absoluteUrl } from '@/utils/constants';
import { getAllPostsMeta, getAllSeries } from '@/utils/posts';

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
    ...posts,
  ];
}
