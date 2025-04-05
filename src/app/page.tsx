import Profile from '@/components/Profile';
import SocialBar from '@/components/SocialBar';
import Section from '@/components/Section';
import LinkCard from '@/components/LinkCard';
import Image from 'next/image';
import {
  CodeBracketIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
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
      icon: <Image src="/icons/x-logo.svg" width={32} height={32} alt="X (Twitter)" />,
      label: 'X',
    },
    {
      href: 'https://github.com/saucy-tech',
      icon: <Image src="/icons/github-logo.svg" width={32} height={32} alt="GitHub" />,
      label: 'GitHub',
    },
    {
      href: 'https://primal.net/p/nprofile1qqsvzs8gfntzjs2wg8670nrfy64h44zy69kc3r8rp5wd7kw6t6njsassf62c7',
      icon: <Image src="/icons/nostr-logo.svg" width={32} height={32} alt="Nostr" />,
      label: 'Nostr',
    },
    {
      href: 'https://substack.com/@saucybtc',
      icon: <Image src="/icons/substack-logo.svg" width={32} height={32} alt="Substack" />,
      label: 'Substack',
    },
  ];

  return (
    <main className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <Section title="Latest" emoji="🔥">
          <LinkCard
            key="writting-blog"
            title="Read or subscribe to my blog"
            href="https://example.com/bitcoin-strategy"
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
          />

          <LinkCard
            key="read-article"
            title="What I'm currently into"
            href="/explore"
            icon={<DocumentTextIcon className="h-6 w-6" />}
          />
        </Section>

        <Section title="Links" emoji="💻">
          <LinkCard
            key="truth-chapel"
            title="Need Hope? Check Out My Church"
            href="https://www.youtube.com/@TruthChapelUPC/streams"
            icon={<DocumentTextIcon className="h-6 w-6" />}
          />
          <LinkCard
            key="bitcoin-resources"
            title="Curious About Bitcoin?"
            href="/bitcoin"
            icon={<DocumentTextIcon className="h-6 w-6" />}
          />
          <LinkCard
            key="529"
            title="Support me"
            href=""
            icon={<CodeBracketIcon className="h-6 w-6" />}
          />
        </Section>
      </div>
    </main>
  );
}
