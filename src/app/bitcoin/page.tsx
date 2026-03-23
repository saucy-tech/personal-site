import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Bitcoin Resources',
  description: 'Explore the ideas and resources that shaped my understanding of Bitcoin.',
  openGraph: {
    title: 'Learn About Bitcoin',
    description: 'Explore the ideas and resources that shaped my understanding of Bitcoin.',
    url: `${SITE_URL}/bitcoin`,
    type: 'website',
    images: [
      {
        url: '/bitcoin-journey.png',
        width: 1024,
        height: 1536,
        alt: `${SITE_NAME} - Bitcoin`,
      },
    ],
  },
};

export default function Bitcoin() {
  return (
    <PageLayout title="Why Bitcoin Matters to Me">
      {/* VISUAL HOOK */}
      <section>
        <Image
          src="/bitcoin-journey.png"
          alt="Bitcoin vs. Gold – A Visual Journey"
          width={500}
          height={300}
          className="rounded-lg shadow-lg w-full max-w-md mx-auto mb-6 px-4"
        />
      </section>

      {/* PERSONAL STORY */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🧠 Why This Matters to Me</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            As a Christian, I value truth, integrity, and caring for others. Over time, I realized
            the way our money works often undermines those values—rewarding debt, punishing savers,
            and quietly transferring wealth.
          </p>
          <p>
            Bitcoin opened my eyes. It&apos;s transparent, incorruptible, and rooted in honesty. It
            aligns with values of stewardship, fairness, and long-term thinking.
          </p>
          <p>
            I&apos;m still learning, but I believe this matters—not just financially, but
            spiritually and socially. If you&apos;re curious, here&apos;s where to start.
          </p>
        </div>
      </section>

      <section>
        <div className="bg-[var(--accent-transparent)] border border-[var(--accent-border)] p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">🧰 Tools, Links, and Rabbit Holes</h2>
          <p className="text-[var(--text-secondary)]">
            If you already get the basic idea and want the dashboards, calculators, and articles I
            actually send people, I keep those on a separate page so this one can stay focused.
          </p>
          <Link
            href="/links"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
          >
            Open my Bitcoin links page
          </Link>
        </div>
      </section>

      {/* START HERE SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">🚀 Start Here</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-6">
          <div className="text-center mb-6">
            <p className="text-lg mb-4">
              New to Bitcoin? You&apos;re not alone. Start with this documentary.
            </p>
            <div className="max-w-2xl mx-auto">
              <a
                href="https://www.youtube.com/watch?v=oksraL7wN6Q"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Watch &quot;God Bless Bitcoin&quot; →
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-semibold mb-4">Want to go deeper?</h3>
            <p className="mb-4">After watching the documentary, I recommend these resources:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>📚 Read:</strong>{' '}
                <a
                  href="https://river.com/learn/bitcoin-in-just-21-minutes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Bitcoin in 21 Minutes – River
                </a>{' '}
                – A concise guide covering the essentials of Bitcoin in just 21 minutes.
              </li>
              <li>
                <strong>📚 Read:</strong>{' '}
                <a
                  href="https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  The Bitcoin Standard
                </a>{' '}
                – The most comprehensive book on Bitcoin&apos;s role in monetary history.
              </li>
              <li>
                <strong>🎥 Watch:</strong>{' '}
                <a
                  href="https://www.youtube.com/watch?v=4rvTppy1qLI&list=PL2jAZ0x9H0bQFY6wIbQfnrnIlqMcSHd6X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  What is Money? – Michael Saylor Series
                </a>{' '}
                – A deep dive into the nature of money, time, and energy.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* GROWING RESOURCE LIST */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📚 Growing Resource List</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-6">
          <p className="text-md mb-2">
            A curated list of resources that have shaped my understanding of Bitcoin - from
            technical deep dives to philosophical discussions about money and society. I&apos;ll
            keep adding to it as I discover more valuable content.
          </p>

          <div>
            <h3 className="text-xl font-semibold mb-3">📖 Read</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="https://blog.river.com/entering-the-dual-money-era/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Entering The Dual Money Era – River Financial
                </a>{' '}
                <span className="text-sm text-white/60">(Nov 2024)</span> – A compelling thesis on
                how Bitcoin will replace the dollar as a way to save while dollars remain for
                spending.
              </li>
              <li>
                <a
                  href="https://www.amazon.com/Price-Tomorrow-Technology-Deflation-Abundant/dp/1999257405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  The Price of Tomorrow – Jeff Booth
                </a>{' '}
                <span className="text-sm text-white/60">(Jan 2020)</span> – Explores how technology
                and deflation will shape our future.
              </li>
              <li>
                <a
                  href="https://www.swanbitcoin.com/inventing-bitcoin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Inventing Bitcoin – Yan Pritzker
                </a>{' '}
                <span className="text-sm text-white/60">(Jun 2019)</span> – Short, clear, and great
                for technical newcomers.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">🎥 Watch/Listen</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="https://youtu.be/Pef22g53zsg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Jack Mallers: Bitcoin is a Moral Revolution
                </a>{' '}
                <span className="text-sm text-white/60">(Jun 2025)</span> – A powerful and emotional
                explanation of Bitcoin as more than just an investment - a moral revolution in money
                offering hope and fairness to a generation facing economic hardship.
              </li>
              <li>
                <a
                  href="https://youtu.be/Flra35NJV_I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  THE Bitcoin Podcast: Saving in Bitcoin Ep. 1
                </a>{' '}
                <span className="text-sm text-white/60">(Mar 2025)</span> – Jeff Booth joins Walker
                for Episode 1 to introduce Bitcoin.
              </li>
            </ul>
            <p className="pt-3 text-sm text-[var(--text-secondary)]">
              For more current dashboards, calculators, and links I actually use, head over to{' '}
              <Link href="/links" className="text-[var(--accent)] underline">
                Favorite Bitcoin Links
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* WHERE TO BUY */}
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">🏦 How I Buy Bitcoin</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            I use{' '}
            <a
              href="https://river.com/signup?r=6UMRATB6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              River
            </a>{' '}
            because they prioritize security, transparency, and customer service.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>No fees for recurring purchases (DCA)</li>
            <li>White-glove customer service and tax reports</li>
            <li>100% full-reserve custody</li>
            <li>FDIC-insured cash balances earn bitcoin interest</li>
          </ul>
          <p>
            <a
              href="https://river.com/signup?r=6UMRATB6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline font-semibold"
            >
              → Sign up here with my referral link
            </a>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
