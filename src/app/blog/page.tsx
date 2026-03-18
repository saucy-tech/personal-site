import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SubscribeForm from '@/components/SubscribeForm';
import { formatDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';

export const metadata = {
  title: 'Blog',
  description: 'Writing and thoughts',
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();

  return (
    <PageLayout title="Blog" backHref="/" backLabel="Back to Home">
      <Section title="Posts" emoji="📝">
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xl text-[var(--accent)] hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-400 mt-1">{formatDate(new Date(post.date))}</p>
              {post.excerpt && <p className="text-sm text-gray-300 mt-2">{post.excerpt}</p>}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="The Daily Word" emoji="✉️">
        <p className="text-sm text-gray-400 mb-4">
          Faith, ideas, and whatever&apos;s on my mind — Monday through Friday, with the occasional weekend thought. Free.
        </p>
        <SubscribeForm />
      </Section>
    </PageLayout>
  );
}
