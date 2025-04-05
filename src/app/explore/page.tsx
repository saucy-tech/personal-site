import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: "What I'm Currently Into",
  description: "Explore what I'm currently reading, listening to, and discovering.",
  openGraph: {
    title: "What I'm Currently Into",
    description: "Explore what I'm currently reading, listening to, and discovering.",
    url: `${SITE_URL}/explore`,
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Explore`,
      },
    ],
  },
};

export default function Explore() {
  return (
    <PageLayout title="What I'm Currently Into">
      <section>
        <h2 className="text-2xl font-semibold mb-4">📚 Currently Reading</h2>
        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-xl font-medium">The Price of Tomorrow</h3>
          <p className="text-gray-300 mt-2">by Jeff Booth</p>
          <p className="mt-4">
            A thought-provoking exploration of how technology and deflation will shape our future,
            and why Bitcoin might be the key to navigating the coming economic transformation.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🎧 Currently Listening</h2>
        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-xl font-medium">Knowledge Project with Adam Grant</h3>
          <p className="mt-4">
            Exploring the intersection of psychology and business, with insights on motivation,
            productivity, and meaningful work.
          </p>
          <a
            href="https://fs.blog/knowledge-project-podcast/adam-grant/"
            className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen to the episode →
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
