import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import EmailLink from '@/components/EmailLink';
import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import { fieldNotesLastUpdated } from '@/data/field-notes';
import { type ProjectLink, projects, projectsLastUpdated } from '@/data/projects';
import SocialBar from '@/components/SocialBar';
import { SocialIcon } from '@/components/SocialIcons';
import { AUTHOR_NAME, SOCIAL_PROFILES } from '@/utils/constants';
import { formatPostDate } from '@/utils/helpers';
import { siteOpenGraph } from '@/utils/open-graph';

export const metadata: Metadata = {
  description:
    'Brandon Sauceda is a software engineer, independent builder, and creator of The Morning Portion.',
  alternates: {
    canonical: '/',
  },
  openGraph: siteOpenGraph({ url: '/' }),
};

// Neutral raised surface. `--surface` comes from the shared palette once it lands;
// until then the fallback tints the page background toward the foreground color.
const SURFACE_BG = 'bg-[var(--surface,color-mix(in_srgb,var(--foreground)_4%,transparent))]';

/** State of Georgia track record, one fact per tile so it scans at a glance. */
const TRACK_RECORD = [
  { value: '10 years', label: 'building public web and GIS systems for the State of Georgia' },
  { value: '50,000+', label: 'monthly users' },
  { value: '40%', label: 'cut in citizen wait times' },
  { value: 'Esri 2020 & GMIS 2026', label: 'international awards' },
];

/** Demo builds carry "demo" in their URL or link label; everything else is the live product. */
function isDemoLink(link: ProjectLink) {
  return /demo/i.test(link.href) || /demo/i.test(link.label);
}

