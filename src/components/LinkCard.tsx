"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LinkCardProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  expandable?: boolean;
  children?: React.ReactNode;
}

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  href,
  icon,
  imageSrc,
  expandable = false,
  children,
}) => {
  const CardContent = () => (
    <div className="flex items-center min-h-[54px] px-4 py-3">
      <div className="flex items-center w-full">
        {imageSrc ? (
          <div className="w-8 h-8 mr-4 flex-shrink-0">
            <Image
              src={imageSrc}
              alt={title}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        ) : (
          icon && (
            <div className="w-9 h-9 mr-4 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
              {icon}
            </div>
          )
        )}
        <span className="text-sm sm:text-base font-medium text-[var(--text-primary)]">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      <motion.a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block mx-auto max-w-[50%] w-full rounded-xl bg-[var(--accent-transparent)] backdrop-blur-sm border border-[var(--accent-border)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300"
        whileHover={{
          scale: 1.02,
          y: -2,
          boxShadow: "0 0 20px rgba(212,175,55,0.4)",
          filter: "brightness(1.1)"
        }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardContent />
      {children}
    </motion.a>
    </div>
  );
};

export default LinkCard;
