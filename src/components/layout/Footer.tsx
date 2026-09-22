import AppearanceToggle from '@/components/AppearanceToggle';
import ThemeToggle from '@/components/ThemeToggle';
import SiteNav from '@/components/layout/SiteNav';
import type { SiteNavItem } from '@/config/site-nav';
import { BaseProps } from '@/types';
import { LEGAL_ENTITY } from '@/utils/constants';
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
            className="text-(--accent) a11y-focus-ring hover:underline underline-offset-4"
          >
            brandon@saucy.tech
          </a>
          <a
            href="https://linkedin.com/in/saucytech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent) a11y-focus-ring hover:underline underline-offset-4"
          >
            LinkedIn
          </a>
          <a
            href="/Brandon_Sauceda_Resume.pdf"
            className="text-(--accent) a11y-focus-ring hover:underline underline-offset-4"
          >
            Résumé
          </a>
        </div>
        <div
          className="flex flex-wrap justify-center items-center gap-4"
          aria-label="Site appearance"
        >
          <ThemeToggle />
          <AppearanceToggle />
        </div>
        <p className="text-(--text-secondary) text-sm">
          &copy; {currentYear} {LEGAL_ENTITY}
        </p>
      </div>
    </footer>
  );
}
