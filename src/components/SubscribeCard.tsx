'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/utils/helpers';

import SubscribeForm from './SubscribeForm';

interface SubscribeCardProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  meta?: string;
  description?: string;
  align?: 'center' | 'left';
  context?: 'default' | 'post' | 'tag-archive' | 'category-archive';
  contextLabel?: string;
  contextCount?: number;
}

export default function SubscribeCard({
  className,
  eyebrow,
  title,
  meta,
  description,
  align = 'left',
  context = 'default',
  contextLabel,
  contextCount,
}: SubscribeCardProps) {
  const [open, setOpen] = useState(false);
  const normalizedCount =
    typeof contextCount === 'number' && Number.isFinite(contextCount) ? contextCount : undefined;

  const defaultsByContext = {
    default: {
      eyebrow: 'Newsletter',
      title: 'Saucy.tech Updates',
      modalTitle: 'Saucy.tech Updates',
      meta: undefined,
      description: 'New essays, field notes, and writing — straight to your inbox.',
    },
    post: {
      eyebrow: 'Keep Reading',
      title: 'Enjoyed this post?',
      modalTitle: 'Subscribe — Saucy.tech Updates',
      meta: 'Get new posts in your inbox.',
      description: 'New essays, field notes, and writing — straight to your inbox.',
    },
    'tag-archive': {
      eyebrow: 'Tag Updates',
      title: contextLabel ? `More on ${contextLabel}` : 'More tagged posts',
      modalTitle: contextLabel ? `Subscribe: ${contextLabel} updates` : 'Subscribe for tag updates',
      meta:
        normalizedCount !== undefined
          ? `${normalizedCount} post${normalizedCount === 1 ? '' : 's'} in this archive.`
          : undefined,
      description: contextLabel
        ? `Follow along for new posts connected to ${contextLabel} and related topics.`
        : 'Follow along for new tagged posts and related topics.',
    },
    'category-archive': {
      eyebrow: 'Category Updates',
      title: contextLabel ? `${contextLabel} delivered to your inbox` : 'Category updates',
      modalTitle: contextLabel ? `Subscribe: ${contextLabel}` : 'Subscribe for category updates',
      meta:
        normalizedCount !== undefined
          ? `${normalizedCount} post${normalizedCount === 1 ? '' : 's'} in this category.`
          : undefined,
      description: contextLabel
        ? `Subscribe for future ${contextLabel.toLowerCase()} posts.`
        : 'Subscribe for future posts in this category.',
    },
  } as const;

  const contextDefaults = defaultsByContext[context];
  const resolvedEyebrow = eyebrow ?? contextDefaults.eyebrow;
  const resolvedTitle = title ?? contextDefaults.title;
  const resolvedModalTitle = contextDefaults.modalTitle;
  const resolvedMeta = meta ?? contextDefaults.meta;
  const resolvedDescription = description ?? contextDefaults.description;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          'group block h-full w-full rounded-2xl border border-(--accent-border) bg-[linear-gradient(180deg,rgb(var(--accent-rgb)/0.16),rgba(255,255,255,0.04))] text-left shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xs transition-all duration-300 hover:border-(--accent) hover:bg-[linear-gradient(180deg,rgb(var(--accent-rgb)/0.26),rgba(255,255,255,0.06))] hover:shadow-[0_20px_40px_rgba(0,0,0,0.24)]',
          className
        )}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.985 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className={cn(
            'flex h-full w-full gap-4 px-4 py-4 sm:px-5',
            align === 'left' ? 'items-start' : 'items-center'
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--accent)">
            <span className="text-2xl">✉️</span>
          </div>
          <div className={cn('min-w-0 flex-1', align === 'left' ? 'text-left' : 'text-center')}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--accent) sm:text-xs">
              {resolvedEyebrow}
            </p>
            <h3 className="mt-2 wrap-break-word text-sm font-semibold leading-snug text-(--text-primary) sm:text-base">
              {resolvedTitle}
            </h3>
            {resolvedMeta ? (
              <p className="mt-2 text-xs text-(--text-secondary)">{resolvedMeta}</p>
            ) : null}
            {resolvedDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                {resolvedDescription}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--accent) transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
              align === 'left' ? 'self-start' : 'self-center'
            )}
          >
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
            className="bg-(--background) rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-2xl leading-none text-gray-400 hover:text-white"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-2 text-center">{resolvedModalTitle}</h2>
            {resolvedMeta ? (
              <p className="text-sm text-gray-400 text-center">{resolvedMeta}</p>
            ) : null}
            <p className="text-sm text-gray-400 text-center mb-4">{resolvedDescription}</p>
            <SubscribeForm />
          </div>
        </div>
      )}
    </>
  );
}
