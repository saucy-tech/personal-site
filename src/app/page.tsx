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
      <div className="space-y-6 w-full max-w-xl mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <div className="space-y-3">
          <div className="px-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              Writing
            </p>
          </div>

          {latest && (
            <LinkCard
              key="latest-blog"
              title={latest.title}
              cardTitle={latest.cardTitle}
              href={`/blog/${latest.slug}`}
              icon={<span className="text-2xl">📝</span>}
              eyebrow="Latest Article"
              meta={[latest.categoryLabel, formatDate(new Date(latest.date))].join(' • ')}
            />
          )}
          <LinkCard
            key="blog-home"
            title="Browse All Articles"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
            eyebrow="Archive"
            meta={`${posts.length} posts`}
          />
          <SubscribeCard
            title="Subscribe to The Daily Word"
            meta="Free email updates"
            description={undefined}
            align="center"
          />
        </div>

        <div className="space-y-3">
          <div className="px-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              More
            </p>
          </div>

          <LinkCard
            key="talks-sermons"
            title="Talks & Sermons"
            href="/talks"
            icon={<span className="text-2xl">🎤</span>}
            eyebrow="Teaching"
            meta="Messages and notes"
          />
          <LinkCard
            key="my-projects"
            title="Projects & Contributions"
            href="/projects"
            icon={<span className="text-2xl">🚀</span>}
            eyebrow="Building"
            meta="Software and experiments"
          />
          <LinkCard
            key="support-my-work"
            title="Support My Work"
            href="/support"
            icon={<span className="text-2xl">❤️</span>}
            eyebrow="Support"
            meta="If you want to help"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center">
          <p className="text-sm text-[var(--text-secondary)]">Also around the site</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link href="/bitcoin" className="text-[var(--accent)] transition hover:text-white">
              Bitcoin
            </Link>
            <Link href="/links" className="text-[var(--accent)] transition hover:text-white">
              Favorite Links
            </Link>
            <a
              href="https://www.youtube.com/@TruthChapelUPC/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] transition hover:text-white"
            >
              Church Livestream
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
