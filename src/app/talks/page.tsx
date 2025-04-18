import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Talks & Sermons',
  description: `Archive of faith-based messages and technical talks by Brandon.`,
  openGraph: {
    title: 'Talks & Sermons',
    description: `Archive of faith-based messages and technical talks by Brandon.`,
    url: `${SITE_URL}/talks`,
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Talks & Sermons`,
      },
    ],
  },
};


export default function Talks() {
  return (
    <PageLayout title="Talks & Sermons">
      <section>
        <div className="overflow-x-auto w-full max-w-2xl mx-auto mt-6">
          <table className="w-full min-w-[350px] bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] backdrop-blur-sm">
            <thead>
              <tr className="text-left text-[var(--accent)] text-sm">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Venue</th>
                <th className="py-3 px-4 font-semibold">Link</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[var(--text-primary)] text-base">
                <td className="py-3 px-4 whitespace-nowrap font-mono text-xs md:text-sm opacity-80">2025-03-26</td>
                <td className="py-3 px-4 font-medium">The Price of Tomorrow</td>
                <td className="py-3 px-4">Atlanta BitPlebs</td>
                <td className="py-3 px-4"><span className="opacity-50">N/A</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </PageLayout>
  );
}
