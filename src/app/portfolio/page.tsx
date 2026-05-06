import { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import {
  Project,
  ProjectGroup,
  ProjectStatus,
  projectGroupLabels,
  projects,
  talks,
} from '@/data/projects';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: `Explore Brandon's projects and open-source contributions.`,
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio',
    description: `Explore Brandon's projects, apps, and experiments.`,
    url: '/portfolio',
    type: 'website',
    images: [
      {
        url: '/family-photo.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - Portfolio`,
      },
    ],
  },
};

const GROUP_ORDER: ProjectGroup[] = ['apps', 'tools', 'open-source'];

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

export default function Portfolio() {
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: projectGroupLabels[group],
    items: projects.filter((p) => p.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <PageLayout title="Portfolio">
      <section className="flex flex-col gap-10 items-center min-h-[40vh]">
        {grouped.map(({ group, label, items }) => (
          <div key={group} className="w-full max-w-xl">
            <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
              {label}
            </h2>
            <div className="flex flex-col gap-6">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ))}

        {talks.length > 0 && (
          <div className="w-full max-w-xl">
            <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
              Talks
            </h2>
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

        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) mb-4 pl-1">
            See also
          </h2>
          <div className="flex flex-col gap-3">
            <LinkCard
              title="Awards & Recognition"
              href="/awards"
              icon={<span className="text-2xl">🏆</span>}
              eyebrow="Awards"
              meta="National, state, and chapter-level honors"
            />
            <LinkCard
              title="About / Experience"
              href="/about"
              icon={<span className="text-2xl">👤</span>}
              eyebrow="About"
              meta="Career narrative and résumé"
            />
            <LinkCard
              title="What I'm Into Right Now"
              href="/field-notes"
              icon={<span className="text-2xl">📓</span>}
              eyebrow="Field notes"
              meta="Tools, tech, and gear I'm using this season"
            />
            <LinkCard
              title="The Daily Word"
              href="/daily-word"
              icon={<span className="text-2xl">✉️</span>}
              eyebrow="Devotion"
              meta="Weekday scripture reflections"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
