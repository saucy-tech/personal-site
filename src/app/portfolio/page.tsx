import { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { Award, AwardTier, awardTierLabels, awards } from '@/data/awards';
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
  description:
    'Brandon Sauceda — IT Development & GIS Manager at the Georgia Department of Agriculture. Gov-tech, GIS, mobile field tools, indie projects, and open-source work.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio',
    description:
      'Brandon Sauceda — IT Development & GIS Manager at the Georgia Department of Agriculture. Gov-tech, GIS, mobile field tools, indie projects, and open-source work.',
    url: '/portfolio',
    type: 'profile',
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

// Set to a real path under /public when the sanitized résumé PDF is uploaded.
// Example: '/resume/brandon-sauceda-resume.pdf'
const RESUME_PDF_PATH: string | null = null;

const STACK = [
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Rust',
  'MS SQL',
  'PostgreSQL',
  'ArcGIS Pro',
  'ArcGIS Online',
  'Lightning Network',
];

const GROUP_ORDER: ProjectGroup[] = ['apps', 'tools', 'open-source'];
const TIER_ORDER: AwardTier[] = ['headline', 'body'];

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
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold">{award.name}</h3>
        <span className="text-xs bg-white/10 text-(--text-secondary) border border-(--accent-border) px-2 py-0.5 rounded-full">
          {award.year}
        </span>
      </div>
      <p className="text-sm text-(--text-secondary) mb-1">
        <span className="font-medium text-(--text-primary)">Issuer:</span> {award.issuer}
      </p>
      {award.project && (
        <p className="text-sm text-(--text-secondary) mb-3">
          <span className="font-medium text-(--text-primary)">Project:</span> {award.project}
        </p>
      )}
      {award.impact && <p className="mb-3 text-base text-(--text-secondary)">{award.impact}</p>}
      {award.issuerLink && (
        <a
          href={award.issuerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-(--accent) underline underline-offset-2 hover:opacity-80"
        >
          Verify with issuer →
        </a>
      )}
    </div>
  );
}

export default function Portfolio() {
  const projectGroups = GROUP_ORDER.map((group) => ({
    group,
    label: projectGroupLabels[group],
    items: projects.filter((p) => p.group === group),
  })).filter((g) => g.items.length > 0);

  const awardGroups = TIER_ORDER.map((tier) => ({
    tier,
    label: awardTierLabels[tier],
    items: awards.filter((a) => a.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <PageLayout title="Portfolio">
      <section className="flex flex-col gap-12 items-center">
        {/* Bio */}
        <div className="w-full max-w-xl space-y-4 text-(--text-secondary)">
          <p>
            IT Development &amp; GIS Manager at the Georgia Department of Agriculture, based in
            Atlanta. The week splits across setting IT dev strategy, managing people, writing and
            reviewing code, product and project work, scoping requirements, triaging bugs, and
            managing vendor relationships.
          </p>
          <p>
            The team builds gov-tech, GIS, and mobile field tools that state regulators rely on.
            Most of what we ship solves an operational problem for someone doing real work in the
            field, often on a phone, often offline. Recognition has followed: NASCIO national
            finalist, Esri SAG, and multiple GMIS and GTA awards.
          </p>
          <p>
            Outside of work I write The Daily Word devotion, ship side projects, and contribute to
            open source in the Bitcoin and Lightning ecosystem.
          </p>
        </div>

        {/* Now */}
        <div className="w-full max-w-xl">
          <SectionHeading id="now" label="Now" />
          <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6 space-y-4">
            <div>
              <p className="text-base text-(--text-primary) font-medium">
                IT Development &amp; GIS Manager &middot; Georgia Department of Agriculture
              </p>
              <p className="text-sm text-(--text-secondary)">Atlanta, GA</p>
              <p className="mt-2 text-sm text-(--text-secondary)">
                Strategy, people management, hands-on engineering, product/project, requirements,
                vendor contracts, and code review.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-(--text-secondary) mb-2">
                Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <Tag key={s} label={s} />
                ))}
              </div>
            </div>
          </div>
        </div>

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

        {/* Awards */}
        {awardGroups.map(({ tier, label, items }) => (
          <div key={tier} className="w-full max-w-xl">
            <SectionHeading
              id={tier === 'headline' ? 'awards' : `awards-${tier}`}
              label={`Awards · ${label}`}
            />
            <div className="flex flex-col gap-6">
              {items.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </div>
        ))}

        {/* Résumé */}
        <div className="w-full max-w-xl">
          <SectionHeading id="resume" label="Résumé" />
          <div className="bg-white/10 rounded-lg shadow-lg border border-(--accent-border) p-6 space-y-4">
            <p className="text-(--text-secondary) text-sm">
              Full work history, dates, and accomplishments live in the PDF. References, salary
              history, and details on non-public projects are available on request.
            </p>
            {RESUME_PDF_PATH ? (
              <a
                href={RESUME_PDF_PATH}
                className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
                download
              >
                Download résumé (PDF)
              </a>
            ) : (
              <p className="text-xs text-(--text-secondary) italic">
                Résumé PDF coming soon. Reach out via the social links on the home page.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
