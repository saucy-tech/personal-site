/**
 * Résumé content for /resume. Mirrors public/Brandon_Sauceda_Resume.pdf, with
 * products and awards drawn live from projects.ts and awards.ts. Keep it in
 * step with the PDF and bump `resumeLastUpdated` when either changes.
 */

import { awards } from '@/data/awards';
import { portfolioAbout } from '@/data/portfolio-about';
import { projects } from '@/data/projects';

export const resumeLastUpdated = '2026-05-01';

export const resume = {
  name: portfolioAbout.headline,
  title: portfolioAbout.title,
  summary:
    'Software engineer and IT leader with 10+ years in government technology, GIS, and full-stack web development. Shipped products serving 50,000+ users; open-source contributor in TypeScript, Rust, and Python.',
  contact: [
    { href: `mailto:${portfolioAbout.email}`, label: portfolioAbout.email },
    { href: 'https://saucy.tech', label: 'saucy.tech' },
    { href: portfolioAbout.github, label: 'github.com/saucy-tech' },
    { href: portfolioAbout.linkedIn, label: 'linkedin.com/in/saucytech' },
  ],
  pdfHref: '/Brandon_Sauceda_Resume.pdf',
  experience: [
    {
      role: 'IT Development Manager',
      org: 'Georgia Department of Agriculture, Atlanta, GA',
      dates: 'March 2019 – Present',
      bullets: [
        'Owned roadmap and delivery for public-facing web applications (50,000+ monthly users); automated workflows cut citizen wait times 40%.',
        'Led enterprise GIS program (ArcGIS); Esri SAG award for geographic data in public-health emergency response.',
        'Built APIs and data-sharing agreements across five partner agencies; coordinated multi-agency rapid-response teams.',
      ],
    },
    {
      role: 'Software Engineer (Independent / Open Source)',
      org: 'Saucy Tech, evenings and weekends',
      dates: 'March 2023 – Present',
      bullets: [
        'Ship and run my own products on Cloudflare Workers: The Morning Portion, Train Every Day, The Home Hive, and Health Dashboard, plus a few client projects a year.',
        'Open-source contributions in TypeScript, Rust, and Python: Hubble (Windows desktop build, dark mode, workspace switcher), Warp (repo-picker UX), Neon Orbit (power-up system), Abbot, and Plebnet.',
        'Bitcoin/Lightning community: Legends of Lightning hackathon winner (Community & Education Award); ATL BitDevs, PlebLab.',
      ],
    },
    {
      role: 'Grants Management Specialist',
      org: 'Georgia Department of Agriculture',
      dates: 'April 2017 – March 2019',
      bullets: [
        'Managed cooperative agreements and multi-year grant projects as Principal Investigator.',
        'Established operating procedures, budgets, and partnership development processes.',
      ],
    },
    {
      role: 'Project Manager – Rapid Response',
      org: 'Georgia Department of Agriculture',
      dates: 'August 2014 – April 2017',
      bullets: [
        'Administered multi-agency emergency response operations and foodborne illness investigations.',
        'Developed investigation protocols and epidemiological analysis processes.',
      ],
    },
  ],
  products: projects
    .filter((project) => project.group === 'apps' && project.featured)
    .flatMap(({ title, summary, links: [link] }) => (link ? [{ title, summary, link }] : [])),
  awards: awards.map(({ name, issuer, years }) => ({ name, issuer, years })),
  skills: [
    { category: 'Languages', items: 'JavaScript, TypeScript, Python, C#, PowerShell, SQL, Rust' },
    { category: 'Frontend', items: 'React, Next.js, Tailwind CSS, HTML, CSS' },
    { category: 'Backend', items: 'Node.js, C#, Python, SQL Server' },
    {
      category: 'Infrastructure',
      items: 'Cloudflare Workers, Azure, GitHub, GitHub Actions, Azure DevOps',
    },
    { category: 'Specialized', items: 'GIS/ArcGIS, emergency response systems, product strategy' },
  ],
} as const;
