import EmailLink from '@/components/EmailLink';
import { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';

import NotesSectionIndex from '@/components/NotesSectionIndex';
import PageLayout from '@/components/PageLayout';
import { Award, awards, awardsLastUpdated } from '@/data/awards';
import { portfolioAbout, portfolioAboutLastUpdated } from '@/data/portfolio-about';
import {
  Project,
  ProjectGroup,
  projectGroupLabels,
  projects,
  projectsLastUpdated,
  talks,
  publications,
} from '@/data/projects';
import { SITE_NAME, SOCIAL_PROFILES, absoluteUrl } from '@/utils/constants';
import { formatPostDate } from '@/utils/helpers';
import { getProfilePageJsonLd } from '@/utils/structured-data';

const PORTFOLIO_OG_IMAGE = absoluteUrl('/portfolio/opengraph-image');

const PORTFOLIO_DESCRIPTION =
  'Brandon Sauceda, independent software engineer behind The Morning Portion, Train Every Day, The Home Hive, and GIS Plugins. Client work, ten years of public-sector systems, awards, and downloadable résumé.';

// The page renders one "updated" date, so take the newest of the sections it draws from.
// ISO dates compare lexically, so a string comparison is enough.
const PORTFOLIO_LAST_UPDATED = [
  portfolioAboutLastUpdated,
  projectsLastUpdated,
  awardsLastUpdated,
].reduce((newest, date) => (date > newest ? date : newest));

export const metadata: Metadata = {
  title: 'Portfolio',
  description: PORTFOLIO_DESCRIPTION,
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio',
    description: PORTFOLIO_DESCRIPTION,
    url: '/portfolio',
    type: 'profile',
    images: [
      {
        url: PORTFOLIO_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description: PORTFOLIO_DESCRIPTION,
    images: [PORTFOLIO_OG_IMAGE],
  },
};

const GROUP_ORDER: ProjectGroup[] = ['apps', 'tools', 'open-source', 'client-work', 'track-record'];

// Link buttons: one solid primary action, outlined secondary actions. Both carry
// a border so mixed rows line up.
const BUTTON = 'a11y-focus-ring inline-block rounded-sm border px-4 py-2 transition';
const PRIMARY_BUTTON = `${BUTTON} border-(--accent) bg-(--accent) text-(--on-accent) hover:border-(--accent-dark) hover:bg-(--accent-dark)`;
const SECONDARY_BUTTON = `${BUTTON} border-(--accent-border) hover:bg-(--accent-transparent)`;

// Year chips use --surface when it is defined, else a faint foreground tint, so
// they read in light and dark themes.
const YEAR_CHIP =
  'whitespace-nowrap rounded-full border border-(--accent-border) bg-[color:var(--surface,color-mix(in_srgb,var(--foreground)_5%,transparent))] px-2 py-0.5 text-xs text-(--text-secondary)';

function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">{label}</h2>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    // scroll-mt-24 keeps deep-linked cards clear of the sticky section bar.
    <article id={project.id} className="scroll-mt-24 border-b border-(--surface-border) pb-8">
      {project.preview && (
        <Image
          {...project.preview}
          alt={project.preview.alt}
          sizes="(min-width: 768px) 768px, 100vw"
          className="mb-6 w-full h-auto rounded-sm border border-(--surface-border)"
        />
      )}
      <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
      <p className="mb-4 text-base leading-relaxed text-(--text-secondary)">
        {project.summary ?? project.blurb}
      </p>
      {project.tags.length > 0 && (
        <ul aria-label="Tech stack" className="mb-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-sm border border-(--surface-border) px-1.5 py-0.5 font-mono text-xs text-(--text-secondary)"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3">
        {project.links.map((link, index) => {
          const isExternal = /^https?:\/\//.test(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={index === 0 ? PRIMARY_BUTTON : SECONDARY_BUTTON}
            >
              {link.label}
            </a>
          );
        })}
      </div>
      <details className="mt-5 text-sm text-(--text-secondary)">
        <summary className="a11y-focus-ring cursor-pointer py-2 w-fit underline underline-offset-4">
          Build details
        </summary>
        {project.summary && <p className="mt-3 leading-relaxed">{project.blurb}</p>}
        <p className="mt-3 leading-relaxed">
          {project.status === 'contributor' ? 'Contributor' : 'Launched'}
        </p>
      </details>
    </article>
  );
}

function AwardCard({ award }: { award: Award }) {
  return (
    <div className="border-b border-(--surface-border) py-6">
      <h3 className="text-xl font-semibold mb-3">{award.name}</h3>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {award.years.map((y) => (
          <span key={y} className={YEAR_CHIP}>
            {y}
          </span>
        ))}
        <span className="text-sm text-(--text-secondary)">{award.issuer}</span>
      </div>
      {award.impact && <p className="text-base text-(--text-secondary)">{award.impact}</p>}
    </div>
  );
}

export default async function Portfolio() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const projectGroups = GROUP_ORDER.map((group) => ({
    group,
    label: projectGroupLabels[group],
    items: projects
      .filter((p) => p.group === group)
      .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)),
  })).filter((g) => g.items.length > 0);

  // Jump-nav entries, in page order, for every section that renders.
  const sections = [
    ...projectGroups.map(({ group, label }) => ({ id: `projects-${group}`, title: label })),
    ...(talks.length > 0 ? [{ id: 'talks', title: 'Talks' }] : []),
    ...(publications.length > 0 ? [{ id: 'publications', title: 'Publications' }] : []),
    ...(awards.length > 0 ? [{ id: 'awards', title: 'Awards' }] : []),
  ];

  const jsonLd = getProfilePageJsonLd({
    path: '/portfolio',
    name: portfolioAbout.headline,
    jobTitle: portfolioAbout.title,
    description: portfolioAbout.summary,
    imagePath: '/headshot.jpeg',
    sameAs: Object.values(SOCIAL_PROFILES),
    dateModified: PORTFOLIO_LAST_UPDATED,
  });

  return (
    <PageLayout title="Portfolio" readingWidth>
      <script
        suppressHydrationWarning
        type="application/ld+json"
        {...(nonce ? { nonce } : {})}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Children stretch so the sticky section bar can bleed to the page gutter on mobile. */}
      <section className="flex flex-col gap-12">
        <section className="w-full max-w-3xl text-left space-y-4 mb-4">
          <p className="text-sm uppercase tracking-widest text-(--text-secondary)">
            {portfolioAbout.title}
          </p>
          <h2 className="text-2xl font-semibold">{portfolioAbout.headline}</h2>
          <p className="text-base text-(--text-secondary) leading-relaxed">
            {portfolioAbout.summary}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <EmailLink fallback="Email me" className={PRIMARY_BUTTON} />
            <a
              href={portfolioAbout.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className={SECONDARY_BUTTON}
            >
              LinkedIn
            </a>
            <a
              href={portfolioAbout.github}
              target="_blank"
              rel="noopener noreferrer"
              className={SECONDARY_BUTTON}
            >
              GitHub
            </a>
            <a href={portfolioAbout.resumeHref} className={SECONDARY_BUTTON}>
              {portfolioAbout.resumeLabel}
            </a>
          </div>
          <p className="text-xs text-(--text-secondary)">
            Portfolio updated{' '}
            <time dateTime={PORTFOLIO_LAST_UPDATED}>{formatPostDate(PORTFOLIO_LAST_UPDATED)}</time>
          </p>
        </section>

        <NotesSectionIndex sections={sections} layout="bar" />

        {/* Projects */}
        {projectGroups.map(({ group, label, items }) => (
          <section key={group} id={`projects-${group}`} className="w-full max-w-3xl scroll-mt-24">
            <SectionHeading label={label} />
            <div className="flex flex-col gap-6">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        ))}

        {/* Talks */}
        {talks.length > 0 && (
          <section id="talks" className="w-full max-w-3xl scroll-mt-24">
            <SectionHeading label="Talks" />
            <div className="overflow-x-auto">
              <table className="w-full border-y border-(--surface-border)">
                <thead>
                  <tr className="text-left text-(--accent) text-sm">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {talks.map((talk) => (
                    <tr
                      key={`${talk.date}-${talk.title}`}
                      className="text-(--text-primary) text-base"
                    >
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-xs md:text-sm opacity-80">
                        <time dateTime={talk.date}>{formatPostDate(talk.date)}</time>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {talk.link ? (
                          <a
                            href={talk.link.href}
                            target={/^https?:\/\//.test(talk.link.href) ? '_blank' : undefined}
                            rel={
                              /^https?:\/\//.test(talk.link.href)
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="text-(--accent) underline underline-offset-2 hover:opacity-80"
                          >
                            {talk.title}
                          </a>
                        ) : (
                          talk.title
                        )}
                      </td>
                      <td className="py-3 px-4">{talk.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <section id="publications" className="w-full max-w-3xl scroll-mt-24">
            <SectionHeading label="Publications" />
            <div className="flex flex-col gap-6">
              {publications.map((pub) => (
                <div
                  key={`${pub.year}-${pub.title}`}
                  className="border-b border-(--surface-border) py-6"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className={YEAR_CHIP}>{pub.year}</span>
                    <h3 className="text-lg font-semibold">{pub.title}</h3>
                  </div>
                  <p className="text-sm text-(--text-secondary) mb-3">{pub.venue}</p>
                  {pub.authors.length > 0 && (
                    <p className="text-xs text-(--text-secondary) mb-3">{pub.authors.join(', ')}</p>
                  )}
                  {pub.link && (
                    <a
                      href={pub.link.href}
                      target={/^https?:\/\//.test(pub.link.href) ? '_blank' : undefined}
                      rel={/^https?:\/\//.test(pub.link.href) ? 'noopener noreferrer' : undefined}
                      className={PRIMARY_BUTTON}
                    >
                      {pub.link.label || 'View'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section id="awards" className="w-full max-w-3xl scroll-mt-24">
            <SectionHeading label="Awards" />
            <div className="flex flex-col gap-6">
              {awards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </section>
        )}
      </section>
    </PageLayout>
  );
}
