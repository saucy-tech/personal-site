import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import SubscribeCard from '@/components/SubscribeCard';
import { formatPostDate } from '@/utils/helpers';
import { getAllTagSlugEntries, getPostsByTagSlug } from '@/utils/posts';
import { getBlogListingJsonLd } from '@/utils/structured-data';

export async function generateStaticParams() {
  return getAllTagSlugEntries().map(({ slug }) => ({ tag: slug }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const entries = getAllTagSlugEntries();
  const entry = entries.find((e) => e.slug === tag);
  if (!entry) {
    return { title: 'Tag' };
  }
  const title = `Tag: ${entry.displayTag}`;
  return {
    title,
    description: `Posts tagged “${entry.displayTag}”.`,
    alternates: {
      canonical: `/blog/tag/${tag}`,
    },
    openGraph: {
      title,
      url: `/blog/tag/${tag}`,
    },
  };
}

export default async function TagArchivePage({ params }: PageProps) {
  const { tag } = await params;
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const posts = getPostsByTagSlug(tag);
  if (posts.length === 0) {
    notFound();
  }
  const entries = getAllTagSlugEntries();
  const label = entries.find((e) => e.slug === tag)?.displayTag ?? tag;
  const title = `Tag: ${label}`;
  const description = `Posts tagged “${label}”.`;
  const jsonLd = getBlogListingJsonLd({
    path: `/blog/tag/${tag}`,
    title,
    description,
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
    })),
  });

  return (
    <PageLayout title={title} backHref="/blog" backLabel="Back to Blog">
      <script
        suppressHydrationWarning
        type="application/ld+json"
        {...(nonce ? { nonce } : {})}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        {posts.length} post{posts.length === 1 ? '' : 's'} tagged{' '}
        <span className="font-medium text-[var(--text-primary)]">{label}</span>.
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
      <div className="mt-6">
        <SubscribeCard context="tag-archive" contextLabel={label} contextCount={posts.length} />
      </div>
    </PageLayout>
  );
}
