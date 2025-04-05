import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Learn About Church',
  description: 'Learn about our church community and beliefs.',
  openGraph: {
    title: 'Learn About Church',
    description: 'Learn about our church community and beliefs.',
    url: `${SITE_URL}/church`,
    type: 'website',
    images: [
      {
        url: '/og-church.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Church`,
      },
    ],
  },
};

export default function Church() {
  return (
    <PageLayout title="Learn About Our Church">
      <section>
        <h2 className="text-2xl font-semibold mb-4">✝️ Our Beliefs</h2>
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="mt-4">
            We are a community of believers committed to following Jesus Christ and sharing His love
            with the world.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">📅 Service Times</h2>
        <div className="bg-white/10 p-6 rounded-lg">
          <p className="mt-4">Join us for worship every Sunday at 10:00 AM.</p>
        </div>
      </section>
    </PageLayout>
  );
}
