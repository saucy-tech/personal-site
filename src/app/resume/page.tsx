import type { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
import { resume, resumeLastUpdated } from '@/data/resume';

const RESUME_DESCRIPTION =
  'Brandon Sauceda’s résumé: IT Development Manager at the Georgia Department of Agriculture and independent software engineer behind Saucy Tech. Experience, products, awards, and skills, with a PDF download.';

export const metadata: Metadata = {
  title: 'Résumé',
  description: RESUME_DESCRIPTION,
  alternates: { canonical: '/resume' },
};

const linkClass = 'a11y-focus-ring text-(--accent) underline underline-offset-4';

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
          <p className="text-lg font-semibold">{resume.title}</p>
          <ul className="resume-contact flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {resume.contact.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">{resume.summary}</p>
          <p className="text-sm text-(--text-secondary)">
            Updated {resumeLastUpdated} ·{' '}
            <a href={resume.pdfHref} className={linkClass}>
              Download as PDF
            </a>
          </p>
        </div>

        <ResumeSection title="Experience">
          {resume.experience.map((job) => (
            <div key={`${job.role}-${job.dates}`} className="space-y-1">
              <h3 className="font-semibold">
                {job.role} <span className="font-normal text-(--text-secondary)">— {job.org}</span>
              </h3>
              <p className="text-sm text-(--text-secondary)">{job.dates}</p>
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
                <a href={product.link.href} className={linkClass}>
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
