import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import Section from '@/components/Section';
import SocialBar from '@/components/SocialBar';
import SubscribeForm from '@/components/SubscribeForm';

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
    <div className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <div className="space-y-6 w-full max-w-lg mx-auto">
        <div className="space-y-2">
          <Profile {...profileData} />
          <p className="text-center text-sm leading-relaxed text-(--text-secondary)">
            Software engineer. I build my own products and take on a few client projects each year.
          </p>
        </div>
        <SocialBar socials={socialLinks} />

        <div className="space-y-3">
          <LinkCard
            key="morning-portion"
            title="The Morning Portion"
            href="https://morningportion.com"
            imageSrc="/icons/morning-portion.png"
            eyebrow="Flagship product"
            meta="Weekday scripture reflections, published at morningportion.com"
          />
          <LinkCard
            key="train-every-day"
            title="Train Every Day"
            href="https://train-every-day-demo.brandonsauceda.workers.dev/"
            imageSrc="/icons/train-every-day.png"
            eyebrow="Flagship product"
            meta="Offline-first workout logger on Cloudflare Workers. Open the sanitized demo"
          />
          <LinkCard
            key="my-projects"
            title="Projects"
            href="/portfolio"
            icon={<span className="text-2xl">🚀</span>}
            eyebrow="Selected work"
            meta="Products, public-sector systems, open source, and résumé"
          />
          <LinkCard
            key="work-with-me"
            title="Client work"
            href="/about#work-with-me"
            icon={<span className="text-2xl">🤝</span>}
            eyebrow="Client work"
            meta="Web apps and focused product builds"
          />
          <LinkCard
            key="blog-home"
            title="Writing"
            href="/blog"
            icon={<span className="text-2xl">📚</span>}
            eyebrow="Essays & archive"
            meta="Personal essays and the earlier Daily Word archive"
          />
          <LinkCard
            key="field-notes"
            title="What I'm using now"
            href="/field-notes"
            icon={<span className="text-2xl">📓</span>}
            eyebrow="Field notes"
            meta="Tools, tech, and gear I'm using now"
          />
          <LinkCard
            key="bitcoin"
            title="Why I save in Bitcoin"
            href="/bitcoin"
            icon={<span className="text-2xl">₿</span>}
            eyebrow="Bitcoin"
            meta="Where I'd point someone curious"
          />
          <LinkCard
            key="church"
            title="My church"
            href="https://www.youtube.com/@TruthChapelUPC/streams"
            icon={<span className="text-2xl">⛪</span>}
            eyebrow="Faith"
            meta="Truth Chapel livestreams and teaching"
          />
          <Section title="Subscribe to Saucy.Tech">
            <p className="text-sm leading-relaxed text-(--text-secondary)">
              Occasional notes on software, tools, and current projects.
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
