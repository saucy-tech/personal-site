/**
 * Awards & recognitions (`/awards`) — public-sector tech awards from work
 * delivering software at the Georgia Department of Agriculture.
 * Edit here to update copy. Bump `awardsLastUpdated` when you revise.
 */

export const awardsLastUpdated = '2026-05-06';

export type AwardTier = 'headline' | 'body';

export interface Award {
  id: string;
  name: string;
  issuer: string;
  year: string;
  project?: string;
  impact?: string;
  issuerLink?: string;
  photo?: string;
  tier: AwardTier;
}

export const awards: Award[] = [
  // --- Headline (lead with these) ---
  {
    id: 'esri-sag-2020',
    tier: 'headline',
    name: 'Special Achievement in GIS (SAG) Award',
    issuer: 'Esri',
    year: '2020',
    project: 'Georgia Department of Agriculture',
    impact:
      'International recognition for innovative use of GIS in service of the State of Georgia.',
    issuerLink:
      'https://www.esri.com/about/newsroom/announcements/special-achievement-in-gis-awards',
  },
  {
    id: 'nascio-2019-finalist',
    tier: 'headline',
    name: 'NASCIO State IT Recognition Award — Finalist (ICT Innovations)',
    issuer: 'National Association of State CIOs (NASCIO)',
    year: '2019',
    project: 'Mobile Field Data Collection for Food Emergency Response',
    impact:
      'Selected as a national finalist for innovative use of information and communications technology in state government.',
    issuerLink: 'https://www.nascio.org/resource-center/awards/',
  },
  // --- Sustained recognition (body of work) ---
  {
    id: 'gmis-g2b-2019',
    tier: 'body',
    name: 'Georgia GMIS G2B Award — Government to Business',
    issuer: 'GMIS Georgia Chapter',
    year: '2019',
    project: 'Georgia Rapid Response Team (RRT) Emergency Assessment, GDA',
    impact:
      'Recognized at the chapter level for delivering business-facing software to state regulators (rectangular and Georgia-shaped plaques).',
  },
  {
    id: 'gmis-g2g',
    tier: 'body',
    name: 'Georgia GMIS G2G Award — Government to Government',
    issuer: 'GMIS Georgia Chapter',
    year: '2024 (date obscured on plaque)',
    project: 'Georgia Department of Agriculture',
    impact:
      'Recognized for cross-agency software collaboration delivering services between governmental entities.',
  },
  {
    id: 'gmis-g2c-2026',
    tier: 'body',
    name: 'Georgia GMIS G2C Award — Government to Citizens',
    issuer: 'GMIS Georgia Chapter',
    year: '2026',
    project: 'Georgia Department of Agriculture',
    impact:
      'Recognized for software delivering public-facing services directly to Georgia citizens.',
  },
  {
    id: 'gmis-g2b-2026',
    tier: 'body',
    name: 'Georgia GMIS G2B Award — Outstanding Achievement Supporting Business',
    issuer: 'GMIS Georgia Chapter',
    year: '2026',
    project: 'Georgia Department of Agriculture',
    impact:
      'Recognized for innovative government solutions that improve how the State serves Georgia businesses.',
  },
  {
    id: 'gta-animal-inspection',
    tier: 'body',
    name: 'Georgia Technology Innovation Showcase Award',
    issuer: 'Georgia Technology Authority (GTA)',
    year: '2023 (date obscured on plaque)',
    project: 'Animal Industry Electronic Inspection Platform, GDA',
    impact:
      'Recognized for innovation in modernizing the inspection workflows used by Georgia regulators.',
  },
  {
    id: 'gta-mobile-field-2019',
    tier: 'body',
    name: 'Georgia Technology Innovation Showcase Award',
    issuer: 'Georgia Technology Authority (GTA)',
    year: '2019',
    project: 'Mobile Field Data Collection for Food Emergency Response, GDA',
    impact:
      'Recognized for the same mobile field data collection work that earned the NASCIO national finalist nod.',
  },
];

export const awardTierLabels: Record<AwardTier, string> = {
  headline: 'Headline Recognition',
  body: 'Sustained Recognition',
};
