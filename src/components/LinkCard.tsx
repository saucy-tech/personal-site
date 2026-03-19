'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LinkCardProps {
  title: string;
  cardTitle?: string;
  href?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  expandable?: boolean;
  children?: React.ReactNode;
}

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  cardTitle,
  href,
  icon,
  imageSrc,
  children,
}) => {
  const cardContent = (
    <div className="flex items-center min-h-[48px] px-2 py-2 sm:px-4 sm:py-3 w-full">
      {/* Left: Icon or Image */}
      {imageSrc ? (
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-start mr-4">
          <Image src={imageSrc} alt={title} width={32} height={32} className="rounded-full" />
        </div>
      ) : (
        icon && (
          <div className="w-9 h-9 flex items-center justify-start flex-shrink-0 text-[var(--accent)] mr-4">
            {icon}
          </div>
        )
      )}
      {/* Center: Title */}
      <div className="flex-1 flex justify-center">
        <span className="text-xs sm:text-base font-medium text-[var(--text-primary)] text-center w-full max-w-full truncate">
          {cardTitle || title}
        </span>
      </div>
      {/* Right: Empty spacer for symmetry */}
      <div className="w-9 h-9 flex-shrink-0 mr-0" />
    </div>
  );

  // Determine if link is external (keep internal links same window)
  const isExternal = href ? /^https?:\/\//.test(href) : false;

  return (
    <div className="mb-4">
      <motion.a
        href={href || '#'}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="block mx-auto w-full max-w-full sm:max-w-[50%] rounded-xl bg-[var(--accent-transparent)] backdrop-blur-sm border border-[var(--accent-border)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300"
        whileHover={{
          scale: 1.02,
          y: -2,
          boxShadow: '0 0 20px rgba(212,175,55,0.4)',
          filter: 'brightness(1.1)',
        }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {cardContent}
        {children}
      </motion.a>
    </div>
  );
};

export default LinkCard;
