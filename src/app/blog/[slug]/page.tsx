import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import ShareButtons from '@/components/ShareButtons';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import {
  getAllPostsMeta,
  getPostBySlug,
  getPostOgImageUrl,
  getPostOgMeta,
  seriesSlug,
} from '@/utils/posts';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

function getReadingTime(content: string) {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
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
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const readingTime = getReadingTime(post.content);
  const relatedPosts = getAllPostsMeta()
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) => candidate.category === post.category)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: getPostOgImageUrl(post.slug),
    author: {
      '@type': 'Person',
      name: 'Brandon',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: post.category,
    keywords: post.tags,
  };

  return (
    <PageLayout title={post.title} backHref="/blog" backLabel="Back to Blog">
      <script
        suppressHydrationWarning
        type="application/ld+json"
        {...(nonce ? { nonce } : {})}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl space-y-10">
        <section className="overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[radial-gradient(circle_at_top_right,rgb(var(--accent-rgb)/0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              {post.categoryLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
              {formatPostDate(post.date)}
            </span>
            <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
              {readingTime} min read
            </span>
            {post.series && (
              <Link
                href={`/blog/series/${seriesSlug(post.series)}`}
                className="a11y-focus-ring rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
              >
                {post.series}
              </Link>
            )}
          </div>

          {post.excerpt && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        <article className="prose prose-invert prose-p:text-[1.05rem] prose-p:leading-8 prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-[var(--text-primary)] prose-h2:mt-12 prose-h2:border-t prose-h2:border-white/10 prose-h2:pt-8 prose-h2:text-2xl prose-h3:mt-10 prose-h3:text-xl prose-a:text-[var(--accent)] prose-a:no-underline prose-a:decoration-[0.1em] prose-a:underline-offset-[0.2em] hover:prose-a:text-[var(--text-primary)] prose-a:focus-visible:rounded-sm prose-a:focus-visible:outline-none prose-a:focus-visible:ring-2 prose-a:focus-visible:ring-[var(--focus-ring)] prose-a:focus-visible:ring-offset-2 prose-a:focus-visible:ring-offset-[var(--background)] prose-strong:text-[var(--text-primary)] prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:bg-white/[0.04] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-[var(--text-primary)] prose-hr:border-white/10 prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-[0_18px_40px_rgba(0,0,0,0.25)] prose-figcaption:text-sm prose-figcaption:text-[var(--text-secondary)] max-w-none">
          <MDXRemote source={post.content} />
        </article>

        <ShareButtons
          title={post.title}
          url={`${SITE_URL}/blog/${post.slug}`}
          excerpt={post.excerpt}
        />

        {relatedPosts.length > 0 && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">
                  Recent Posts
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  Latest in {post.categoryLabel}
                </h2>
              </div>
              <Link
                href="/blog"
                className="a11y-focus-ring rounded-sm text-sm font-medium text-[var(--accent)] transition hover:text-[var(--text-primary)]"
              >
                Browse all posts
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="a11y-focus-ring group rounded-3xl border border-[var(--accent-border)] bg-black/10 p-5 transition hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)]"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                    {formatPostDate(relatedPost.date)}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Section title="Subscribe to The Daily Word" emoji="✉️">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Enjoyed this? Get The Daily Word in your inbox every weekday morning. Free, always.
          </p>
          <SubscribeForm />
        </Section>
      </div>
    </PageLayout>
  );
}
