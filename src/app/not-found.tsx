import { headers } from 'next/headers';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import { getSiteNavItems } from '@/config/site-nav';
import { projects } from '@/data/projects';

// not-found.tsx gets no params, so the path comes from the x-pathname header set in middleware.
export default async function NotFound() {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const devotionMoved = pathname.startsWith('/blog/') || pathname.startsWith('/daily-word');
  const featured = projects.flatMap((project) => {
    const [link] = project.links;
    return project.featured && link ? [{ ...project, href: link.href }] : [];
  });

  return (
    <PageLayout title="Page not found">
      <p className="leading-relaxed text-(--text-secondary)">
        {pathname ? (
          <>
            There is nothing at <code className="text-(--text-primary)">{pathname}</code>.
          </>
        ) : (
          'There is nothing at this address.'
        )}{' '}
        It may have moved, or the link may be wrong.
      </p>
      {devotionMoved && (
        <p className="leading-relaxed">
          The daily devotion series moved to{' '}
          <a href="https://morningportion.com" className="text-(--accent) hover:underline">
            morningportion.com
          </a>
          .
        </p>
      )}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Around the site</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {getSiteNavItems().map((item) => (
            <LinkCard key={item.href} title={item.label} href={item.href} headingLevel="h3" />
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {featured.map((project) => (
            <LinkCard
              key={project.id}
              title={project.title}
              href={project.href}
              description={project.summary}
              headingLevel="h3"
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
