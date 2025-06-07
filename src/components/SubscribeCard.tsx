'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import SubscribeForm from './SubscribeForm';

export default function SubscribeCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <motion.button
        onClick={() => setOpen(true)}
        className="block mx-auto w-full max-w-full sm:max-w-[50%] rounded-xl bg-[var(--accent-transparent)] backdrop-blur-sm border border-[var(--accent-border)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 mb-4"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center min-h-[48px] px-2 py-2 sm:px-4 sm:py-3 w-full">
          <div className="w-9 h-9 flex items-center justify-start flex-shrink-0 text-[var(--accent)] mr-4">
            <span className="text-2xl">✉️</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs sm:text-base font-medium text-[var(--text-primary)] text-center break-words w-full max-w-full">
              Stay Updated – Subscribe
            </span>
          </div>
          <div className="w-9 h-9 flex-shrink-0 mr-0" />
        </div>
      </motion.button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[var(--background)] rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-2xl leading-none text-gray-400 hover:text-white"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Join the Newsletter</h2>
            <SubscribeForm />
          </div>
        </div>
      )}
    </>
  );
}
