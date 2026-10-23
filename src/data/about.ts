/**
 * Copy for the `/about` page. Centralizes the rule-sensitive prose
 * (no em dashes, no LLM tells). Bump `aboutContentUpdated` when revised.
 */

import { projects, projectsLastUpdated } from '@/data/projects';

const aboutContentUpdated = '2026-10-23';

export const aboutLastUpdated =
  [aboutContentUpdated, projectsLastUpdated].sort().at(-1) ?? aboutContentUpdated;

export interface AboutProduct {
  name: string;
  oneLiner: string;
  href: string;
}

export const about = {
  lead: "I'm Brandon, a software engineer and builder in Georgia. I care about my faith, my family, and making useful things that hold up over time.",
  shopOneLiner:
    'Saucy Tech is how I ship my own software and take on outside work. Most of my time goes into four products: three I built for my own life and family (faith, training, and preschool learning at home) and a QGIS plugin directory for people who work in GIS. Outside of those, I take on a few client projects a year, usually web apps and product builds.',
  trackRecord:
    'For ten years I have built public software for the State of Georgia: web apps and GIS systems used by state agencies and the public, with a few national awards along the way.',
  products: projects
    .filter((project) => project.group === 'apps' && project.featured)
    .flatMap(({ title, summary, links: [link] }): AboutProduct[] =>
      link && summary ? [{ name: title, oneLiner: summary, href: link.href }] : []
    ),
  workWithMe: {
    heading: 'Client work',
    body: 'I take on a few client projects a year, usually web apps and product work. If that is a fit, email me.',
    email: 'brandon@saucy.tech',
  },
} as const;
