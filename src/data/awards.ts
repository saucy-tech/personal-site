/**
 * Awards & recognitions surfaced on /portfolio.
 * Edit here to update copy. Bump `awardsLastUpdated` when you revise.
 */

export const awardsLastUpdated = '2026-05-06';

export interface Award {
  id: string;
  name: string;
  issuer: string; // kept for data integrity; not rendered on the card
  years: string[];
  impact?: string;
  issuerLink?: string;
  photo?: string;
}

export const awards: Award[] = [
  {
    id: 'esri-sag',
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
    name: 'NASCIO State IT Recognition Award — Finalist (ICT Innovations)',
    issuer: 'National Association of State CIOs',
    years: ['2019'],
    impact:
      'Selected as a national finalist for innovative use of information and communications technology in state government.',
    issuerLink: 'https://www.nascio.org/resource-center/awards/',
  },
  {
    id: 'gmis-g2g',
    name: 'Georgia GMIS G2G Award — Government to Government',
    issuer: 'GMIS Georgia Chapter',
    years: ['2026'],
    impact:
      'Recognized for cross-agency software collaboration delivering services between governmental entities.',
  },
  {
    id: 'gmis-g2c',
    name: 'Georgia GMIS G2C Award — Government to Citizens',
    issuer: 'GMIS Georgia Chapter',
    years: ['2026', '2025'],
    impact:
      'Recognized for software delivering public-facing services directly to Georgia citizens.',
  },
  {
    id: 'gmis-g2b',
    name: 'GMIS G2B Award — Government to Business',
    issuer: 'GMIS International + GMIS Georgia Chapter',
    years: ['2019'],
    impact:
      'Won at GMIS International and Georgia Chapter levels for software that improves how the State serves Georgia businesses.',
  },
  {
    id: 'gta-innovation-showcase',
    name: 'Georgia Technology Innovation Showcase Award',
    issuer: 'Georgia Technology Authority',
    years: ['2021', '2019'],
    impact: 'Recognized for technology innovation in service of the State of Georgia.',
  },
];
