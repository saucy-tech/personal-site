import { MDXRemote } from 'next-mdx-remote/rsc';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getPostBySlug, getPostOgMeta } from '@/utils/posts';

// Temporarily disable static generation due to Next.js 15 + MDX issue
// export async function generateStaticParams() {
//   const slugs = getPostSlugs();
//   return slugs.map((slug) => ({ slug }));
// }

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getPostOgMeta(slug);
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <PageLayout title={post.title} backHref="/blog" backLabel="Back to Blog">
      <article className="prose prose-invert max-w-none">
        <p className="text-sm text-gray-500 mb-8">{formatDate(new Date(post.date))}</p>
        <MDXRemote source={post.content} />
      </article>
      <Section title="Enjoying the writing?" emoji="✉️">
        <SubscribeForm />
      </Section>
    </PageLayout>
  );
}
