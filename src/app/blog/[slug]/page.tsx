import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getPostBySlug, getPostOgMeta, getPostSlugs } from '@/utils/posts';

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

      <Section title="Enjoying the writing?" emoji="✉️">
        <SubscribeForm />
      </Section>
    </PageLayout>
  );
}
