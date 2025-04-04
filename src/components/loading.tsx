"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <motion.div
        className="w-12 h-12 border-4 border-[var(--accent-transparent)] border-t-[var(--accent)] rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

