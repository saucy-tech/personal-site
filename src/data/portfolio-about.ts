/**
 * Hiring-facing copy for /portfolio only.
 * Bump `portfolioAboutLastUpdated` when revised.
 */

import { SOCIAL_PROFILES } from '@/utils/constants';

export const portfolioAboutLastUpdated = '2026-08-06';

export const portfolioAbout = {
  headline: 'Brandon Sauceda',
  title: 'IT Development Manager · Software Engineer',
  summary:
    'I run Saucy Tech, where I ship my own software products and take on a few client projects a year. For ten years I have built public technology for the State of Georgia: web apps and enterprise GIS for state agencies and the public. I also contribute to open source in TypeScript, Rust, and Python, including Windows desktop support for the Hubble notepad.',
  linkedIn: SOCIAL_PROFILES.linkedIn,
  github: SOCIAL_PROFILES.github,
  resumeHref: '/resume',
  resumeLabel: 'View résumé',
} as const;
