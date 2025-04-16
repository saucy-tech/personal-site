"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="flex justify-center gap-3 sm:gap-4 py-1 flex-wrap w-full max-w-xs sm:max-w-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {socials.map((social, index) => (
        <motion.a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full p-2 bg-[var(--accent-transparent)] border border-[var(--accent-border)] hover:bg-[var(--accent-hover)] transition-all"
          aria-label={social.label}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 8px var(--accent)" 
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.1 + (index * 0.05)
          }}
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialBar;
