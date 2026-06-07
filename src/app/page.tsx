import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import Section from '@/components/Section';
import SocialBar from '@/components/SocialBar';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';
import { getSiteJsonLd } from '@/utils/structured-data';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default async function Home() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
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

  const posts = getAllPostsMeta();
  const latest = posts[0];

  const jsonLd = getSiteJsonLd({
    authorName: 'Brandon',
    authorImagePath: '/headshot.jpeg',
    sameAs: [
      'https://x.com/Saucy_Tech',
      'https://github.com/saucy-tech',
      'https://primal.net/p/nprofile1qqsvzs8gfntzjs2wg8670nrfy64h44zy69kc3r8rp5wd7kw6t6njsassf62c7',
    ],
  });

  return (
    <div className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <script
        suppressHydrationWarning
        type="application/ld+json"
        {...(nonce ? { nonce } : {})}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-6 w-full max-w-lg mx-auto">
        <div className="space-y-2">
          <Profile {...profileData} />
          <p className="text-center text-sm leading-relaxed text-(--text-secondary)">
            Independent developer. My own products, plus a few client projects a year.
          </p>
        </div>
        <SocialBar socials={socialLinks} />

        <div className="space-y-3">
          {latest && (
            <LinkCard
              key="latest-blog"
              title={latest.title}
              cardTitle={latest.cardTitle}
              href={`/blog/${latest.slug}`}
              icon={<span className="text-2xl">📝</span>}
              eyebrow="Latest Post"
              meta={[latest.categoryLabel, formatPostDate(latest.date)].join(' • ')}
            />
          )}
          <LinkCard
            key="blog-home"
            title="Writing"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
            eyebrow="Blog"
            meta={`${posts.length} posts`}
          />
          <LinkCard
            key="field-notes"
            title="What I'm Into Right Now"
            href="/field-notes"
            icon={<span className="text-2xl">📓</span>}
            eyebrow="Field notes"
            meta="Tools, tech, and gear I'm using this season"
          />
          <LinkCard
            key="my-projects"
            title="Projects"
            href="/portfolio"
            icon={<span className="text-2xl">🚀</span>}
            eyebrow="Projects"
            meta="Products, track record, talks, and résumé"
          />
          <LinkCard
            key="work-with-me"
            title="Client work"
            href="/about#work-with-me"
            icon={<span className="text-2xl">🤝</span>}
            eyebrow="Client work"
            meta="A few projects a year"
          />
          <LinkCard
            key="bitcoin"
            title="Why Bitcoin Matters to Me"
            href="/bitcoin"
            icon={<span className="text-2xl">₿</span>}
            eyebrow="Bitcoin"
            meta="Where I would point someone who is curious"
          />
          <LinkCard
            key="church"
            title="Find Hope at My Church"
            href="https://www.youtube.com/@TruthChapelUPC/streams"
            icon={<span className="text-2xl">⛪</span>}
            eyebrow="Faith"
            meta="Truth Chapel livestreams and teaching"
          />
          <Section title="Subscribe to Saucy.tech Updates" emoji="✉️">
            <p className="text-sm leading-relaxed text-(--text-secondary)">
              New essays, field notes, and writing, straight to your inbox.
            </p>
            <SubscribeForm />
          </Section>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/support"
            className="a11y-focus-ring rounded-xs text-(--accent) transition hover:text-white"
          >
            Support my work
          </Link>
        </div>
      </div>
    </div>
  );
}
