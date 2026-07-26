import type { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Sunday Health Review Terms of Use',
  description: 'Terms of use for Brandon Sauceda’s private Oura health-data integration.',
  alternates: {
    canonical: '/oura-health/terms',
  },
};

export default function OuraHealthTermsPage() {
  return (
    <PageLayout
      title="Sunday Health Review Terms of Use"
      backHref="/oura-health"
      backLabel="Back to Sunday Health Review"
    >
      <article className="mx-auto max-w-2xl space-y-8">
        <p className="text-sm text-(--text-secondary)">Effective July 26, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Personal use</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Sunday Health Review is a private tool operated by Brandon Sauceda for his own health
            tracking. It is not offered as a public service and does not accept user accounts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">No medical service</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            The integration organizes personal data. It does not diagnose, treat, or prevent any
            condition and is not a substitute for professional medical care.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Availability and accuracy</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            The integration is provided as-is for personal use. Data may be delayed, incomplete, or
            unavailable because of device syncing, Oura service changes, network problems, or local
            software errors. Health decisions should not rely on this integration alone.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-party services</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            The integration depends on Oura, Apple, and other local services, which operate under
            their own terms and privacy policies. Oura is a trademark of Oura Health Oy. This
            integration is not endorsed by or affiliated with Oura.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Changes and termination</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Brandon may change or stop the integration at any time. Oura access may also be revoked
            at any time through the connected Oura account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Questions about these terms can be sent to{' '}
            <a className="text-(--accent) hover:underline" href="mailto:brandon@saucy.tech">
              brandon@saucy.tech
            </a>
            .
          </p>
        </section>
      </article>
    </PageLayout>
  );
}
