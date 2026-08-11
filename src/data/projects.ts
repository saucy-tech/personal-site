/**
 * Portfolio data (`/portfolio`): products, tools, OSS contributions, and talks.
 * Edit here to update copy. Bump `projectsLastUpdated` when you revise.
 */

export const projectsLastUpdated = '2026-08-10';

export type ProjectGroup = 'apps' | 'tools' | 'open-source' | 'client-work' | 'track-record';

export type ProjectStatus = 'launched' | 'contributor';

export interface ProjectLink {
  href: string;
  label: string;
}

export interface Project {
  id: string;
  group: ProjectGroup;
  title: string;
  status: ProjectStatus;
  /** The products I actively build and use. Renders a Featured pill and sorts first. */
  featured?: boolean;
  tags: string[];
  blurb: string;
  links: ProjectLink[];
}

export interface Talk {
  date: string;
  title: string;
  venue: string;
  link?: ProjectLink;
}

export const projects: Project[] = [
  // --- Products ---
  {
    id: 'daily-word',
    group: 'apps',
    title: 'The Morning Portion',
    status: 'launched',
    featured: true,
    tags: ['Next.js 16', 'React 19', 'MDX', 'Tailwind CSS', 'Cloudflare Workers'],
    blurb:
      'A publishing product I write and run end to end: a weekday scripture reflection, an email broadcast to subscribers, and a podcast episode, shipped every weekday. Next.js 16 App Router with React 19, an MDX content pipeline (next-mdx-remote + gray-matter), and Tailwind typography, running on Cloudflare Workers through the OpenNext adapter. The archive through May 2026 still lives on this site. The repository is private; the published product is the artifact worth reading.',
    links: [{ href: 'https://morningportion.com', label: 'Visit morningportion.com' }],
  },
  {
    id: 'train-every-day',
    group: 'apps',
    title: 'Train Every Day',
    status: 'launched',
    featured: true,
    tags: ['Vanilla JS', 'PWA', 'Cloudflare Workers', 'KV', 'Offline-first'],
    blurb:
      'The workout logger I use on the gym floor every training day. Local-first: entries write to the device first and converge to Cloudflare KV through a commutative merge, so logging keeps working with no signal and a set is never lost to a failed request. Vanilla JavaScript with no framework, no build step, and no runtime dependencies, covered by a dependency-free test suite. Production sits behind Cloudflare Access and holds my own training record, so what you can open here is a separately sanitized build carrying fabricated data and no path back to the real store.',
    links: [
      { href: 'https://train-every-day-demo.brandonsauceda.workers.dev/', label: 'Open the demo' },
    ],
  },
  {
    id: 'sunday-school',
    group: 'apps',
    title: 'Sunday School',
    status: 'launched',
    featured: true,
    tags: ['Vanilla JS', 'PWA', 'Service worker', 'Offline-first', 'Cloudflare Workers'],
    blurb:
      'The lesson app I teach from on an iPad, in a classroom where the signal drops. A service worker precaches every lesson in the quarter, so the menu and the lesson open with no network at all; when that is not enough, any lesson or a whole quarter exports as one self-contained HTML file that opens from the Files app with no service worker involved. The menu, the lesson dates, and the badge on this Sunday are generated from the lesson files rather than hand-edited, so adding a lesson is dropping a file in a folder. No framework and no build step beyond a dependency-free Node script, covered by a test suite that runs on node --test. The lessons are written against paid curriculum and the real site sits behind Cloudflare Access, so what you can open here is a demo carrying three sample lessons written from scratch and none of the curriculum.',
    links: [
      {
        href: 'https://sunday-school-demo.brandonsauceda.workers.dev',
        label: 'Open the demo',
      },
    ],
  },
  {
    id: 'home-hive',
    group: 'apps',
    title: 'The Home Hive',
    status: 'launched',
    tags: ['Vanilla JS', 'PWA', 'Cloudflare Workers', 'KV', 'Cloudflare Access'],
    blurb:
      'The weekly preschool lesson plan, folded into the evening a family is already having. Preschool rooms are mixed-age, so every activity carries two levels: count to 11 for the class, and count to 20 and backwards for a kid past that. Seven games alongside it, every prompt spoken aloud so a pre-reader can play alone. Cloudflare Worker and KV behind Access, a PWA with no framework or build step, and a week is one JSON file. The real app is private; the demo carries an invented week.',
    links: [
      { href: 'https://home-hive-demo.brandonsauceda.workers.dev', label: 'Open the demo' },
      { href: 'https://github.com/saucy-tech/home-hive-demo', label: 'Demo repo' },
    ],
  },
  {
    id: 'feed-eggs',
    group: 'apps',
    title: 'Feed Eggs',
    status: 'launched',
    tags: ['Vanilla JS', 'Browser game', 'Cloudflare Workers'],
    blurb:
      'A browser arcade game: pull back a slingshot and fling eggs at a moving egg-mouth target. Vanilla JavaScript with no framework and no build step. Streak multipliers, levels that speed up the target, a rare golden egg worth 5x, and synthesized WebAudio sound. Served as static assets on Cloudflare Workers.',
    links: [
      { href: 'https://github.com/saucy-tech/eggman', label: 'GitHub Repo' },
      { href: 'https://eggman.brandonsauceda.workers.dev', label: 'Live Demo' },
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
    id: 'field-manual',
    group: 'tools',
    title: 'Field Manual',
    status: 'launched',
    tags: ['Claude Code', 'AI agents', 'Open Source'],
    blurb:
      'An open-source Claude Code skill that turns a project into a single HTML file that acts as your UI for the agent: researched decision sections, an owner-badged task board, copy-prompt chips for delegating any task to a fresh session, and a status-sync loop so you and the agent share state through one file. No server, no database, no extension.',
    links: [{ href: 'https://github.com/saucy-tech/field-manual', label: 'GitHub Repo' }],
  },
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
    id: 'hubble',
    group: 'open-source',
    title: 'Hubble',
    status: 'contributor',
    tags: ['TypeScript', 'Astro', 'Desktop', 'Open Source'],
    blurb:
      'Hubble is the notepad I keep open all day for my own notes and my agents’ scratch files. Three merged contributions: Windows desktop build support, so the app ships on a second platform; system-follow dark mode, including the Windows title bar overlay; and a workspace-switcher change that drops recent folders so the list shows only the workspaces you chose.',
    links: [
      {
        href: 'https://github.com/bholmesdev/hubble.md/pull/115',
        label: 'PR #115 (Windows build)',
      },
      { href: 'https://github.com/bholmesdev/hubble.md/pull/147', label: 'PR #147 (dark mode)' },
      { href: 'https://github.com/bholmesdev/hubble.md/pull/196', label: 'PR #196 (workspaces)' },
      { href: 'https://github.com/bholmesdev/hubble.md', label: 'GitHub Repo' },
    ],
  },
  {
    id: 'neon-orbit',
    group: 'open-source',
    title: 'Neon Orbit',
    status: 'contributor',
    tags: ['TypeScript', 'Three.js', 'Vite', 'Open Source'],
    blurb:
      'A low-poly space fighter dogfight that runs entirely in the browser, built by ATL BitLab on Three.js. Contributed the power-up system: repair, Overdrive, and Shield pods, with the pickup and expiry handling around them. Merged as PR #6.',
    links: [
      { href: 'https://neon-orbit-eight.vercel.app/', label: 'Play it' },
      { href: 'https://github.com/ATLBitLab/neon-orbit/pull/6', label: 'PR #6' },
      { href: 'https://github.com/ATLBitLab/neon-orbit', label: 'GitHub Repo' },
    ],
  },
  {
    id: 'warp',
    group: 'open-source',
    title: 'Warp',
    status: 'contributor',
    tags: ['Terminal', 'AI', 'Open Source'],
    blurb:
      'Contributed to Warp, the agentic terminal I use daily. Fixed repo-picker UX so multi-repo workflows are smoother. See PR #9451.',
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
      'Contributor to the Plebnet website, building site features and content for the broader Lightning Network community.',
    links: [{ href: 'https://github.com/plebnet-dev/website', label: 'GitHub Repo' }],
  },

  // --- Client Work ---
  {
    id: 'lawncare-site',
    group: 'client-work',
    title: 'Lawn Care Site',
    status: 'launched',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloudflare Workers'],
    blurb:
      'A sample client build: conversion-focused marketing site for a local lawn mowing business. Quote-request lead capture, bill pay through hosted Stripe checkout, LocalBusiness SEO schema, and one config file for all business details. Deployed on Cloudflare Workers.',
    links: [{ href: 'https://lawncare-site.brandonsauceda.workers.dev', label: 'Live Demo' }],
  },

  // --- Track Record ---
  {
    id: 'gda-public-systems',
    group: 'track-record',
    title: 'Georgia GDA: Public Web & GIS Systems',
    status: 'launched',
    tags: ['Product leadership', 'GIS', 'Azure', 'C#', 'Public sector'],
    blurb:
      'IT Development Manager for state agency systems. Owned public-facing web roadmap, cut citizen wait times 40%, led enterprise ArcGIS program (Esri SAG award), and built cross-agency APIs for five partner organizations. Details available on request, no public repo.',
    links: [{ href: '/Brandon_Sauceda_Resume.pdf', label: 'Résumé (PDF)' }],
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
  apps: 'Products',
  tools: 'Tools',
  'open-source': 'Open Source Contributions',
  'client-work': 'Client Work',
  'track-record': 'Track Record',
};
