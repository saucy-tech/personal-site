#!/usr/bin/env ts-node
/*
 Script: auto-broadcast.ts
 Description: After each deploy, call ConvertKit v4 API and create a DRAFT broadcast with
              the latest blog post intro + link. Run manually or from CI.

 Env vars required (never exposed client-side):
   CK_SECRET_KEY   – your ConvertKit secret API key (v4)
   CK_PUBLISHER_ID – numeric publisher id (account settings)
   NEXT_PUBLIC_APP_URL – site base URL (already present)
*/
import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

async function main() {
  const secret = process.env.CK_SECRET_KEY;
  const publisher = process.env.CK_PUBLISHER_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !publisher || !baseUrl) {
    throw new Error('CK_SECRET_KEY, CK_PUBLISHER_ID, or NEXT_PUBLIC_APP_URL missing');
  }

  // find latest post file by date (file name already includes date or use front-matter)
  const postsDir = path.join(__dirname, '../src/posts');
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({
      name: f,
      mtime: fs.statSync(path.join(postsDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.mtime - a.mtime);

  const latestFile = files[0]?.name;
  if (!latestFile) throw new Error('No posts found');

  const raw = fs.readFileSync(path.join(postsDir, latestFile), 'utf-8');
  const { data, content } = matter(raw);
  const slug = latestFile.replace(/\.mdx$/, '');
  const link = `${baseUrl}/blog/${slug}`;
  const intro = content.split('\n').slice(0, 4).join('\n');

  const body = {
    broadcast: {
      subject: data.title || slug,
      content: `${intro}\n\nRead the full post → ${link}`,
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

  console.log('Draft broadcast created successfully. Review and send from ConvertKit UI.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
