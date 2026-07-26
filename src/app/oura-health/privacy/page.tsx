import type { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Sunday Health Review Privacy Policy',
  description: 'Privacy policy for Brandon Sauceda’s private Oura health-data integration.',
  alternates: {
    canonical: '/oura-health/privacy',
  },
};

export default function OuraHealthPrivacyPage() {
  return (
    <PageLayout
      title="Sunday Health Review Privacy Policy"
      backHref="/oura-health"
      backLabel="Back to Sunday Health Review"
    >
      <article className="mx-auto max-w-2xl space-y-8">
        <p className="text-sm text-(--text-secondary)">Effective July 26, 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Purpose</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Sunday Health Review is a private integration used only by Brandon Sauceda. It imports
            selected Oura data into Brandon&apos;s personal weekly health review. It has no public
            users or account system.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data accessed</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            The integration requests Oura daily sleep, readiness, activity, recovery, SpO2, daytime
            stress, resilience, cardiovascular age, and pulse-wave velocity data. It does not
            request Oura email, profile, workout, tag, session, or ring configuration data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Storage and security</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Oura API credentials and refresh tokens are stored in the macOS Keychain when available,
            with an encrypted, owner-only local credential store used for unattended reliability.
            Imported data is stored in Brandon&apos;s private local and iCloud health records. This
            public website does not receive or store Oura health data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sharing and use</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Oura data is used only for Brandon&apos;s personal health tracking. It is not sold,
            licensed, used for advertising, or shared with other users. Apple may process stored
            files through Brandon&apos;s private iCloud account under Apple&apos;s own terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Retention and deletion</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Imported records are retained as part of Brandon&apos;s personal longitudinal health
            history until he deletes them. Oura access can be revoked from the Oura account, and
            locally stored credentials can be removed at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="leading-relaxed text-(--text-secondary)">
            Questions about this policy can be sent to{' '}
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
