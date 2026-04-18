/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Two sections: what I'm using and what I'm trying.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-04-18';

export type FieldNoteStatus = 'using' | 'trying';

export type FieldNoteBadge = 'daily' | 'new' | 'watching';

export interface FieldNoteItem {
  title: string;
  note: string;
  tags?: string[];
  link?: { href: string; label?: string };
  badge?: FieldNoteBadge;
}

export interface FieldNoteSection {
  id: FieldNoteStatus;
  title: string;
  blurb: string;
  items: FieldNoteItem[];
}

export const fieldNotesSections: FieldNoteSection[] = [
  {
    id: 'using',
    title: 'Using',
    blurb: 'Daily drivers. What I reach for without thinking about it.',
    items: [
      {
        title: 'Claude (desktop)',
        tags: ['anthropic'],
        badge: 'daily',
        note: 'Daily driver. Most of my Claude work runs through Cowork and Claude Code inside the desktop app.',
      },
      {
        title: 'Warp',
        tags: ['terminal'],
        badge: 'daily',
        note: 'My terminal. I use the built-in Oz agent, launch most of my Codex sessions from here, and occasionally run the Claude Code CLI too.',
      },
      {
        title: 'Claude Pro',
        tags: ['$20/mo'],
        note: 'The subscription I care about most. Powers my Claude desktop use; I hit the caps regularly.',
      },
      {
        title: 'Warp Builder',
        tags: ['$20/mo'],
        note: 'Unlocks Oz and the Codex usage I lean on inside Warp.',
      },
      {
        title: 'Sonnet 4.6',
        tags: ['anthropic', 'workhorse'],
        note: 'The model I end up on most of the time. Fast enough to live with, smart enough for most day-to-day work.',
      },
      {
        title: 'GPT 5.4',
        tags: ['openai'],
        note: 'My default on the OpenAI side. 5.4 Mini shows up when I want something stupid-fast and cheap.',
      },
      {
        title: 'M1 MacBook Pro 16"',
        tags: ['16GB', '1TB'],
        badge: 'daily',
        note: 'Primary machine. Old but still gets the job done — the 16GB is starting to feel tight for heavier local work.',
      },
    ],
  },
  {
    id: 'trying',
    title: 'Trying',
    blurb: 'Currently evaluating. Still making up my mind.',
    items: [
      {
        title: 'T3 Code',
        tags: ['wrapper'],
        note: 'Trying it and liking the fit. Clean wrapper around Codex and Claude Code.',
      },
      {
        title: 'Cursor',
        tags: ['editor', '$20/mo'],
        note: 'Giving it another look while I figure out how much I want to live in the editor vs. Warp + T3 Code.',
      },
    ],
  },
];
