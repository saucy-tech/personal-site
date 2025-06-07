import { MDXRemote } from 'next-mdx-remote/rsc';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getPostBySlug, getPostSlugs, getPostOgMeta } from '@/utils/posts';

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return getPostOgMeta(params.slug);
}

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

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
