import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import { projects } from '@/data/projects';
import SocialBar from '@/components/SocialBar';

export const metadata: Metadata = {
  description:
    'Brandon Sauceda is a software engineer, independent builder, and creator of The Morning Portion.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default function Home() {
  const profileData = {
    name: 'Brandon',
    bio: 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin',
    imageSrc: '/headshot.jpeg',
  };

  const socialLinks = [
    {
      href: 'https://x.com/Saucy_Tech',
      icon: (
        <Image
          src="/icons/x-logo.svg"
          width={32}
          height={32}
          alt="X (Twitter) logo"
          quality={100}
        />
      ),
      label: 'X',
    },
    {
      href: 'https://github.com/saucy-tech',
      icon: (
        <Image
          src="/icons/github-logo.svg"
          width={32}
          height={32}
          alt="GitHub logo"
          quality={100}
        />
      ),
      label: 'GitHub',
    },
    {
      href: 'https://primal.net/p/nprofile1qqsvzs8gfntzjs2wg8670nrfy64h44zy69kc3r8rp5wd7kw6t6njsassf62c7',
      icon: (
        <Image
          src="/icons/nostr-logo.svg"
          width={32}
          height={32}
          alt="Nostr protocol logo"
          quality={100}
        />
      ),
      label: 'Nostr',
    },
    {
      href: 'https://discord.com/users/saucybtc',
      icon: (
        <Image
          src="/icons/discord-logo.svg"
          width={32}
          height={32}
          alt="Discord logo"
          quality={100}
        />
      ),
      label: 'Discord',
    },
  ];

  return (
    <div className="pt-6 pb-12 flex flex-col items-center">
      <div className="space-y-8 w-full max-w-4xl mx-auto">
        <div className="space-y-3 max-w-xl mx-auto">
          <Profile {...profileData} />
          <p className="text-center text-sm leading-relaxed text-(--text-secondary)">
            Software engineer. I build my own products and take on a few client projects each year.
          </p>
        </div>
        <SocialBar socials={socialLinks} />

        <section aria-labelledby="selected-products" className="space-y-6">
          <h2 id="selected-products" className="text-2xl font-semibold">
            Products I build and use
          </h2>
          <div className="grid gap-10 md:grid-cols-2">
            {projects
              .filter((project) => project.featured && project.preview)
              .map((project) => {
                const preview = project.preview;
                const link = project.links[0];
                if (!preview || !link) return null;
                return (
                  <article key={project.id} className="space-y-4">
                    <a
                      href={link.href}
                      {...(/^https?:\/\//.test(link.href)
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="a11y-focus-ring block rounded-sm"
                    >
                      <Image
                        src={preview.src}
                        alt={preview.alt}
                        width={preview.width}
                        height={preview.height}
                        sizes="(min-width: 768px) 432px, 100vw"
                        className="w-full h-auto rounded-sm border border-(--surface-border)"
                      />
                    </a>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="leading-relaxed">{project.tagline}</p>
                    <p className="text-(--text-secondary) leading-relaxed">{project.summary}</p>
                    <a
                      href={link.href}
                      {...(/^https?:\/\//.test(link.href)
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="a11y-focus-ring inline-block py-2 text-(--accent) underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </article>
                );
              })}
          </div>
        </section>

        <section aria-labelledby="explore" className="max-w-2xl mx-auto">
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
