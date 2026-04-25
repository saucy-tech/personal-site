'use client';

import { BaseProps } from '@/types';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface CardProps extends BaseProps {
  href?: string;
  onClick?: () => void;
  isReading?: boolean;
  hasBackButton?: boolean;
  backUrl?: string;
}

export default function Card({
  children,
  className,
  href,
  onClick,
  isReading = false,
  hasBackButton = false,
  backUrl = '/',
}: CardProps) {
  const baseStyles =
    'bg-opacity-20 bg-[var(--background)] backdrop-blur-sm border border-[var(--accent)] border-opacity-30 rounded-lg shadow-md overflow-hidden transition-all duration-300';
  const hoverStyles = 'hover:shadow-[0_0_15px_rgb(var(--accent-rgb)/0.18)] hover:border-opacity-50';

  const cardContent = (
    <>
      {hasBackButton && (
        <div className="p-2 absolute top-0 left-0">
          <Link href={backUrl}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-[var(--accent)] hover:opacity-80 transition-opacity"
            >
              <ArrowLeftIcon className="mr-1 h-[18px] w-[18px]" aria-hidden />
              <span className="text-sm">Back</span>
            </motion.div>
          </Link>
        </div>
      )}

      <div className={isReading ? 'p-5 pt-6' : 'p-3'}>{children}</div>
    </>
  );

  const cardWrapper = (
    <motion.div
      className={cn(
        baseStyles,
        isReading ? 'relative' : '',
        'mx-auto max-w-[50%]',
        hoverStyles,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      whileHover={!isReading ? { y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {cardContent}
    </motion.div>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className="block">
        {cardWrapper}
      </Link>
    );
  }

  return cardWrapper;
}
