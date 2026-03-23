import Image from 'next/image';
import Link from 'next/link';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import SocialBar from '@/components/SocialBar';
import SubscribeCard from '@/components/SubscribeCard';
import { formatDate } from '@/utils/helpers';
import { getAllPostsMeta } from '@/utils/posts';

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

  return (
    <main className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <div className="space-y-6 w-full max-w-lg mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <div className="space-y-3">
          <div className="px-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              Blog
            </p>
          </div>

          {latest && (
            <LinkCard
              key="latest-blog"
              title={latest.title}
              cardTitle={latest.cardTitle}
              href={`/blog/${latest.slug}`}
              icon={<span className="text-2xl">📝</span>}
              eyebrow="Latest Reflection"
              meta={[latest.categoryLabel, formatDate(new Date(latest.date))].join(' • ')}
            />
          )}
          <SubscribeCard
            title="Subscribe to The Daily Word"
            meta="Free email updates"
            description={undefined}
            align="center"
          />
          <LinkCard
            key="blog-home"
            title="Browse the Archive"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
            eyebrow="Archive"
            meta={`${posts.length} posts`}
          />
        </div>

        <div className="space-y-3">
          <div className="px-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              Portfolio
            </p>
          </div>

          <LinkCard
            key="my-projects"
            title="Projects & Contributions"
            href="/projects"
            icon={<span className="text-2xl">🚀</span>}
            eyebrow="Building"
            meta="Software and experiments"
          />
        </div>

        <div className="space-y-3">
          <div className="px-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              Passions
            </p>
          </div>

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
