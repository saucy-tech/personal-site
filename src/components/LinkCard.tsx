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
  headingLevel?: 'h2' | 'h3';
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
  align = 'left',
  headingLevel: Heading = 'h2',
}) => {
  const isExternal = href ? /^https?:\/\//.test(href) : false;

  const cardContent = (
    <div className={cn('group h-full w-full hover:bg-(--accent-transparent)', className)}>
      <div
        className={cn(
          'flex h-full w-full gap-4 px-2 py-5',
          align === 'left' ? 'items-start' : 'items-center'
        )}
      >
        {imageSrc ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--accent-border) bg-(--accent-transparent)">
            <Image src={imageSrc} alt={title} width={32} height={32} className="rounded-full" />
          </div>
        ) : (
          icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--accent-border) bg-(--accent-transparent) text-(--accent)">
              {icon}
            </div>
          )
        )}

        <div className={cn('min-w-0 flex-1', align === 'left' ? 'text-left' : 'text-center')}>
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--accent) sm:text-xs">
              {eyebrow}
            </p>
          )}
          <Heading
            className={cn(
              'wrap-break-word text-base font-semibold leading-snug text-(--text-primary) sm:text-base',
              eyebrow ? 'mt-2' : ''
            )}
          >
            {cardTitle || title}
          </Heading>
          {meta && <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{meta}</p>}
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-(--text-secondary)">{description}</p>
          )}
        </div>

        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center text-(--accent)',
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
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="a11y-focus-ring block h-full w-full rounded-sm"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="a11y-focus-ring block h-full w-full rounded-sm">
      {cardContent}
    </Link>
  );
};

export default LinkCard;
