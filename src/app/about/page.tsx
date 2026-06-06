import { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { about, aboutLastUpdated } from '@/data/about';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Brandon Sauceda runs Saucy Tech, building his own software products and taking on select client work.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About',
    description:
      'Brandon Sauceda runs Saucy Tech, building his own software products and taking on select client work.',
    url: '/about',
    type: 'profile',
    images: [
      {
        url: '/headshot.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - About`,
      },
    ],
  },
};

export default function About() {
  return (
    <PageLayout title="About">
      <section>
        <p className="text-base leading-relaxed text-(--text-secondary)">{about.lead}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What Saucy Tech does</h2>
        <p className="text-base leading-relaxed text-(--text-secondary)">{about.shopOneLiner}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex flex-col gap-4">
          {about.products.map((product) => {
            const isExternal = /^https?:\/\//.test(product.href);
            return (
              <a
                key={product.name}
                href={product.href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block rounded-lg border border-(--accent-border) bg-white/10 p-5 transition hover:bg-white/15"
              >
                <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-(--text-secondary)">{product.oneLiner}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Track record</h2>
        <p className="text-base leading-relaxed text-(--text-secondary)">{about.trackRecord}</p>
      </section>

      <section id="work-with-me" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold">{about.workWithMe.heading}</h2>
        <p className="text-base leading-relaxed text-(--text-secondary)">{about.workWithMe.body}</p>
        <a
          href={`mailto:${about.workWithMe.email}`}
          className="inline-block rounded-sm bg-(--accent) px-4 py-2 text-(--on-accent) transition hover:bg-(--accent-dark)"
        >
          {about.workWithMe.email}
        </a>
      </section>

      <p className="text-xs text-(--text-secondary)">About updated {aboutLastUpdated}</p>
    </PageLayout>
  );
}
