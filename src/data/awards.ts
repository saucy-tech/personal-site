/**
 * Awards & recognitions surfaced on /portfolio.
 * Edit here to update copy. Bump `awardsLastUpdated` when you revise.
 */

export const awardsLastUpdated = '2026-05-06';

export type AwardTier = 'headline' | 'body';

export interface Award {
  id: string;
  name: string;
  issuer: string; // kept for data integrity; not rendered on the card
  years: string[]; // most recent first; supports formatted strings like "2024 (date obscured)"
  impact?: string;
  issuerLink?: string;
  photo?: string;
  tier: AwardTier;
}

export const awards: Award[] = [
  // --- Headline ---
  {
    id: 'esri-sag',
    tier: 'headline',
    name: 'Esri Special Achievement in GIS (SAG) Award',
    issuer: 'Esri',
    years: ['2020'],
    impact:
      'International recognition for innovative use of GIS in service of the State of Georgia.',
    issuerLink:
      'https://www.esri.com/about/newsroom/announcements/special-achievement-in-gis-awards',
  },
  {
    id: 'nascio-finalist',
    tier: 'headline',
    name: 'NASCIO State IT Recognition Award — Finalist (ICT Innovations)',
    issuer: 'National Association of State CIOs',
    years: ['2019'],
    impact:
      'Selected as a national finalist for innovative use of information and communications technology in state government.',
    issuerLink: 'https://www.nascio.org/resource-center/awards/',
  },

  // --- Sustained recognition ---
  {
    id: 'gmis-g2b',
    tier: 'body',
    name: 'Georgia GMIS G2B Award — Government to Business',
    issuer: 'GMIS Georgia Chapter',
    years: ['2026', '2019'],
    impact:
      'Recognized for innovative software that improves how the State serves Georgia businesses.',
  },
  {
    id: 'gmis-g2c',
    tier: 'body',
    name: 'Georgia GMIS G2C Award — Government to Citizens',
    issuer: 'GMIS Georgia Chapter',
    years: ['2026'],
    impact:
      'Recognized for software delivering public-facing services directly to Georgia citizens.',
  },
  {
    id: 'gmis-g2g',
    tier: 'body',
    name: 'Georgia GMIS G2G Award — Government to Government',
    issuer: 'GMIS Georgia Chapter',
    years: ['2024 (date obscured on plaque)'],
    impact:
      'Recognized for cross-agency software collaboration delivering services between governmental entities.',
  },
  {
    id: 'gta-innovation-showcase',
    tier: 'body',
    name: 'Georgia Technology Innovation Showcase Award',
    issuer: 'Georgia Technology Authority',
    years: ['2023 (date obscured on plaque)', '2019'],
    impact: 'Recognized for technology innovation in service of the State of Georgia.',
  },
];

export const awardTierLabels: Record<AwardTier, string> = {
  headline: 'Headline Recognition',
  body: 'Sustained Recognition',
};
