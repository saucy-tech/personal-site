import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getAllPostsMeta, getPostBySlug, getPostOgMeta, getPostSlugs } from '@/utils/posts';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const metadata = await getPostOgMeta(slug);
  if (!metadata) {
    notFound();
  }

  return metadata;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = getAllPostsMeta()
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) =>
      post.series ? candidate.series === post.series : candidate.category === post.category
    )
    .slice(0, 3);

  return (
    <PageLayout title={post.title} backHref="/blog" backLabel="Back to Blog">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {post.categoryLabel}
        </span>
        <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
          {formatDate(new Date(post.date))}
        </span>
        {post.series && (
          <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
            {post.series}
          </span>
        )}
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {post.excerpt && (
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
          {post.excerpt}
        </p>
      )}

      <article className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} />
      </article>

      {relatedPosts.length > 0 && (
        <Section
          title={post.series ? `More in ${post.series}` : `More ${post.categoryLabel}`}
          emoji="↗️"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-[var(--accent-border)] bg-white/[0.03] p-5 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                  {relatedPost.categoryLabel}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-tight text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                  {relatedPost.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {formatDate(new Date(relatedPost.date))}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {relatedPost.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section title="Enjoying the writing?" emoji="✉️">
        <SubscribeForm />
      </Section>
    </PageLayout>
  );
}
