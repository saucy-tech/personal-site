import {
  ArrowTrendingUpIcon,
  BoltIcon,
  BuildingOffice2Icon,
  CalculatorIcon,
  ChartBarIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';

import LinkCard from '@/components/LinkCard';
import PageLayout from '@/components/PageLayout';
import { SITE_NAME } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Bitcoin Links | ${SITE_NAME}`,
  description: 'Favorite Bitcoin trackers, calculators, and dashboards.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/links',
  },
  openGraph: {
    title: 'Bitcoin Links',
    description: 'Favorite Bitcoin trackers, calculators, and dashboards.',
    url: '/links',
    type: 'website',
  },
};

const links = [
  {
    title: 'Strategy Tracker',
    description: "Charts and analytics for MicroStrategy's Bitcoin acquisitions",
    href: 'https://www.saylortracker.com/?tab=charts',
    icon: <ChartBarIcon className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Strive Tracker',
    description: "Monitor Strive's corporate Bitcoin treasury holdings",
    href: 'https://treasury.strive.com/',
    icon: <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'FBTC Calculator',
    description: "Calculate BTC exposure through Fidelity's FBTC ETF",
    href: 'https://bitbo.io/buy/fbtc-btc-calculator/',
    icon: <CalculatorIcon className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'STRC.Live',
    description: 'Live dashboard for Strive Bitcoin treasury data',
    href: 'https://strc.live/',
    icon: <BoltIcon className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'HodlBase',
    description: 'Bitcoin accumulation tracker and portfolio insights',
    href: 'https://www.hodlbase.io/',
    icon: <CircleStackIcon className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Strategy Dashboard',
    description: "MicroStrategy's official Bitcoin treasury dashboard",
    href: 'https://www.strategy.com/',
    icon: <BuildingOffice2Icon className="h-5 w-5" aria-hidden />,
  },
];

export default function Links() {
  return (
    <PageLayout title="₿ Bitcoin Links">
      <p className="text-[var(--text-secondary)] text-center mb-8 max-w-sm mx-auto text-sm">
        Favorite trackers, calculators, and dashboards.
      </p>

      <section className="w-full max-w-2xl mx-auto space-y-4">
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
