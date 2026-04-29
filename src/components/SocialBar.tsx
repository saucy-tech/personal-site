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
    <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 py-1">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer me"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-(--accent-border) bg-(--accent-transparent) p-0 transition-all duration-200 hover:bg-(--accent-hover) hover:scale-105 active:scale-95"
          aria-label={social.label}
        >
          <span className="flex size-8 items-center justify-center [&_img]:block [&_img]:h-8 [&_img]:w-8 [&_img]:object-contain">
            {social.icon}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialBar;
