import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Projects',
  description: `Explore Brandon's projects, apps, and experiments.`,
  openGraph: {
    title: 'Projects',
    description: `Explore Brandon's projects, apps, and experiments.`,
    url: `${SITE_URL}/projects`,
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Projects`,
      },
    ],
  },
};

export default function Projects() {
  return (
    <PageLayout title="Projects">
      <section className="flex justify-center items-center min-h-[40vh]">
        <span className="text-2xl md:text-3xl animate-pulse">🚧 Coming Soon!</span>
      </section>
    </PageLayout>
  );
}
