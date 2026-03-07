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
