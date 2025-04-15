import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: "What I&apos;m Currently Into",
  description:
    "A glimpse into what I&apos;m exploring, thinking about, and diving deeper into right now.",
  openGraph: {
    title: "What I&apos;m Currently Into",
    description:
      "A glimpse into what I&apos;m exploring, thinking about, and diving deeper into right now.",
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
    <PageLayout title="What I&apos;m Currently Into">
      <section className="space-y-6">
        <ul className="space-y-6">

          <li className="bg-white/10 p-6 rounded-lg">
            <p className="text-sm text-white/60 mb-2">✍️ March 10, 2024</p>
            <h3 className="text-xl font-semibold mb-2">Creating, Reflecting, Capturing</h3>
            <p>
              I&apos;ve been writing more lately, and it&apos;s a big reason I want this site up and
              running—to have a place to reflect out loud, connect ideas, and share what I&apos;m
              learning.
            </p>
            <p className="mt-2">
              I&apos;ve also started using Obsidian more seriously. Inspired by{' '}
              <a
                href="https://www.youtube.com/watch?v=tDmjz6HB-yw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Sam Altman&apos;s note-taking approach
              </a>
              , I&apos;m building a second brain that helps me revisit thoughts, track questions, and
              generate better ideas.
            </p>
          </li>

          <li className="bg-white/10 p-6 rounded-lg">
            <p className="text-sm text-white/60 mb-2">💰 March 5, 2024</p>
            <h3 className="text-xl font-semibold mb-2">Five Types of Wealth</h3>
            <p>
              I’ve been diving into{' '}
              <a
                href="https://www.amazon.com/Types-Wealth-Transformative-Guide-Design/dp/059372318X"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline font-semibold"
              >
                The Five Types of Wealth
              </a>{' '}
              by Sahil Bloom—time, social, mental, physical, and financial. It’s one of those
              frameworks that instantly clicked.
            </p>
            <br />
            <p>
              Lately I’ve been making more space for consuming great stuff—reading, listening,
              studying—and it’s feeding everything else. As James Clear says, “everything you create
              is downstream from what you consume.”
              <br />
              <br />
              I’ve also been more intentional about leaving room for reflection—journaling, walking,
              sitting in stillness. That’s where my best ideas tend to show up.
              <br />
              <br />
              This all led to creating something of my own—I used Claude to help me &quot;vibe code&quot; the
              quiz, adding more context and style than the original. It was a fun build straight
              from this blend of consuming, reflecting, and then creating.
            </p>
            <a
              href="https://claude.site/artifacts/fd893e83-4526-42f1-afdd-3be118b02a36"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline font-semibold inline-block mt-2"
            >
              → Take the quiz I built
            </a>
          </li>
        </ul>
      </section>
    </PageLayout>
  );
}
