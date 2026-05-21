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
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="mailto:brandon@saucy.tech"
            className="text-(--accent) hover:text-white transition"
          >
            brandon@saucy.tech
          </a>
          <a
            href="https://linkedin.com/in/saucytech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent) hover:text-white transition"
          >
            LinkedIn
          </a>
          <a
            href="/Brandon_Sauceda_Resume.pdf"
            className="text-(--accent) hover:text-white transition"
          >
            Résumé
          </a>
        </div>
        <p className="text-(--accent) text-sm opacity-80">
          &copy; {currentYear} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
