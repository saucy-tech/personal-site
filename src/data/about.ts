/**
 * Copy for the `/about` page. Centralizes the rule-sensitive prose
 * (no em dashes, no LLM tells). Bump `aboutLastUpdated` when revised.
 */

export const aboutLastUpdated = '2026-08-06';

export interface AboutProduct {
  name: string;
  oneLiner: string;
  href: string;
}

export const about = {
  lead: "I'm Brandon, a software engineer and builder in Georgia. I care about my faith, my family, and making useful things that hold up over time.",
  shopOneLiner:
    'Saucy Tech is how I ship my own software and take on outside work. The products are things like The Morning Portion, a daily devotional site, plus a handful of smaller apps. The client work is a few projects a year, usually web apps and product builds.',
  trackRecord:
    'For ten years I have built public software for the State of Georgia: web apps and GIS systems used by state agencies and the public, with a few national awards along the way.',
  products: [
    {
      name: 'The Morning Portion',
      oneLiner: 'A daily devotional site publishing weekday scripture reflections.',
      href: 'https://morningportion.com',
    },
    {
      name: 'Roll to Eat',
      oneLiner:
        'A playful dinner-decision app that rolls two d20s to pair a cuisine with a main ingredient.',
      href: 'https://roll-to-eat.vercel.app/',
    },
    {
      name: 'Lightning Tip Jar',
      oneLiner: 'A Lightning tipping interface with Nostr Wallet Connect support.',
      href: '/support',
    },
  ] as AboutProduct[],
  workWithMe: {
    heading: 'Client work',
    body: 'I take on a few client projects a year, usually web apps and product work. If that is a fit, email me.',
    email: 'brandon@saucy.tech',
  },
} as const;
