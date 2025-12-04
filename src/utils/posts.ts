import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

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

export interface PostMeta {
  slug: string;
  title: string;
  cardTitle?: string; // Added optional cardTitle
  date: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
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
      const fileContent = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf-8');
      const { data } = matter(fileContent);
      return {
        slug,
        title: data.title ?? slug,
        cardTitle: data.shortTitle || data.cardTitle, // Prefer 'shortTitle' if present
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
      } as PostMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Note: We will send raw MDX to the page and compile there with next-mdx-remote/rsc
export async function getPostBySlug(slug: string): Promise<Post> {
  const fileContent = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title ?? slug,
    cardTitle: data.cardTitle, // Extract cardTitle for consistency
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    content,
  };
}

export async function getPostOgMeta(slug: string): Promise<{
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
}> {
  const { title, excerpt } = await getPostBySlug(slug);
  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
    },
  };
}
