#!/usr/bin/env ts-node
/*
 Script: auto-broadcast.ts
 Description: Create a DRAFT ConvertKit broadcast for the latest dated blog post.
              This is a manual fallback; the GitHub Action workflow remains the
              primary production path for devotion broadcasts.

 Env vars required (never exposed client-side):
   CK_SECRET_KEY   – your ConvertKit secret API key (v4)
   CK_PUBLISHER_ID – numeric publisher id (account settings)
   NEXT_PUBLIC_APP_URL – site base URL
*/
import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

interface BroadcastPost {
  content: string;
  date: string;
  excerpt: string;
  slug: string;
  title: string;
}

const SITE_TIME_ZONE = 'America/New_York';

// Configure gray-matter to use js-yaml 4.x's load function.
// @ts-expect-error - gray-matter's types don't include engines, but it exists at runtime
matter.engines.yaml = {
  parse: (str: string) => yaml.load(str) as Record<string, unknown>,
  stringify: (obj: Record<string, unknown>) => yaml.dump(obj),
};

function getSummary(content: string) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !block.startsWith('>'))
    .filter((block) => !block.startsWith('#'))
    .filter((block) => !block.startsWith('!['))
    .map((block) =>
      block
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/[*_`>#-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean);

  return paragraphs.slice(0, 2).join(' ');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTodayDateString(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const getPart = (type: 'year' | 'month' | 'day') => {
    const value = parts.find((part) => part.type === type)?.value;
    if (!value) {
      throw new Error(`Unable to format current ${type} for ${SITE_TIME_ZONE}`);
    }
    return value;
  };

  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
}

function isPublishedDate(date: string): boolean {
  return !date || date <= getTodayDateString();
}

export function loadLatestPost(postsDir: string): BroadcastPost {
  const posts = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const { data, content } = matter(raw);
      const title = typeof data.title === 'string' ? data.title.trim() : slug;
      const excerpt = typeof data.excerpt === 'string' ? data.excerpt.trim() : '';
      const date = typeof data.date === 'string' ? data.date.trim() : '';

      return {
        content,
        date,
        excerpt,
        slug,
        title,
      };
    })
    .filter((post) => post.date)
    .filter((post) => isPublishedDate(post.date));

  if (posts.length === 0) {
    throw new Error('No published dated posts found in src/posts');
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
  return posts[0]!;
}

async function main() {
  const secret = process.env.CK_SECRET_KEY;
  const publisher = process.env.CK_PUBLISHER_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !publisher || !baseUrl) {
    throw new Error(
      'Missing required env vars: CK_SECRET_KEY, CK_PUBLISHER_ID, and NEXT_PUBLIC_APP_URL must all be set'
    );
  }

  const postsDir = path.join(__dirname, '../src/posts');
  const latestPost = loadLatestPost(postsDir);
  const { title, excerpt, content, slug, date } = latestPost;
  const link = `${baseUrl}/blog/${slug}`;
  const summary = getSummary(content);
  const bannerUrl = `${baseUrl.replace(/\/$/, '')}/images/daily-word-banner.png`;
  const htmlContent = [
    '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 0 16px;">',
    `  <p style="margin: 0 0 24px 0;"><a href="${escapeHtml(link)}" style="display: block; text-decoration: none;"><img src="${escapeHtml(bannerUrl)}" width="600" alt="The Daily Word" style="display: block; width: 100%; max-width: 600px; height: auto; margin: 0 auto; border: 0;" /></a></p>`,
    `  <p style="font-size: 13px; color: #888888; letter-spacing: 0.05em; text-transform: uppercase; margin: 0 0 24px 0;">${escapeHtml(date)}</p>`,
    `  <p style="font-size: 16px; line-height: 1.7; color: #3a3a3a; margin: 0 0 16px 0;">${escapeHtml(excerpt)}</p>`,
    `  <p style="font-size: 16px; line-height: 1.7; color: #3a3a3a; margin: 0 0 28px 0;">${escapeHtml(summary)}</p>`,
    `  <p style="margin: 0 0 24px 0;"><a href="${escapeHtml(link)}" style="background: #c9a84c; color: #ffffff; padding: 12px 24px; font-family: sans-serif; display: inline-block; text-decoration: none;">Continue reading &rarr;</a></p>`,
    '  <p style="font-size: 12px; line-height: 1.6; color: #888888; text-align: center; margin: 0;">You&#39;re receiving this because you subscribed to The Daily Word &middot; saucy.tech</p>',
    '</div>',
  ].join('');

  const body = {
    broadcast: {
      subject: title,
      content: htmlContent,
      confirmation_email: false,
    },
  };

  const res = await fetch(
    `https://api.convertkit.com/v4/publishers/${publisher}/broadcasts?api_secret=${secret}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error(`ConvertKit error ${res.status}: ${await res.text()}`);
  }

  console.log(`Draft broadcast created for ${slug}. Review and send from ConvertKit UI.`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
