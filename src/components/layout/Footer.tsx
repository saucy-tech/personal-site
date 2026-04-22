import SiteNav from '@/components/layout/SiteNav';
import type { SiteNavItem } from '@/config/site-nav';
import { BaseProps } from '@/types';
import { SITE_NAME } from '@/utils/constants';
import { cn } from '@/utils/helpers';

type FooterProps = BaseProps & {
  navItems: SiteNavItem[];
};

export default function Footer({ className, navItems }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('py-6 transparent', className)}>
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        <SiteNav items={navItems} ariaLabel="Footer" />
        <p className="text-[var(--accent)] text-sm opacity-80">
          &copy; {currentYear} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
