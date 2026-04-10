import PageLayout from '@/components/PageLayout';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Projects & Contributions',
  description: `Explore Brandon's projects and open-source contributions.`,
  openGraph: {
    title: 'Projects',
    description: `Explore Brandon's projects, apps, and experiments.`,
    url: `${SITE_URL}/projects`,
    type: 'website',
    images: [
      {
        url: '/family-photo.jpeg',
        width: 1024,
        height: 1024,
        alt: `${SITE_NAME} - Projects`,
      },
    ],
  },
};

function Tag({ label }: { label: string }) {
  return (
    <span className="text-xs bg-white/10 text-[var(--text-secondary)] border border-[var(--accent-border)] px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

export default function Projects() {
  return (
    <PageLayout title="Projects & Contributions">
      <section className="flex flex-col gap-10 items-center min-h-[40vh]">
        {/* --- My Projects --- */}
        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-[var(--text-secondary)] mb-4 pl-1">
            My Projects
          </h2>
          <div className="flex flex-col gap-6">
            {/* Portfolio Site */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">This Portfolio Site</h3>
                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">
                  Launched
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="Next.js" />
                <Tag label="React" />
                <Tag label="Tailwind CSS" />
                <Tag label="MDX" />
                <Tag label="Lightning" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                Built with Next.js (App Router), React, and Tailwind CSS, integrating the
                @getalby/sdk Nostr Wallet Connect for native Lightning payments. Features a custom
                blog with MDX support, responsive design, dark mode, and subtle UI animations. All
                content and components are managed locally—no external CMS or templates.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/saucy-tech/personal-site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
                >
                  GitHub Repo
                </a>
                <a
                  href="/support#lightning-tip-jar"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)] transition"
                >
                  Try Lightning Tip Jar
                </a>
              </div>
            </div>

            {/* Work Time Visualizer */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">Work Time Visualizer</h3>
                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">
                  Launched
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="Rust" />
                <Tag label="Win32" />
                <Tag label="Windows" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                A lightweight Windows taskbar widget built in Rust using the Win32 API. Displays
                daily and weekly work-time progress as colored block bars, updating every 15
                seconds. Features configurable work hours, 7 customizable colors, dark/light mode
                detection via the Windows registry, weekend auto-detection, and a single-instance
                guard.
              </p>
              <a
                href="https://github.com/saucy-tech/work-time-visualizer-rust"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
              >
                GitHub Repo
              </a>
            </div>

            {/* Lightning Tip Jar */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">Lightning Tip Jar</h3>
                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">
                  Launched
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="React" />
                <Tag label="Lightning" />
                <Tag label="NWC" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                A Lightning tipping interface template from ATL BitLab&apos;s workshop, enhanced
                with @getalby/sdk integration for seamless NWC support. Users can select sats,
                generate invoices, and tip via Lightning.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/saucy-tech/lntipjar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
                >
                  GitHub Repo
                </a>
                <a
                  href="/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
                >
                  Live Demo
                </a>
              </div>
            </div>

            {/* Roll to Eat */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">Roll to Eat</h3>
                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">
                  Launched
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="Next.js" />
                <Tag label="React" />
                <Tag label="TypeScript" />
                <Tag label="Tailwind CSS" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                A playful dinner-decision app that rolls two d20s to pair a cuisine with a main
                ingredient. Built with Next.js and React, it supports custom tables saved in the
                browser, reroll workflows with lockable dice, local roll history, and shareable
                result pages.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/saucy-tech/roll-to-eat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
                >
                  GitHub Repo
                </a>
                <a
                  href="https://roll-to-eat.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- Open Source Contributions --- */}
        <div className="w-full max-w-xl">
          <h2 className="text-sm uppercase tracking-widest text-[var(--text-secondary)] mb-4 pl-1">
            Open Source Contributions
          </h2>
          <div className="flex flex-col gap-6">
            {/* Abbot */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">Abbot</h3>
                <span className="text-xs bg-purple-500/80 text-white px-2 py-0.5 rounded-full">
                  Contributor
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="Python" />
                <Tag label="Bitcoin" />
                <Tag label="Lightning" />
                <Tag label="Nostr" />
                <Tag label="Telegram" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                Open-source Bitcoin/Lightning automation bot for Nostr and Telegram. Contributed to
                core features and improvements.
              </p>
              <a
                href="https://github.com/ATLBitLab/abbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
              >
                GitHub Repo
              </a>
            </div>

            {/* Plebnet Website */}
            <div className="bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-semibold">Plebnet Website</h3>
                <span className="text-xs bg-purple-500/80 text-white px-2 py-0.5 rounded-full">
                  Contributor
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag label="Next.js" />
                <Tag label="Lightning" />
              </div>
              <p className="mb-4 text-base text-[var(--text-secondary)]">
                Contributor to the Plebnet website, an open-source project for the Plebnet
                community. Helped improve site features and content for the broader Lightning
                Network community.
              </p>
              <a
                href="https://github.com/plebnet-dev/website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition"
              >
                GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
