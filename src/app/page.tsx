import Profile from '@/components/Profile';
import SocialBar from '@/components/SocialBar';
import Section from '@/components/Section';
import LinkCard from '@/components/LinkCard';
import Image from 'next/image';

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
      href: 'https://substack.com/@saucybtc',
      icon: (
        <Image 
          src="/icons/substack-logo.svg" 
          width={32} 
          height={32} 
          alt="Substack logo" 
          quality={100}
        />
      ),
      label: 'Substack',
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

          <LinkCard
            key="what-im-into"
            title="What I’m Currently Into"
            href="/explore"
            icon={<span className="text-2xl">🔍</span>}
          />
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
            key="subscribe-blog"
            title="Subscribe to Blog"
            href="https://saucybtc.substack.com/subscribe?simple=true&free=true"
            icon={<span className="text-2xl">📬</span>}
          />
          <LinkCard
            key="past-blogs"
            title="Past Blogs"
            href="https://saucybtc.substack.com/archive"
            icon={<span className="text-2xl">📝</span>}
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
