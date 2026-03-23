'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/utils/helpers';

import SubscribeForm from './SubscribeForm';

interface SubscribeCardProps {
  className?: string;
}

export default function SubscribeCard({ className }: SubscribeCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          'group block h-full w-full rounded-2xl border border-[var(--accent-border)] bg-[linear-gradient(180deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] text-left shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[linear-gradient(180deg,rgba(212,175,55,0.22),rgba(255,255,255,0.06))] hover:shadow-[0_20px_40px_rgba(0,0,0,0.24)]',
          className
        )}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.985 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex h-full w-full items-start gap-4 px-4 py-4 sm:px-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--accent)]">
            <span className="text-2xl">✉️</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs">
              Newsletter
            </p>
            <h3 className="mt-2 break-words text-sm font-semibold leading-snug text-[var(--text-primary)] sm:text-base">
              The Daily Word
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Weekday scripture reflections, the occasional weekend note, and future article
              updates. Free.
            </p>
          </div>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center self-start rounded-full border border-white/10 bg-white/5 text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </motion.button>

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
            <h2 className="text-xl font-semibold mb-2 text-center">The Daily Word</h2>
            <p className="text-sm text-gray-400 text-center mb-4">
              Faith, ideas, and whatever&apos;s on my mind — Monday through Friday, with the
              occasional weekend thought. Free.
            </p>
            <SubscribeForm />
          </div>
        </div>
      )}
    </>
  );
}
