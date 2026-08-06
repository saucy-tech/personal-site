/**
 * Portfolio data (`/portfolio`): products, tools, OSS contributions, and talks.
 * Edit here to update copy. Bump `projectsLastUpdated` when you revise.
 */

export const projectsLastUpdated = '2026-08-06';

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
    tags: ['Next.js 16', 'React 19', 'MDX', 'Tailwind CSS', 'Vercel'],
    blurb:
      'A standalone site I built to publish weekday scripture reflections. Next.js 16 App Router on Vercel with React 19, an MDX content pipeline (next-mdx-remote + gray-matter), Tailwind typography, and Vercel Analytics. New entries land here every weekday; the earlier archive (through May 2026) still lives on this site.',
    links: [
      { href: 'https://github.com/saucy-tech/the-morning-portion', label: 'GitHub Repo' },
      { href: 'https://morningportion.com', label: 'Visit morningportion.com' },
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
  {
    id: 'portfolio-site',
    group: 'apps',
    title: 'This Portfolio Site',
    status: 'launched',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'MDX', 'Lightning', 'Cloudflare Workers'],
    blurb:
      'Built with Next.js (App Router), React, and Tailwind CSS, integrating @getalby/sdk Nostr Wallet Connect for native Lightning payments. Custom MDX blog, responsive design, dark mode, subtle animations. Runs on Cloudflare Workers via the OpenNext adapter. All content and components managed locally, no external CMS.',
    links: [
      { href: 'https://github.com/saucy-tech/personal-site', label: 'GitHub Repo' },
      { href: '/support#lightning-tip-jar', label: 'Try Lightning Tip Jar' },
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
    tags: ['TypeScript', 'Astro', 'Open Source'],
    blurb:
      'Hubble is the notepad I keep open all day for my own notes and my agents’ scratch files. Contributed a workspace-switcher change that drops recent folders from the list, so the switcher shows the workspaces you actually chose. Merged as PR #196.',
    links: [
      { href: 'https://github.com/bholmesdev/hubble.md/pull/196', label: 'PR #196' },
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
    title: 'Georgia DGA: Public Web & GIS Systems',
    status: 'launched',
    tags: ['Product leadership', 'GIS', 'Azure', 'C#', 'Public sector'],
    blurb:
      'IT Development Manager for state agency systems serving 50,000+ monthly users. Owned public-facing web roadmap, cut citizen wait times 40%, led enterprise ArcGIS program (Esri SAG award), and built cross-agency APIs for five partner organizations. Details available on request, no public repo.',
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
