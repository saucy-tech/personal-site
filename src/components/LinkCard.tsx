import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/utils/helpers';

interface LinkCardProps {
  title: string;
  cardTitle?: string;
  href?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  children?: React.ReactNode;
  eyebrow?: string;
  meta?: string;
  description?: string;
  className?: string;
  align?: 'center' | 'left';
}

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  cardTitle,
  href,
  icon,
  imageSrc,
  children,
  eyebrow,
  meta,
  description,
  className,
  align = 'center',
}) => {
  const isExternal = href ? /^https?:\/\//.test(href) : false;

  const cardContent = (
    <div
      className={cn(
        'group h-full w-full rounded-2xl border border-[var(--accent-border)] bg-[linear-gradient(180deg,rgb(var(--accent-rgb)/0.16),rgba(255,255,255,0.04))] shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[linear-gradient(180deg,rgb(var(--accent-rgb)/0.26),rgba(255,255,255,0.06))] hover:shadow-[0_20px_40px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 active:scale-[0.985]',
        className
      )}
    >
      <div
        className={cn(
          'flex h-full w-full gap-4 px-4 py-4 sm:px-5',
          align === 'left' ? 'items-start' : 'items-center'
        )}
      >
        {imageSrc ? (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Image src={imageSrc} alt={title} width={32} height={32} className="rounded-full" />
          </div>
        ) : (
          icon && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--accent)]">
              {icon}
            </div>
          )
        )}

        <div className={cn('min-w-0 flex-1', align === 'left' ? 'text-left' : 'text-center')}>
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs">
              {eyebrow}
            </p>
          )}
          <h3
            className={cn(
              'break-words text-sm font-semibold leading-snug text-[var(--text-primary)] sm:text-base',
              eyebrow ? 'mt-2' : ''
            )}
          >
            {cardTitle || title}
          </h3>
          {meta && <p className="mt-2 text-xs text-[var(--text-secondary)]">{meta}</p>}
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            align === 'left' ? 'self-start' : 'self-center'
          )}
        >
          {isExternal ? (
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </div>
      </div>

      {children ? <div className="px-4 pb-4 sm:px-5">{children}</div> : null}
    </div>
  );

  if (!href) {
    return cardContent;
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full w-full">
      {cardContent}
    </Link>
  );
};

export default LinkCard;
