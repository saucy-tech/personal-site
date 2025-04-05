import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
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
        url: '/og-bitcoin.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Bitcoin`,
      },
    ],
  },
};

export default function Bitcoin() {
  return (
    <PageLayout title="Why I Believe in Bitcoin">
      <section>
        <h2 className="text-2xl font-semibold mb-4">🧠 Learn What Shaped My Thinking</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            As a Christian, I care deeply about truth, justice, and caring for others. Over time, I
            began to realize that the way our money works often undermines those values—rewarding
            debt, punishing savers, and quietly transferring wealth in ways that aren't fair or
            transparent.
          </p>
          <p>
            Learning about Bitcoin opened my eyes. It's a tool for honest weights and measures.
            Bitcoin is transparent, open to all, and resistant to corruption. It just makes sense to
            me in the bigger picture of stewardship, integrity, and how our world is supposed to
            work.
          </p>
          <p>
            I'm still learning every day, and I don't have all the answers. But if you're curious,
            I'd love to share what's helped me understand it—and why I believe it matters for the
            future.
          </p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">🚀 Start Here</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            New to Bitcoin? You're not alone. Here's a simple place to start learning without
            getting overwhelmed.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Read:</strong>{' '}
              <a
                href="https://www.amazon.com/Thank-God-Bitcoin-Corruption-Redemption-ebook/dp/B08P3Z2H48"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Thank God for Bitcoin
              </a>{' '}
              – A clear and moral look at why Bitcoin matters.
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">🎧 Podcasts & Videos</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-2">
          <p>Some episodes that really spoke to me:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <a
                href="https://www.youtube.com/watch?v=oksraL7wN6Q&t=483s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                START HERE: "God Bless Bitcoin" Short Film
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=4rvTppy1qLI&list=PL2jAZ0x9H0bQFY6wIbQfnrnIlqMcSHd6X"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                What is Money? – Michael Saylor Series
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=wRxc7uUqAyE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                What is Money? – Jason Lowery Series
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">📚 Books That Helped Me</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-2">
          <p>These are some of the most influential Bitcoin books I've read:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <a
                href="https://www.amazon.com/Thank-God-Bitcoin-Corruption-Redemption-ebook/dp/B08P3Z2H48"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Thank God for Bitcoin – The Creation, Corruption & Redemption of Money
              </a>
            </li>
            <li>
              <a
                href="https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                The Bitcoin Standard – Saifedean Ammous
              </a>
            </li>
            <li>
              <a
                href="https://www.amazon.com/dp/1999257405"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Layered Money – Nik Bhatia
              </a>
            </li>
            <li>
              <a
                href="https://www.swanbitcoin.com/inventing-bitcoin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Inventing Bitcoin – Yan Pritzker
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-8 mb-4">🏦 Where I Buy Bitcoin</h2>
        <div className="bg-white/10 p-6 rounded-lg space-y-4">
          <p>
            I personally use{' '}
            <a
              href="https://river.com/signup?r=6UMRATB6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              River
            </a>{' '}
            to buy and store my Bitcoin. They're a U.S.-based company focused on security,
            transparency, and long-term savings.
          </p>
          <p>What I like about River:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>No hidden fees – you see the true cost upfront</li>
            <li>Daily auto-purchases (DCA) are easy to set up</li>
            <li>Full-reserve custody (not a trading platform)</li>
            <li>Great tax reporting and history tracking</li>
          </ul>
          <p>
            If you're ready to take the next step,{' '}
            <a
              href="https://river.com/signup?r=6UMRATB6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              click here to sign up with River
            </a>{' '}
            using my referral link.
          </p>
          <p className="text-sm text-white/60">
            (Referral link means we both benefit if you sign up – thank you!)
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
