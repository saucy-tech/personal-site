/**
 * Copy for the `/about` page. Centralizes the rule-sensitive prose
 * (no em dashes, no LLM tells). Bump `aboutLastUpdated` when revised.
 */

export const aboutLastUpdated = '2026-09-22';

export interface AboutProduct {
  name: string;
  oneLiner: string;
  href: string;
}

export const about = {
  lead: "I'm Brandon, a software engineer and builder in Georgia. I care about my faith, my family, and making useful things that hold up over time.",
  shopOneLiner:
    'Saucy Tech is how I ship my own software and take on outside work. Four products get most of my time: The Morning Portion, Train Every Day, The Home Hive, and Health Dashboard. They cover things I care about and use myself: faith, training, family learning, and health. The client work is a few projects a year, usually web apps and product builds.',
  trackRecord:
    'For ten years I have built public software for the State of Georgia: web apps and GIS systems used by state agencies and the public, with a few national awards along the way.',
  products: [
    {
      name: 'The Morning Portion',
      oneLiner: 'A daily devotional site publishing weekday scripture reflections.',
      href: 'https://morningportion.com',
    },
    {
      name: 'Train Every Day',
      oneLiner:
        'An offline-first workout logger on Cloudflare Workers. The live build is private, so this opens a sanitized demo.',
      href: 'https://train-every-day-demo.brandonsauceda.workers.dev/',
    },
    {
      name: 'The Home Hive',
      oneLiner:
        'Weekly preschool activities and games for family evenings. The public demo uses an invented week.',
      href: 'https://home-hive-demo.brandonsauceda.workers.dev',
    },
    {
      name: 'Health Dashboard',
      oneLiner: 'The dashboard I run my own care from. The public demo uses an invented person.',
      href: 'https://health-app-demo.brandonsauceda.workers.dev/',
    },
  ] as AboutProduct[],
  workWithMe: {
    heading: 'Client work',
    body: 'I take on a few client projects a year, usually web apps and product work. If that is a fit, email me.',
    email: 'brandon@saucy.tech',
  },
} as const;
