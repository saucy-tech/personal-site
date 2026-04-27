import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import PageLayout from '@/components/PageLayout';
import PostTableOfContents from '@/components/PostTableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import Section from '@/components/Section';
import ShareButtons from '@/components/ShareButtons';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import { slugifyTag } from '@/utils/post-taxonomy';
import {
  getAllPostsMeta,
  getPostBySlug,
  getPostOgImageUrl,
  getPostOgMeta,
  getRelatedPosts,
  getSeriesChronoNeighbors,
  seriesSlug,
} from '@/utils/posts';
import { absoluteUrl } from '@/utils/constants';
import { getPostJsonLd } from '@/utils/structured-data';

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
  const relatedPosts = getRelatedPosts(post, 3);
  const seriesNeighbors = getSeriesChronoNeighbors(post);
  const showTableOfContents = post.headings.length >= 3;

  const jsonLd = getPostJsonLd({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    tags: post.tags,
    imageUrl: getPostOgImageUrl(post.slug),
    authorName: 'Brandon',
  });

  return (
    <PageLayout title={post.title} backHref="/blog" backLabel="Back to Blog">
      <ReadingProgress />
      <script
        suppressHydrationWarning
        type="application/ld+json"
        {...(nonce ? { nonce } : {})}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div id="post-top" className="space-y-10">
          <section className="overflow-hidden rounded-[2rem] border border-[var(--accent-border)] bg-[radial-gradient(circle_at_top_right,rgb(var(--accent-rgb)/0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/blog/category/${post.category}`}
                className="a11y-focus-ring rounded-full border border-[var(--accent-border)] bg-[var(--accent-transparent)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--accent)] transition hover:brightness-110"
              >
                {post.categoryLabel}
              </Link>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                {formatPostDate(post.date)}
              </span>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                {post.readingTimeMinutes} min read
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
                  <Link
                    key={tag}
                    href={`/blog/tag/${slugifyTag(tag)}`}
                    className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {(seriesNeighbors.previous || seriesNeighbors.next) && (
            <section
              aria-label="Series navigation"
              className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-transparent)] px-4 py-3 text-sm"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                In this series
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                {seriesNeighbors.previous && (
                  <Link
                    href={`/blog/${seriesNeighbors.previous.slug}`}
                    className="a11y-focus-ring font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                  >
                    ← {seriesNeighbors.previous.title}
                  </Link>
                )}
                {seriesNeighbors.next && (
                  <Link
                    href={`/blog/${seriesNeighbors.next.slug}`}
                    className="a11y-focus-ring font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                  >
                    {seriesNeighbors.next.title} →
                  </Link>
                )}
              </div>
            </section>
          )}

          {showTableOfContents && (
            <div className="xl:hidden">
              <PostTableOfContents headings={post.headings} />
            </div>
          )}

          <article className="prose prose-invert prose-p:text-[1.05rem] prose-p:leading-8 prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-[var(--text-primary)] prose-h2:mt-12 prose-h2:border-t prose-h2:border-white/10 prose-h2:pt-8 prose-h2:text-2xl prose-h3:mt-10 prose-h3:text-xl prose-a:text-[var(--accent)] prose-a:no-underline prose-a:decoration-[0.1em] prose-a:underline-offset-[0.2em] hover:prose-a:text-[var(--text-primary)] prose-a:focus-visible:rounded-sm prose-a:focus-visible:outline-none prose-a:focus-visible:ring-2 prose-a:focus-visible:ring-[var(--focus-ring)] prose-a:focus-visible:ring-offset-2 prose-a:focus-visible:ring-offset-[var(--background)] prose-headings:[&_a]:no-underline prose-headings:[&_a]:text-[var(--accent)] hover:prose-headings:[&_a]:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:bg-white/[0.04] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-[var(--text-primary)] prose-hr:border-white/10 prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-[0_18px_40px_rgba(0,0,0,0.25)] prose-figcaption:text-sm prose-figcaption:text-[var(--text-secondary)] max-w-none">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
                },
              }}
            />
          </article>

          <ShareButtons
            title={post.title}
            url={absoluteUrl(`/blog/${post.slug}`)}
            excerpt={post.excerpt}
          />

          {relatedPosts.length > 0 && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">
                    Related Posts
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                    Keep reading
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

        {showTableOfContents && (
          <aside className="hidden xl:block">
            <PostTableOfContents headings={post.headings} />
          </aside>
        )}
      </div>
    </PageLayout>
  );
}
