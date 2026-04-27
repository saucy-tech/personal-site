/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Two sections: what I'm using and what I'm trying.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-04-27';

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
        tags: ['anthropic', 'Max 5x $100/mo'],
        badge: 'daily',
        note: 'Cowork and Claude Code inside the desktop app. On Max; I use it heavily.',
      },
      {
        title: 'Warp',
        tags: ['terminal', 'Build $20/mo'],
        badge: 'daily',
        note: 'My terminal. Oz, Codex sessions, and the occasional Claude Code CLI run all happen here.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
      },
      {
        title: 'Sonnet 4.6',
        tags: ['anthropic'],
        note: 'The model I end up on most. Fast enough to live with, smart enough for day-to-day work.',
      },
      {
        title: 'GPT 5.4',
        tags: ['openai'],
        note: 'My default on the OpenAI side. 5.4 Mini for when I want something stupid-fast and cheap.',
      },
      {
        title: 'M1 MacBook Pro 16"',
        badge: 'daily',
        note: 'Primary machine. Old but still getting the job done — pushing 16GB limits for heavier local work.',
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
        note: 'Clean wrapper around Codex and Claude Code. Liking the fit so far.',
      },
      {
        title: 'Cursor',
        tags: ['editor', 'Pro $20/mo'],
        note: 'Another look, to see how much I want to live in the editor vs. Warp + T3 Code.',
      },
    ],
  },
];
