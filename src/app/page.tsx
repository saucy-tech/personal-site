import Profile from "@/components/Profile";
import SocialBar from "@/components/SocialBar";
import Section from "@/components/Section";
import LinkCard from "@/components/LinkCard";
import Image from "next/image";
import {
  CodeBracketIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  // Profile data
  const profileData = {
    name: "SaucyTech",
    username: "SaucyTech",
    bio: "Love Jesus, Explore Ideas, Create Things, Save in Bitcoin",
    imageSrc: "/family-photo.jpeg",
  };

  // Social media links
  const socialLinks = [
    {
      href: "https://x.com/Saucy_Tech",
      icon: (
        <Image
          src="/icons/x-logo.svg"
          width={32}
          height={32}
          alt="X (Twitter)"
        />
      ),
      label: "X",
    },
    {
      href: "https://github.com/saucy-tech",
      icon: (
        <Image
          src="/icons/github-logo.svg"
          width={32}
          height={32}
          alt="GitHub"
        />
      ),
      label: "GitHub",
    },
    {
      href: "https://primal.net/p/nprofile1qqsvzs8gfntzjs2wg8670nrfy64h44zy69kc3r8rp5wd7kw6t6njsassf62c7",
      icon: (
        <Image src="/icons/nostr-logo.svg" width={32} height={32} alt="Nostr" />
      ),
      label: "Nostr",
    },
    {
      href: "https://substack.com/@saucybtc",
      icon: (
        <Image
          src="/icons/substack-logo.svg"
          width={32}
          height={32}
          alt="Substack"
        />
      ),
      label: "Substack",
    },
  ];

  return (
    <main className="pt-4 pb-6 px-4 md:px-8 flex flex-col items-center">
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <Section title="Latest" emoji="🔥">
          <LinkCard
            key="bitcoin-strategy"
            title="Bitcoin Strategy 2024"
            href="https://example.com/bitcoin-strategy"
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
          />

          <LinkCard
            key="read-article"
            title="Read Article"
            href="https://example.com/bitcoin-strategy-article"
            icon={<DocumentTextIcon className="h-6 w-6" />}
          />

          <LinkCard
            key="watch-presentation"
            title="Watch Presentation"
            href="https://youtube.com/example"
            icon={<VideoCameraIcon className="h-6 w-6" />}
          />
        </Section>

        <Section title="Projects" emoji="💻">
          <LinkCard
            key="portfolio-website"
            title="Portfolio Website"
            href="https://yourportfolio.com"
            icon={<CodeBracketIcon className="h-6 w-6" />}
          />

          <LinkCard
            key="github-repos"
            title="GitHub Repositories"
            href="https://github.com/yourusername"
            icon={<CodeBracketIcon className="h-6 w-6" />}
          />

          <LinkCard
            key="side-project"
            title="Current Side Project"
            href="https://example.com/side-project"
            icon={<LightBulbIcon className="h-6 w-6" />}
          />
        </Section>
      </div>
    </main>
  );
}
