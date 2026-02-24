import { Metadata } from 'next';
import { Activity, BarChart2, Building2, Calculator, Database, TrendingUp } from 'lucide-react';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Bitcoin Links | ${SITE_NAME}`,
  description: 'Favorite Bitcoin trackers, calculators, and dashboards.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Bitcoin Links',
    description: 'Favorite Bitcoin trackers, calculators, and dashboards.',
    url: `${SITE_URL}/links`,
    type: 'website',
  },
};

const links = [
  {
    title: 'Strategy Tracker',
    description: "Charts and analytics for MicroStrategy's Bitcoin acquisitions",
    href: 'https://www.saylortracker.com/?tab=charts',
    icon: <BarChart2 size={20} />,
  },
  {
    title: 'Strive Tracker',
    description: "Monitor Strive's corporate Bitcoin treasury holdings",
    href: 'https://treasury.strive.com/',
    icon: <TrendingUp size={20} />,
  },
  {
    title: 'FBTC Calculator',
    description: "Calculate BTC exposure through Fidelity's FBTC ETF",
    href: 'https://bitbo.io/buy/fbtc-btc-calculator/',
    icon: <Calculator size={20} />,
  },
  {
    title: 'STRC.Live',
    description: 'Live dashboard for Strive Bitcoin treasury data',
    href: 'https://strc.live/',
    icon: <Activity size={20} />,
  },
  {
    title: 'HodlBase',
    description: 'Bitcoin accumulation tracker and portfolio insights',
    href: 'https://www.hodlbase.io/',
    icon: <Database size={20} />,
  },
  {
    title: 'Strategy Dashboard',
    description: "MicroStrategy's official Bitcoin treasury dashboard",
    href: 'https://www.strategy.com/',
    icon: <Building2 size={20} />,
  },
];

export default function Links() {
  return (
    <PageLayout title="₿ Bitcoin Links">
      <p className="text-[var(--text-secondary)] text-center mb-8 max-w-sm mx-auto text-sm">
        Favorite trackers, calculators, and dashboards.
      </p>

      <section className="w-full max-w-2xl mx-auto">
        {links.map((link) => (
          <LinkCard key={link.href} title={link.title} href={link.href} icon={link.icon}>
            <p className="px-4 pb-3 text-xs text-[var(--text-secondary)] text-center leading-relaxed">
              {link.description}
            </p>
          </LinkCard>
        ))}
      </section>
    </PageLayout>
  );
}
