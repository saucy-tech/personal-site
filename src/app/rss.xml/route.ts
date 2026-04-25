import { NextResponse } from 'next/server';

import { SITE_NAME, absoluteUrl } from '@/utils/constants';
import { getAllPostsMeta } from '@/utils/posts';

export const dynamic = 'force-static';

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

export async function GET() {
  const posts = getAllPostsMeta();
  const lastBuildDate = new Date().toUTCString();
  const selfUrl = absoluteUrl('/rss.xml');

  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      const guid = link;
      return `<item>
        <title>${cdata(post.title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${guid}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <category>${cdata(post.categoryLabel)}</category>
        <description>${cdata(post.excerpt ?? '')}</description>
      </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Writing</title>
    <link>${absoluteUrl('/')}</link>
    <description>Articles, reflections, and The Daily Word.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
