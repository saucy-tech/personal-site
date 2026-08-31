/**
 * Awards & recognitions surfaced on /portfolio.
 * Edit here to update copy. Bump `awardsLastUpdated` when you revise.
 *
 * Order: international scope first, then national, then state / chapter.
 * Within scope: most recent year, then alphabetical by name.
 */

export const awardsLastUpdated = '2026-08-31';

export interface Award {
  id: string;
  name: string;
  issuer: string;
  years: string[];
  impact?: string;
  photo?: string;
}

export const awards: Award[] = [
  // International scope
  {
    id: 'gmis-g2g',
    name: 'GMIS G2G Award — Government to Government',
    issuer: 'GMIS International + GMIS Georgia Chapter',
    years: ['2026'],
    impact:
      'Recognition for the yellow-legged hornet GIS response, which connected field collection, public reporting, dashboards, automation, and partner data. Won at the Georgia Chapter level, then advanced to win internationally.',
  },
  {
    id: 'legends-of-lightning-hackathon',
    name: 'Legends of Lightning Vol. 2 Hackathon Winner',
    issuer: 'Legends of Lightning',
    years: ['2023'],
    impact:
      'Community & Education Award for innovation in Bitcoin and Lightning Network development.',
  },
  {
    id: 'esri-sag',
    name: 'Esri Special Achievement in GIS (SAG) Award',
    issuer: 'Esri',
    years: ['2020'],
    impact:
      'International recognition for innovative use of GIS (Geographic Information Systems) in service of the State of Georgia.',
  },
  {
    id: 'gmis-g2b',
    name: 'GMIS G2B Award — Government to Business',
    issuer: 'GMIS International + GMIS Georgia Chapter',
    years: ['2019'],
    impact:
      'GMIS (Government Management Information Sciences) International and Georgia Chapter recognition for software that improves how the State serves Georgia businesses.',
  },

  // National scope
  {
    id: 'nascio-finalist',
    name: 'NASCIO State IT Recognition Award — Finalist (ICT Innovations)',
    issuer: 'National Association of State CIOs',
    years: ['2019'],
    impact:
      'NASCIO (National Association of State CIOs) national finalist for innovative use of information and communications technology in state government.',
  },

  // State / chapter scope
  {
    id: 'gmis-g2b-ga',
    name: 'Georgia GMIS G2B Award — Government to Business',
    issuer: 'GMIS Georgia Chapter',
    years: ['2026'],
    impact:
      'Georgia Chapter recognition for the yellow-legged hornet GIS response in the Government to Business category.',
  },
  {
    id: 'gta-innovation-showcase',
    name: 'Georgia Technology Innovation Showcase Award',
    issuer: 'Georgia Technology Authority',
    years: ['2026', '2021', '2019'],
    impact:
      'The 2026 Operational Efficiency award recognized the yellow-legged hornet GIS response. Earlier awards recognized GDA technology projects in 2021 and 2019.',
  },
  {
    id: 'gmis-g2c',
    name: 'Georgia GMIS G2C Award — Government to Citizens',
    issuer: 'GMIS Georgia Chapter',
    years: ['2025'],
    impact:
      'GMIS Georgia Chapter recognition for software delivering public-facing services directly to Georgia citizens.',
  },
];
