import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import EmailLink from '@/components/EmailLink';
import type { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { resume, resumeLastUpdated } from '@/data/resume';
import { formatPostDate } from '@/utils/helpers';

const RESUME_DESCRIPTION =
  'Brandon Sauceda’s résumé: IT Development Manager at the Georgia Department of Agriculture and independent software engineer behind Saucy Tech. Experience, products, awards, and skills, with a PDF download.';

export const metadata: Metadata = {
  title: 'Résumé',
  description: RESUME_DESCRIPTION,
  alternates: { canonical: '/resume' },
};

const linkClass = 'a11y-focus-ring text-(--accent) underline underline-offset-4';

/** Opens off-site links in a new tab; same-site links (like the PDF) stay in place. */
function externalLinkProps(href: string) {
  return /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-widest text-(--text-secondary) border-b border-(--surface-border) pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Resume() {
  return (
    <PageLayout
      title={resume.name}
      backHref="/portfolio"
      backLabel="Back to Portfolio"
      readingWidth
    >
      <article className="resume space-y-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold">{resume.title}</p>
            <a
              href={resume.pdfHref}
              className="a11y-focus-ring inline-flex items-center gap-2 rounded-sm bg-(--accent) px-4 py-2 text-sm font-medium text-(--on-accent) transition-colors hover:bg-(--accent-dark) print:hidden"
            >
              <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
              Download as PDF
            </a>
          </div>
          <ul className="resume-contact flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <li>
              <EmailLink className={linkClass} />
            </li>
            {resume.contact.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass} {...externalLinkProps(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">{resume.summary}</p>
          <p className="text-sm text-(--text-secondary)">
            Updated <time dateTime={resumeLastUpdated}>{formatPostDate(resumeLastUpdated)}</time>
          </p>
        </div>

        <ResumeSection title="Experience">
          {resume.experience.map((job) => (
            <div key={`${job.role}-${job.dates}`} className="space-y-1">
              <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="font-semibold">
                  {job.role}{' '}
                  <span className="font-normal text-(--text-secondary)">— {job.org}</span>
                </h3>
                <p className="text-sm text-(--text-secondary) sm:shrink-0 sm:whitespace-nowrap">
                  {job.dates}
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Products">
          <ul className="space-y-2 leading-relaxed">
            {resume.products.map((product) => (
              <li key={product.title}>
                <span className="font-semibold">{product.title}</span> — {product.summary}{' '}
                <a
                  href={product.link.href}
                  className={linkClass}
                  {...externalLinkProps(product.link.href)}
                >
                  {product.link.label}
                </a>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Awards">
          <ul className="space-y-1 leading-relaxed">
            {resume.awards.map((award) => (
              <li key={award.name}>
                <span className="text-(--text-secondary)">{award.years.join(', ')}</span>{' '}
                {award.name}, {award.issuer}
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Skills">
          <dl className="space-y-1 leading-relaxed">
            {resume.skills.map((group) => (
              <div key={group.category} className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">{group.category}:</dt>
                <dd>{group.items}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>
      </article>
    </PageLayout>
  );
}
