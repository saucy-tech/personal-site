import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Bitcoin Resources',
  description: 'Explore the ideas and resources that shaped my understanding of Bitcoin.',
  alternates: {
    canonical: '/bitcoin',
  },
  openGraph: {
    title: 'Learn About Bitcoin',
    description: 'Explore the ideas and resources that shaped my understanding of Bitcoin.',
    url: '/bitcoin',
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
    <PageLayout title="Why I save in Bitcoin">
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
        <h2 className="text-2xl font-semibold mb-4">Why this matters to me</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            As a Christian, I care about truth, integrity, and other people. The longer I looked at
            how the money system works, the more it cut against those things: it rewards debt,
            punishes saving, and moves wealth quietly from one group to another.
          </p>
          <p>
            Bitcoin changed how I think about money. It&apos;s transparent, hard to corrupt, and
            runs on rules that don&apos;t bend. That fits how I try to handle money: stewardship,
            fairness, a long time horizon.
          </p>
          <p>
            I&apos;m still learning. But I think this matters beyond the financial side. If
            you&apos;re curious, here&apos;s where I&apos;d start.
          </p>
        </div>
      </section>

      {/* START HERE SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Start here</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-6">
          <div className="text-center mb-6">
            <p className="text-lg mb-4">New to Bitcoin? Start with this documentary.</p>
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
        <h2 className="text-2xl font-semibold mb-4">Growing resource list</h2>
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
          </div>
        </div>
      </section>

      {/* WHERE TO BUY */}
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How I buy Bitcoin</h2>
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

      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Field notes</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-3 text-sm leading-relaxed">
          <p>
            <Link href="/field-notes" className="text-blue-400 underline">
              Field notes
            </Link>{' '}
            covers how I use AI day to day (models, harnesses, subscriptions, gear).
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