function externalProps(href: string) {
  return /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

export default function Home() {
  const profileData = {
    name: AUTHOR_NAME,
    bio: 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin',
    imageSrc: '/headshot.jpeg',
  };

  const socialLinks = [
    {
      href: SOCIAL_PROFILES.linkedIn,
      icon: <SocialIcon name="linkedIn" className="size-5" />,
      label: 'LinkedIn',
    },
    {
      href: SOCIAL_PROFILES.github,
      icon: <SocialIcon name="github" className="size-5" />,
      label: 'GitHub',
    },
    {
      href: SOCIAL_PROFILES.x,
      icon: <SocialIcon name="x" className="size-5" />,
      label: 'X',
    },
  ];

  return (
    <div className="pt-8 pb-12 sm:pt-10">
      <div className="w-full space-y-12">
        <div className="space-y-6">
          <Profile {...profileData} />
          <p className="max-w-2xl text-center text-base leading-relaxed text-pretty text-(--text-secondary) sm:text-left">
            Software engineer. I build my own products and take on a few client projects each year.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <EmailLink className="a11y-focus-ring inline-flex min-h-11 items-center rounded-sm bg-(--accent) px-5 text-sm font-medium text-(--on-accent) transition hover:bg-(--accent-dark)">
                Email me
              </EmailLink>
              <Link
                href="/resume"
                className="a11y-focus-ring inline-flex min-h-11 items-center rounded-sm border border-(--accent-border) px-5 text-sm font-medium text-(--accent) transition hover:bg-(--accent-transparent)"
              >
                Résumé
              </Link>
            </div>
            <SocialBar socials={socialLinks} />
          </div>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {TRACK_RECORD.map((item) => (
              <div
                key={item.value}
                className={`flex flex-col-reverse justify-end gap-1 rounded-sm border border-(--surface-border) px-4 py-3 ${SURFACE_BG}`}
              >
                <dt className="text-sm leading-snug text-(--text-secondary)">{item.label}</dt>
                <dd className="text-lg font-semibold leading-tight tracking-tight text-(--text-primary) sm:text-xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <section aria-labelledby="selected-products" className="space-y-6">
          <h2 id="selected-products" className="text-2xl font-semibold">
            Products I build
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects
              .filter((project) => project.featured && project.preview)
              .map((project) => {
                const preview = project.preview;
                const link = project.links[0];
                if (!preview || !link) return null;
                const isDemo = isDemoLink(link);
                const linkProps = externalProps(link.href);
                return (
                  // The title link stretches over the card (after:inset-0), so the whole
                  // card opens the product; "Build details" sits above it with z-10.
                  <article
                    key={project.id}
                    className={`group relative flex flex-col overflow-hidden rounded-md border border-(--surface-border) transition-colors hover:border-(--accent-border) focus-within:border-(--accent-border) ${SURFACE_BG}`}
                  >
                    {/* A uniform matte frame so dark and bright screenshots read as one set. */}
                    <div className="aspect-16/10 border-b border-(--surface-border) px-4 pt-4">
                      <div className="h-full overflow-hidden rounded-t-sm border border-b-0 border-(--surface-border) bg-(--background)">
                        <Image
                          src={preview.src}
                          alt={preview.alt}
                          width={preview.width}
                          height={preview.height}
                          sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                          className="h-full w-full object-cover object-top transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="flex grow flex-col gap-3 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <h3 className="text-xl font-semibold tracking-tight">
                          <a
                            href={link.href}
                            {...linkProps}
                            className="a11y-focus-ring rounded-xs transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-(--accent)"
                          >
                            {project.title}
                            {'target' in linkProps && (
                              <span className="sr-only"> (opens in a new tab)</span>
                            )}
                          </a>
                        </h3>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--surface-border) px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-(--text-secondary)">
                          <span
                            aria-hidden="true"
                            className={`size-1.5 rounded-full ${isDemo ? 'bg-(--accent)' : 'bg-(--status-success)'}`}
                          />
                          {isDemo ? 'Interactive demo' : 'Live'}
                        </span>
                      </div>
                      <p className="leading-relaxed text-(--text-secondary)">{project.summary}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm">
                        {/* Visual cue only: the stretched title link already covers this. */}
                        <span
                          aria-hidden="true"
                          className="inline-flex items-center gap-1 font-medium text-(--accent)"
                        >
                          {link.label}
                          <ArrowUpRightIcon className="size-4" />
                        </span>
                        <Link
                          href={`/portfolio#${project.id}`}
                          className="a11y-focus-ring relative z-10 inline-flex min-h-10 items-center rounded-xs text-(--text-secondary) underline-offset-4 transition-colors hover:text-(--accent) hover:underline"
                        >
                          Build details
                          <span className="sr-only"> for {project.title}</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="now">
            <h2 id="now" className="text-2xl font-semibold mb-4">
              Now
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-(--text-secondary)">
              <li>
                Notes updated{' '}
                <time dateTime={fieldNotesLastUpdated}>
                  {formatPostDate(fieldNotesLastUpdated)}
                </time>
                {' · '}
                <Link
                  href="/notes"
                  className="a11y-focus-ring rounded-xs text-(--accent) underline underline-offset-4"
                >
                  Read the latest
                </Link>
              </li>
              <li>
                Portfolio updated{' '}
                <time dateTime={projectsLastUpdated}>{formatPostDate(projectsLastUpdated)}</time>
                {' · '}
                <Link
                  href="/portfolio"
                  className="a11y-focus-ring rounded-xs text-(--accent) underline underline-offset-4"
                >
                  See what changed
                </Link>
              </li>
              <li>
                Today’s weekday devotion{' · '}
                <a
                  href="https://morningportion.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a11y-focus-ring rounded-xs text-(--accent) underline underline-offset-4"
                >
                  Read it at morningportion.com
                </a>
              </li>
              <li>
                This week in QGIS plugins{' · '}
                <a
                  href="https://gisplugins.dev/newsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a11y-focus-ring rounded-xs text-(--accent) underline underline-offset-4"
                >
                  Read GIS Plugins Weekly
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="explore">
            <h2 id="explore" className="text-2xl font-semibold mb-4">
              More from me
            </h2>
            <div className="divide-y divide-(--surface-border)">
              <LinkCard
                headingLevel="h3"
                key="my-projects"
                title="Portfolio"
                href="/portfolio"
                meta="Products, public-sector systems, open source, and résumé"
              />
              <LinkCard
                headingLevel="h3"
                key="work-with-me"
                title="Client work"
                href="/about#work-with-me"
                meta="Web apps and focused product builds"
              />
              <LinkCard
                headingLevel="h3"
                key="notes"
                title="Notes"
                href="/notes"
                meta="AI tools, Bitcoin, my church, and what I'm doing now"
              />
            </div>
          </section>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/support"
            className="a11y-focus-ring rounded-xs text-(--accent) hover:underline underline-offset-4"
          >
            Support my work
          </Link>
        </div>
      </div>
    </div>
  );
}
