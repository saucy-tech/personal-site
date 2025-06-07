import Image from 'next/image';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import Section from '@/components/Section';
import SocialBar from '@/components/SocialBar';
import SubscribeCard from '@/components/SubscribeCard'; // Added SubscribeCard import
import { getAllPostsMeta } from '@/utils/posts';

export default async function Home() {
  // Profile data
  const profileData = {
    name: 'Brandon',
    username: '',
    bio: 'Love Jesus, Explore Ideas, Create Things, Save in Bitcoin',
    imageSrc: '/family-photo.jpeg',
  };

  // Social media links
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
    <main className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <Section title="Latest" emoji="🔥">
          {(() => {
            const latest = getAllPostsMeta()[0];
            return (
              <LinkCard
                key="latest-blog"
                title={latest ? latest.title : 'Blog'}
                cardTitle={latest?.cardTitle}
                href={latest ? `/blog/${latest.slug}` : '/blog'}
                icon={<span className="text-2xl">📝</span>}
              />
            );
          })()}
          <SubscribeCard />
          <LinkCard
            key="talks-sermons"
            title="Talks & Sermons"
            href="/talks"
            icon={<span className="text-2xl">🎤</span>}
          />
          <LinkCard
            key="my-projects"
            title="Projects & Contributions"
            href="/projects"
            icon={<span className="text-2xl">🚀</span>}
          />
        </Section>

        <Section title="Explore" emoji="🌐">
          <LinkCard
            key="blog-home"
            title="Blog"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
          />
          <LinkCard
            key="curious-bitcoin"
            title="Curious about Bitcoin?"
            href="/bitcoin"
            icon={<span className="text-2xl">₿</span>}
          />
          <LinkCard
            key="find-hope-church"
            title="Find Hope at My Church"
            href="https://www.youtube.com/@TruthChapelUPC/streams"
            icon={<span className="text-2xl">⛪</span>}
          />
        </Section>

        <Section title="Connect" emoji="❤️">
          <LinkCard
            key="support-my-work"
            title="Support My Work"
            href="/support"
            icon={<span className="text-2xl">❤️</span>}
          />
        </Section>
      </div>
    </main>
  );
}
