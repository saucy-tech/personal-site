"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  emoji?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  emoji,
  children,
  className = "",
}) => {
  // Convert children to array for staggered animations
  const childrenArray = React.Children.toArray(children);
  
  return (
    <motion.section 
      className={`w-full mb-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="mb-3 flex items-center justify-center min-h-[44px]"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-[2px] flex-1 max-w-[120px] bg-[var(--accent)] opacity-70 mr-4" />
        <div className="flex items-center">
          {emoji && (
            <motion.span 
              className="text-2xl mr-3" 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {emoji}
            </motion.span>
          )}
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        </div>
        <div className="h-[2px] flex-1 max-w-[120px] bg-[var(--accent)] opacity-70 ml-4" />
      </motion.div>
      
      {childrenArray.map((child, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.2 + (index * 0.05)
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.section>
  );
};

export default Section;
