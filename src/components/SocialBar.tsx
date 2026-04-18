'use client';

import React from 'react';

interface SocialProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SocialBarProps {
  socials: SocialProps[];
}

const SocialBar: React.FC<SocialBarProps> = ({ socials }) => {
  if (!socials || socials.length === 0) return null;

  return (
    <div className="flex justify-center gap-3 sm:gap-4 py-1 flex-wrap w-full max-w-xs sm:max-w-none">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full p-2 bg-[var(--accent-transparent)] border border-[var(--accent-border)] hover:bg-[var(--accent-hover)] transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={social.label}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialBar;
