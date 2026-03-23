import Image from 'next/image';

import LinkCard from '@/components/LinkCard';
import Profile from '@/components/Profile';
import Section from '@/components/Section';
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
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <Profile {...profileData} />
        <SocialBar socials={socialLinks} />

        <Section title="Writing" emoji="✍️">
          <div className="grid gap-4 md:grid-cols-2">
            {latest && (
              <LinkCard
                key="latest-blog"
                title={latest.title}
                cardTitle={latest.cardTitle}
                href={`/blog/${latest.slug}`}
                icon={<span className="text-2xl">📝</span>}
                eyebrow={`Latest ${latest.categoryLabel}`}
                meta={[formatDate(new Date(latest.date)), latest.series]
                  .filter(Boolean)
                  .join(' • ')}
                description={latest.excerpt}
                align="left"
                className="md:col-span-2"
              />
            )}
            <LinkCard
              key="blog-home"
              title="Browse All Articles"
              href="/blog"
              icon={<span className="text-2xl">📚</span>}
              eyebrow="Archive"
              meta={`${posts.length} posts and growing`}
              description="Daily Word entries, biblical reflections, and essays in one organized archive."
              align="left"
            />
            <SubscribeCard />
            <LinkCard
              key="talks-sermons"
              title="Talks & Sermons"
              href="/talks"
              icon={<span className="text-2xl">🎤</span>}
              eyebrow="Teaching"
              description="Messages, studies, and speaking notes."
              align="left"
            />
            <LinkCard
              key="my-projects"
              title="Projects & Contributions"
              href="/projects"
              icon={<span className="text-2xl">🚀</span>}
              eyebrow="Building"
              description="Experiments, software, and work in public."
              align="left"
            />
          </div>
        </Section>

        <Section title="Explore" emoji="🌐">
          <div className="grid gap-4 md:grid-cols-2">
            <LinkCard
              key="curious-bitcoin"
              title="Curious About Bitcoin?"
              href="/bitcoin"
              icon={<span className="text-2xl">₿</span>}
              eyebrow="Start here"
              description="A practical introduction if you are just getting interested."
              align="left"
            />
            <LinkCard
              key="bitcoin-links"
              title="Bitcoin Links"
              href="/links"
              icon={<span className="text-2xl">🔗</span>}
              eyebrow="Resources"
              description="Favorite trackers, calculators, and dashboards."
              align="left"
            />
            <LinkCard
              key="find-hope-church"
              title="Find Hope at My Church"
              href="https://www.youtube.com/@TruthChapelUPC/streams"
              icon={<span className="text-2xl">⛪</span>}
              eyebrow="Watch"
              description="Livestreams and teaching from Truth Chapel."
              align="left"
              className="md:col-span-2"
            />
          </div>
        </Section>

        <Section title="Connect" emoji="❤️">
          <div className="grid gap-4">
            <LinkCard
              key="support-my-work"
              title="Support My Work"
              href="/support"
              icon={<span className="text-2xl">❤️</span>}
              eyebrow="Support"
              description="If the writing or projects are useful, here is how to help keep them going."
              align="left"
            />
          </div>
        </Section>
      </div>
    </main>
  );
}
