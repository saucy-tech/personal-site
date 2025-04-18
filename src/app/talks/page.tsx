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
      <section className="flex justify-center items-center min-h-[40vh]">
        <span className="text-2xl md:text-3xl animate-pulse">🚧 Coming Soon!</span>
        {/*
        <section className="overflow-x-auto">
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
              {talks.map((talk, idx) => (
                <tr
                  key={talk.link}
                  className={`text-[var(--text-primary)] text-base ${idx % 2 === 0 ? 'bg-white/0' : 'bg-white/5'} hover:bg-[var(--accent-transparent)] transition`}
                >
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-xs md:text-sm opacity-80">{talk.date}</td>
                  <td className="py-3 px-4 font-medium">{talk.title}</td>
                  <td className="py-3 px-4">{talk.venue}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={talk.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--accent)] hover:text-[var(--accent-hover)]"
                    >
                      Watch
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        */}
      </section>
    </PageLayout>
  );
}
