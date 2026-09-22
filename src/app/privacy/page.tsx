import type { Metadata } from 'next';
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Saucy.Tech handles email subscriptions, site preferences, and technical data.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <PageLayout title="Privacy" readingWidth>
      <p className="text-(--text-secondary)">Updated September 22, 2026</p>
      <p className="leading-relaxed">
        Saucy Tech LLC operates Saucy.Tech. This notice covers this website and its email signup.
      </p>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold">Email subscriptions</h2>
        <p>
          When you subscribe, your email address is sent to Kit, the service used to manage the
          mailing list and deliver emails. The signup can also send the page you subscribed from.
          Your address is used to send the notes you signed up for. You can unsubscribe using the
          link in an email.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold">Site preferences and technical data</h2>
        <p>
          Your browser stores your color and light or dark mode preferences locally. You can remove
          these preferences by clearing this site’s browser data.
        </p>
        <p>
          Cloudflare hosts the site and processes network requests to deliver pages and protect the
          service. Requests include technical information such as your IP address and browser
          details. The site uses request limits to reduce abuse and operational logs to diagnose
          problems. When enabled, Sentry receives error and performance diagnostics.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold">Product demos</h2>
        <p>
          The public demos linked from the portfolio (Train Every Day, The Home Hive, Sunday School,
          and Health Dashboard) run on Cloudflare Workers. They have no accounts and no analytics.
          Anything you enter stays in your own browser storage and is never sent to Saucy Tech;
          clearing the site&rsquo;s browser data removes it. Cloudflare processes the requests that
          deliver each demo, as described above.
        </p>
        <p>
          Every person, measurement, and note shown in a demo is invented. The Health Dashboard demo
          is not medical advice. When you play a Story Time video in The Home Hive demo, the video
          loads from YouTube, and Google&rsquo;s privacy practices apply to that video.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold">Other services</h2>
        <p>
          Social links and payment services may take you to other services with their own privacy
          practices. The Morning Portion has its own privacy notice. The Oura integration is covered
          by the separate{' '}
          <Link
            href="/oura-health/privacy"
            className="a11y-focus-ring text-(--accent) underline underline-offset-4"
          >
            Oura integration privacy notice
          </Link>
          .
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-2xl font-semibold">Questions or removal requests</h2>
        <p>
          For questions about your information or a request to remove your subscription information,
          email{' '}
          <a
            href="mailto:brandon@saucy.tech"
            className="a11y-focus-ring text-(--accent) underline underline-offset-4"
          >
            brandon@saucy.tech
          </a>
          .
        </p>
      </section>
    </PageLayout>
  );
}
