/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Three sections: what I'm using daily, what I'm trying, and what I'm enjoying.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-04-18';

export type FieldNoteStatus = 'using' | 'trying' | 'enjoying';

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
        title: 'Warp',
        tags: ['terminal'],
        badge: 'daily',
        note: 'My terminal. I live here — saved command blocks, reruns, and the in-terminal agent mean I rarely need to leave the shell to ask a quick question.',
      },
      {
        title: 'Claude (desktop)',
        tags: ['anthropic'],
        badge: 'daily',
        note: 'Home base for longer thinking and writing. The app that feels most like my workspace when I step out of an editor.',
      },
      {
        title: 'Claude Pro',
        tags: ['$20/mo'],
        note: 'The subscription I care about most. I hit the caps regularly.',
      },
      {
        title: 'Opus 4.7',
        tags: ['anthropic', 'taste'],
        note: 'What I reach for when I want care and taste — longer reasoning, writing, anything I want to feel pleasant to work with.',
      },
      {
        title: 'GPT 5.4',
        tags: ['openai', 'computer use'],
        note: 'Default for general "get this done" work and computer-use tasks. GPT 5.4 Mini shows up when I want something stupid-fast and cheap.',
      },
      {
        title: 'M1 MacBook Pro 16"',
        tags: ['16GB', '1TB'],
        badge: 'daily',
        note: 'Primary machine. Old but still gets the job done for almost everything — the 16GB is starting to feel tight for heavier local work.',
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
        badge: 'new',
        note: 'Clean wrapper around Codex and Claude Code. I\u2019ve been driving both CLIs through it more than directly.',
      },
      {
        title: 'Cursor Pro',
        tags: ['editor', '$20/mo'],
        note: 'Paying for Cursor while I figure out how much I want to live in the editor vs. T3 Code + Warp. Still the tightest editor + agent loop when the work is clearly "in a repo."',
      },
      {
        title: 'Codex',
        tags: ['openai', 'cli'],
        note: 'OpenAI\u2019s terminal agent, mostly via T3 Code. Snappy with 5.4 Mini for short, tool-using asks.',
      },
      {
        title: 'Claude Teams (enhanced)',
        tags: ['anthropic', '$100/seat'],
        badge: 'watching',
        note: 'Looking at this to stop bouncing off Pro limits. Still doing the math on whether it\u2019s worth it.',
      },
    ],
  },
  {
    id: 'enjoying',
    title: 'Enjoying',
    blurb: 'Things in tech I\u2019m into right now. Not what I rely on — just what I like.',
    items: [
      {
        title: 'Sonnet 4.6',
        tags: ['anthropic', 'workhorse'],
        note: 'Does more of my Claude Code and Cursor work than I\u2019d expect. Fast enough to live with, smart enough for most day-to-day asks.',
      },
    ],
  },
];
