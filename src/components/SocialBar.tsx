import React from 'react';

import { cn } from '@/utils/helpers';

interface SocialProps {
  href: string;
  /** Use an icon drawn with `currentColor` (see SocialIcons) so it takes the accent color. */
  icon: React.ReactNode;
  label: string;
}

interface SocialBarProps {
  socials: SocialProps[];
  className?: string;
}

const SocialBar: React.FC<SocialBarProps> = ({ socials, className }) => {
  if (!socials || socials.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {socials.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer me"
          className="a11y-focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-(--accent-border) bg-(--accent-transparent) text-(--accent) transition-colors hover:bg-(--accent-hover)"
          aria-label={social.label}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialBar;
