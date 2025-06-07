import { NextResponse } from 'next/server';

import { SITE_URL } from '@/utils/constants';
import { getAllPostsMeta } from '@/utils/posts';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPostsMeta();

  const items = posts
    .map((post) => {
      return `<item>
        <title>${post.title}</title>
        <link>${SITE_URL}/blog/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt ?? ''}]]></description>
      </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Brandon's Blog</title>
      <link>${SITE_URL}</link>
      <description>Thoughts and writings</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
