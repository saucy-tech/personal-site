/**
 * Portfolio data (`/portfolio`) — apps, tools, OSS contributions, and talks.
 * Edit here to update copy. Bump `projectsLastUpdated` when you revise.
 */

export const projectsLastUpdated = '2026-05-22';

export type ProjectGroup = 'apps' | 'tools' | 'open-source';

export type ProjectStatus = 'launched' | 'contributor';

export interface ProjectLink {
  href: string;
  label: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  group: ProjectGroup;
  title: string;
  status: ProjectStatus;
  tags: string[];
  blurb: string;
  links: ProjectLink[];
  image?: ProjectImage;
}

export interface Talk {
  date: string;
  title: string;
  venue: string;
  link?: ProjectLink;
}

export const projects: Project[] = [
  // --- Apps ---
  {
    id: 'gda-public-systems',
    group: 'apps',
    title: 'Georgia DGA — Public Web & GIS Systems',
    status: 'launched',
    tags: ['Product leadership', 'GIS', 'Azure', 'C#', 'Public sector'],
    blurb:
      'IT Development Manager for state agency systems serving 50,000+ monthly users. Owned public-facing web roadmap, cut citizen wait times 40%, led enterprise ArcGIS program (Esri SAG award), and built cross-agency APIs for five partner organizations. Details available on request — no public repo.',
    links: [{ href: '/Brandon_Sauceda_Resume.pdf', label: 'Résumé (PDF)' }],
  },
  {
    id: 'portfolio-site',
    group: 'apps',
    title: 'This Portfolio Site',
    status: 'launched',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'MDX', 'Lightning'],
    blurb:
      'Built with Next.js (App Router), React, and Tailwind CSS, integrating @getalby/sdk Nostr Wallet Connect for native Lightning payments. Custom MDX blog, responsive design, dark mode, subtle animations. All content and components managed locally — no external CMS.',
    links: [
      { href: 'https://github.com/saucy-tech/personal-site', label: 'GitHub Repo' },
      { href: '/support#lightning-tip-jar', label: 'Try Lightning Tip Jar' },
    ],
  },
  {
    id: 'morning-portion',
    group: 'apps',
    title: 'The Morning Portion',
    status: 'launched',
    tags: ['Devotion', 'Next.js', 'MDX', 'Email'],
    blurb:
      'A weekday scripture reflection series — a 2-minute read each morning, rooted in Sunday School lessons. Now its own site with its own Kit list. Continuation of The Daily Word.',
    links: [
      { href: 'https://morningportion.com', label: 'Visit Site' },
      { href: 'https://github.com/saucy-tech/the-morning-portion', label: 'GitHub Repo' },
    ],
    image: {
      src: '/images/morning-portion-logo.png',
      alt: 'The Morning Portion logo',
      width: 1254,
      height: 1254,
    },
  },
  {
    id: 'daily-word',
    group: 'apps',
    title: 'The Daily Word (Archive)',
    status: 'launched',
    tags: ['Devotion', 'MDX', 'Archive'],
    blurb:
      'The original devotion archive published on this site through May 2026. New entries now publish at The Morning Portion on its own site.',
    links: [
      { href: '/daily-word', label: 'Browse Archive' },
      { href: 'https://morningportion.com', label: 'Read New Entries' },
    ],
  },
  {
    id: 'roll-to-eat',
    group: 'apps',
    title: 'Roll to Eat',
    status: 'launched',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    blurb:
      'A playful dinner-decision app that rolls two d20s to pair a cuisine with a main ingredient. Custom tables saved in the browser, reroll workflows with lockable dice, local roll history, and shareable result pages.',
    links: [
      { href: 'https://github.com/saucy-tech/roll-to-eat', label: 'GitHub Repo' },
      { href: 'https://roll-to-eat.vercel.app/', label: 'Live Demo' },
    ],
  },
  {
    id: 'lightning-tip-jar',
    group: 'apps',
    title: 'Lightning Tip Jar',
    status: 'launched',
    tags: ['React', 'Lightning', 'NWC'],
    blurb:
      "A Lightning tipping interface from ATL BitLab's workshop, enhanced with @getalby/sdk for seamless Nostr Wallet Connect support. Pick sats, generate an invoice, tip via Lightning.",
    links: [
      { href: 'https://github.com/saucy-tech/lntipjar', label: 'GitHub Repo' },
      { href: '/support', label: 'Live Demo' },
    ],
  },

  // --- Tools ---
  {
    id: 'work-time-visualizer',
    group: 'tools',
    title: 'Work Time Visualizer',
    status: 'launched',
    tags: ['Rust', 'Win32', 'Windows'],
    blurb:
      'A lightweight Windows taskbar widget built in Rust using the Win32 API. Daily and weekly work-time progress as colored block bars, refreshed every 15 seconds. Configurable hours, 7 colors, registry-driven dark/light mode, weekend auto-detect, single-instance guard.',
    links: [
      { href: 'https://github.com/saucy-tech/work-time-visualizer-rust', label: 'GitHub Repo' },
    ],
  },

  // --- Open Source ---
  {
    id: 'warp',
    group: 'open-source',
    title: 'Warp',
    status: 'contributor',
    tags: ['Terminal', 'AI', 'Open Source'],
    blurb:
      'Contributed to Warp, the agentic terminal I use daily. Fixed repo-picker UX so multi-repo workflows are smoother — see PR #9451.',
    links: [
      { href: 'https://github.com/warpdotdev/warp/pull/9451', label: 'PR #9451' },
      { href: 'https://github.com/warpdotdev/warp/issues/9439', label: 'Issue #9439' },
    ],
  },
  {
    id: 'abbot',
    group: 'open-source',
    title: 'Abbot',
    status: 'contributor',
    tags: ['Python', 'Bitcoin', 'Lightning', 'Nostr', 'Telegram'],
    blurb:
      'Open-source Bitcoin/Lightning automation bot for Nostr and Telegram. Contributed to core features and improvements.',
    links: [{ href: 'https://github.com/ATLBitLab/abbot', label: 'GitHub Repo' }],
  },
  {
    id: 'plebnet-website',
    group: 'open-source',
    title: 'Plebnet Website',
    status: 'contributor',
    tags: ['Next.js', 'Lightning'],
    blurb:
      'Contributor to the Plebnet website — site features and content for the broader Lightning Network community.',
    links: [{ href: 'https://github.com/plebnet-dev/website', label: 'GitHub Repo' }],
  },
];

export interface Publication {
  year: string;
  title: string;
  venue: string;
  authors: string[];
  link?: ProjectLink;
}

export const talks: Talk[] = [
  {
    date: '2023-06-01',
    title: 'GIS Innovation in State Government',
    venue: 'Esri Southeast User Conference',
  },
  {
    date: '2025-03-26',
    title: 'The Price of Tomorrow',
    venue: 'Atlanta BitPlebs',
  },
];

export const publications: Publication[] = [
  {
    year: '2019',
    title: 'GIS Technology Utilization for Rapid Response Teams',
    venue: 'Centers for Disease Control and Prevention (CDC)',
    authors: ['Brandon Sauceda', 'CDC Collaborators'],
    link: {
      href: 'https://www.cdc.gov/nceh/hsb/disaster/rrt.htm',
      label: 'CDC Rapid Response Teams',
    },
  },
];

export const projectGroupLabels: Record<ProjectGroup, string> = {
  apps: 'My Apps',
  tools: 'Tools',
  'open-source': 'Open Source Contributions',
};
