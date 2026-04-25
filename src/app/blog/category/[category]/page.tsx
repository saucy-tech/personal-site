import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import { formatPostDate } from '@/utils/helpers';
import { POST_CATEGORIES, type PostCategory } from '@/utils/post-taxonomy';
import { getPostsByCategory } from '@/utils/posts';

const CATEGORY_KEYS = Object.keys(POST_CATEGORIES) as PostCategory[];

export async function generateStaticParams() {
  return CATEGORY_KEYS.map((category) => ({ category }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!CATEGORY_KEYS.includes(category as PostCategory)) {
    return { title: 'Category' };
  }
  const c = category as PostCategory;
  const details = POST_CATEGORIES[c];
  const title = `${details.label} — Archive`;
  return {
    title,
    description: details.description,
    alternates: {
      canonical: `/blog/category/${category}`,
    },
    openGraph: {
      title,
      url: `/blog/category/${category}`,
    },
  };
}

export default async function CategoryArchivePage({ params }: PageProps) {
  const { category } = await params;
  if (!CATEGORY_KEYS.includes(category as PostCategory)) {
    notFound();
  }
  const c = category as PostCategory;
  const details = POST_CATEGORIES[c];
  const posts = getPostsByCategory(c);

  return (
    <PageLayout title={details.label} backHref="/blog" backLabel="Back to Blog">
      <p className="mb-2 text-sm text-[var(--text-secondary)]">{details.description}</p>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        {posts.length} post{posts.length === 1 ? '' : 's'}.
      </p>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="a11y-focus-ring block rounded-2xl border border-[var(--accent-border)] bg-white/[0.03] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)]"
            >
              <span className="text-xs text-[var(--text-secondary)]">
                {formatPostDate(post.date)}
              </span>
              <span className="mt-1 block font-semibold text-[var(--text-primary)]">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
