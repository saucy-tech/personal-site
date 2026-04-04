import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import { Post, PostMeta, toPostMeta } from '@/utils/post-taxonomy';
import { SITE_URL } from '@/utils/constants';

// Configure gray-matter to use js-yaml 4.x's load function
// @ts-expect-error - gray-matter's types don't include engines, but it exists at runtime
matter.engines.yaml = {
  parse: (str: string) => yaml.load(str) as Record<string, unknown>,
  stringify: (obj: Record<string, unknown>) => yaml.dump(obj),
};

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts');

function ensurePostsDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}
function getPostPath(slug: string): string {
  return path.join(POSTS_DIR, `${slug}.mdx`);
}

export function getPostSlugs(): string[] {
  ensurePostsDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const fileContent = fs.readFileSync(getPostPath(slug), 'utf-8');
      const { data } = matter(fileContent);
      return toPostMeta(slug, data);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

// Note: We will send raw MDX to the page and compile there with next-mdx-remote/rsc
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postPath = getPostPath(slug);
  if (!fs.existsSync(postPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(postPath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    ...toPostMeta(slug, data),
    content,
  };
}

export async function getPostOgMeta(slug: string): Promise<Metadata | null> {
  const post = await getPostBySlug(slug);
  if (!post) {
    return null;
  }

  const { title, excerpt } = post;
  const imageUrl = `${SITE_URL}/family-photo.jpeg`;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: [imageUrl],
    },
  };
}
