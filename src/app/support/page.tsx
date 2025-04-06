import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Support Me',
  description: "Support Brandon's writing, projects, and long-term vision for his family.",
  openGraph: {
    title: 'Support Me',
    description: "Contribute to Brandon's work, family savings, or send Bitcoin.",
    url: `${SITE_URL}/support`,
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Support Me`,
      },
    ],
  },
};

export default function Support() {
  return (
    <PageLayout title="Support Me">
      <section className="mb-10">
        <p className="text-lg text-gray-300 mb-6">
          If you've found value in my writing, projects, or perspective and want to help me keep
          creating, here are a few ways to support my work and my family's future.
        </p>

        <div className="space-y-8">
          {/* 529 Gifting */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">🎓 Gift to My Son's 529 Plan</h3>
            <p className="mb-3">
              We're investing in our son's future through a 529 college savings plan. You can give
              directly using our Ugift code at{' '}
              <a
                href="https://www.ugift529.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Ugift529.com
              </a>
              . It's simple and secure — just enter this code to send a contribution:
            </p>
            <code className="block text-sm break-words bg-black/40 p-3 rounded">21W-40K</code>
          </div>

          {/* Lightning LNURL */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">⚡ Lightning Tips (LNURL)</h3>
            <p className="mb-3">
              If you're on Lightning, you can send a tip directly to my Lightning Address:
            </p>
            <code className="block text-sm break-words bg-black/40 p-3 rounded">
              saucy@getalby.com
            </code>
            <p className="mt-2 text-sm text-gray-400">
              You can also scan the QR on my contact page or use Zeus, Breez, Phoenix, or Mutiny.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
