import { BaseProps } from '@/types';
import { cn } from '@/utils/helpers';
import { SITE_NAME } from '@/utils/constants';

export default function Footer({ className }: BaseProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('py-6 transparent', className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <p className="text-[var(--accent)] text-sm opacity-80">
            &copy; {currentYear} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
