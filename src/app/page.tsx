import Image from 'next/image';
import Link from 'next/link';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import Section from '@/components/Section';
import SocialBar from '@/components/SocialBar';
import SubscribeForm from '@/components/SubscribeForm';
import { formatPostDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/utils/constants';

export default async function Home() {
  const profileData = {
    name: 'Brandon',
    username: '',
    bio: 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin',
    imageSrc: '/family-photo.jpeg',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };

  return (
    <main className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-6 w-full max-w-lg mx-auto">
        <Profile {...profileData} />
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
            title="Browse the Blog"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
            eyebrow="Blog"
            meta={`${posts.length} posts`}
          />
          <LinkCard
            key="my-projects"
            title="Projects & Contributions"
            href="/projects"
            icon={<span className="text-2xl">🚀</span>}
            eyebrow="Portfolio"
            meta="Software and experiments"
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
          <Section title="Subscribe to The Daily Word" emoji="✉️">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              The Daily Word delivers a short scripture reflection to your inbox every weekday
              morning. Rooted in weekly Sunday School lessons, each post is a 2-minute read designed
              to start your day in the Word. Free, always.
            </p>
            <SubscribeForm />
          </Section>
        </div>

        <div className="text-center text-sm">
          <Link href="/support" className="text-[var(--accent)] transition hover:text-white">
            Support my work
          </Link>
        </div>
      </div>
    </main>
  );
}
