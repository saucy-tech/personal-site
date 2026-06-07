import { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { Award, awards } from '@/data/awards';
import { portfolioAbout, portfolioAboutLastUpdated } from '@/data/portfolio-about';
import {
  Project,
  ProjectGroup,
  ProjectStatus,
  projectGroupLabels,
  projects,
  talks,
  publications,
} from '@/data/projects';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Brandon Sauceda — IT Development Manager and software engineer. Gov-tech, GIS, full-stack apps, open source, awards, and downloadable résumé.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio',
    description:
      'Brandon Sauceda — IT Development Manager and software engineer. Gov-tech, GIS, full-stack apps, open source, awards, and downloadable résumé.',
    url: '/portfolio',
    type: 'profile',
    images: [
      {
        url: '/headshot.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - Portfolio`,
      },
    ],
  },
};

const GROUP_ORDER: ProjectGroup[] = ['apps', 'tools', 'open-source', 'track-record'];

const STATUS_PILL: Record<ProjectStatus, { label: string; className: string }> = {
  launched: { label: 'Launched', className: 'bg-green-500/80 text-white' },
  contributor: { label: 'Contributor', className: 'bg-purple-500/80 text-white' },
};

function Tag({ label }: { label: string }) {
  return (
    <span className="text-xs bg-white/10 text-(--text-secondary) border border-(--accent-border) px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

function SectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h2
      id={id}
      className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1 scroll-mt-24"
    >
      {label}
    </h2>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const pill = STATUS_PILL[project.status];
  return (
    <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <span className={`text-xs ${pill.className} px-2 py-0.5 rounded-full`}>{pill.label}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <p className="mb-4 text-base text-(--text-secondary)">{project.blurb}</p>
      <div className="flex flex-wrap gap-3">
        {project.links.map((link) => {
          const isExternal = /^https?:\/\//.test(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function AwardCard({ award }: { award: Award }) {
  return (
    <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6">
      <h3 className="text-xl font-semibold mb-3">{award.name}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {award.years.map((y) => (
          <span
            key={y}
            className="text-xs bg-white/10 text-(--text-secondary) border border-(--accent-border) px-2 py-0.5 rounded-full"
          >
            {y}
          </span>
        ))}
      </div>
      {award.impact && <p className="text-base text-(--text-secondary)">{award.impact}</p>}
    </div>
  );
}

export default function Portfolio() {
  const projectGroups = GROUP_ORDER.map((group) => ({
    group,
    label: projectGroupLabels[group],
    items: projects.filter((p) => p.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <PageLayout title="Portfolio">
      <section className="flex flex-col gap-12 items-center">
        <section className="w-full max-w-xl text-center space-y-4 mb-4">
          <p className="text-sm uppercase tracking-widest text-(--text-secondary)">
            {portfolioAbout.title}
          </p>
          <h2 className="text-2xl font-semibold">{portfolioAbout.headline}</h2>
          <p className="text-base text-(--text-secondary) leading-relaxed">
            {portfolioAbout.summary}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <a
              href={`mailto:${portfolioAbout.email}`}
              className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
            >
              {portfolioAbout.email}
            </a>
            <a
              href={portfolioAbout.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
            >
              LinkedIn
            </a>
            <a
              href={portfolioAbout.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
            >
              GitHub
            </a>
            <a
              href={portfolioAbout.resumeHref}
              className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
            >
              {portfolioAbout.resumeLabel}
            </a>
          </div>
          <p className="text-xs text-(--text-secondary)">
            Portfolio updated {portfolioAboutLastUpdated}
          </p>
        </section>

        {/* Projects */}
        {projectGroups.map(({ group, label, items }) => (
          <div key={group} className="w-full max-w-xl">
            <SectionHeading id={`projects-${group}`} label={label} />
            <div className="flex flex-col gap-6">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ))}

        {/* Talks */}
        {talks.length > 0 && (
          <div className="w-full max-w-xl">
            <SectionHeading id="talks" label="Talks" />
            <div className="overflow-x-auto">
              <table className="w-full bg-white/10 rounded-lg shadow-lg border border-(--accent-border) backdrop-blur-xs">
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
                        {talk.date}
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
          </div>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <div className="w-full max-w-xl">
            <SectionHeading id="publications" label="Publications" />
            <div className="flex flex-col gap-6">
              {publications.map((pub) => (
                <div
                  key={`${pub.year}-${pub.title}`}
                  className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-xs bg-white/10 text-(--text-secondary) border border-(--accent-border) px-2 py-0.5 rounded-full whitespace-nowrap">
                      {pub.year}
                    </span>
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
                      className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
                    >
                      {pub.link.label || 'View'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div className="w-full max-w-xl">
            <SectionHeading id="awards" label="Awards" />
            <div className="flex flex-col gap-6">
              {awards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
