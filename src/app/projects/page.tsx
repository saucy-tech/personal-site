import { Metadata } from 'next';

import PageLayout from '@/components/PageLayout';
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
        url: '/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Projects`,
      },
    ],
  },
};

export default function Projects() {
  return (
    <PageLayout title="Projects & Contributions">
      <section className="flex flex-col gap-8 items-center min-h-[40vh]">
        {/* Portfolio Project Card */}
        <div className="w-full max-w-xl bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6 mb-2">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            This Portfolio Site{' '}
            <span className="text-xs bg-green-500/80 text-white px-2 py-1 rounded align-middle">
              Launched
            </span>
          </h2>
          <p className="mb-2 text-base text-[var(--text-secondary)]">
            Built with Next.js (App Router), React, and Tailwind CSS, and integrating the
            @getalby/sdk Nostr Wallet Connect for native Lightning payments. The site features a
            custom blog with MDX support, responsive design, dark mode, and subtle UI animations. I
            focused on accessibility, performance, and a clean, modern user experience. All content
            and components are managed locally—no external CMS or templates.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
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

        {/* Lightning Tip Jar Project Card */}
        <div className="w-full max-w-xl bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6 mb-2">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            Lightning Tip Jar{' '}
            <span className="text-xs bg-green-500/80 text-white px-2 py-1 rounded align-middle">
              Launched
            </span>
          </h2>
          <p className="mb-2 text-base text-[var(--text-secondary)]">
            A Lightning tipping interface template from ATL BitLab&apos;s workshop, enhanced with
            @getalby/sdk integration for seamless NWC support. Users can select sats, generate
            invoices, and tip via Lightning.
          </p>
          <div className="flex flex-wrap gap-4">
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

        {/* SAT Sort Project Card */}
        <div className="w-full max-w-xl bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6 mb-2">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            SAT Sort{' '}
            <span className="text-xs bg-yellow-400/80 text-black px-2 py-1 rounded align-middle">
              Coming Soon
            </span>
          </h2>
          <p className="mb-2 text-base text-[var(--text-secondary)]">
            A self-hosted, privacy-focused Bitcoin lot management tool for individuals. SAT Sort
            helps you track, select, and report tax lots using IRS-compliant High-In-First-Out
            (HIFO) cost-basis selection, estimate on-chain fees, and manage multiple wallets—all
            locally, with no authentication or cloud storage.
          </p>
          <ul className="list-disc pl-6 text-sm text-[var(--text-secondary)] mb-2">
            <li>HIFO Engine: Automate lot selection to minimize taxable gains when selling BTC.</li>
            <li>CSV Import, fee estimation, multi-wallet support, exportable reports, and more.</li>
            <li>All data is stored locally—no accounts, no cloud.</li>
          </ul>
          <span className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed opacity-70">
            App Launching Soon
          </span>
        </div>

        {/* Abbot Project Card */}
        <div className="w-full max-w-xl bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6 mb-2">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            Abbot{' '}
            <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded align-middle">
              Contributor
            </span>
          </h2>
          <p className="mb-2 text-base text-[var(--text-secondary)]">
            Open-source Bitcoin/Lightning automation bot for Nostr and Telegram. Contributed to core
            features and improvements.
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

        {/* Plebnet Website Contribution Card */}
        <div className="w-full max-w-xl bg-white/10 rounded-lg shadow-lg border border-[var(--accent-border)] p-6 mb-2">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            Plebnet Website{' '}
            <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded align-middle">
              Contributor
            </span>
          </h2>
          <p className="mb-2 text-base text-[var(--text-secondary)]">
            Contributor to the Plebnet website, an open-source project for the Plebnet community.
            Helped improve site features and content for the broader Lightning Network community.
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
      </section>
    </PageLayout>
  );
}
