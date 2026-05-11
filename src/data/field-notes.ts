/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Sections: current ranking, what I'm using, and what I'm trying.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-05-11';

export type FieldNoteStatus = 'ranking' | 'using' | 'trying';

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
    id: 'ranking',
    title: 'Current ranking',
    blurb: 'Where the AI stack sits for me right now.',
    items: [
      {
        title: 'Hermes + Codex CLI',
        tags: ['openai', 'Codex Pro 5x', 'cli'],
        badge: 'daily',
        note: 'I bit the bullet and upgraded to Codex Pro 5x. Since using Hermes as the orchestration layer, I reach for Codex more often for implementation passes, repo work, and second opinions.',
      },
      {
        title: 'Claude Max + Claude Code',
        tags: ['anthropic', 'Max — 7.1M tokens'],
        badge: 'daily',
        note: 'Moved to Claude Max a few weeks ago. Still my high-context planning and writing partner, with Claude Code in the loop for heavier coding sessions.',
      },
      {
        title: 'GPT-5.5',
        tags: ['openai'],
        note: 'Strong general-purpose backup and sanity check when I want a different read on a problem.',
      },
    ],
  },
  {
    id: 'using',
    title: 'Using',
    blurb: 'Daily drivers. What I reach for without thinking about it.',
    items: [
      {
        title: 'Hermes Agent',
        tags: ['orchestration', 'daily'],
        badge: 'daily',
        note: 'My command center for agent work. It makes Codex, Claude Code, repo automation, and long-running workflows feel like one setup instead of a pile of separate tools.',
      },
      {
        title: 'Claude (desktop)',
        tags: ['anthropic', 'Max — 7.1M tokens'],
        badge: 'daily',
        note: 'Cowork and Claude Code inside the desktop app. On Claude Max now — I use it heavily for long-context thinking and writing.',
      },
      {
        title: 'Claude Opus 4',
        tags: ['anthropic'],
        badge: 'daily',
        note: 'Still a daily driver model. Opus quality plus long context changes how I structure long sessions.',
      },
      {
        title: 'GPT-5.5',
        tags: ['openai'],
        note: 'My default on the OpenAI side. Strong second opinion alongside Opus when the answer matters.',
      },
      {
        title: 'Codex CLI',
        tags: ['openai', 'Codex Pro 5x', 'cli'],
        badge: 'daily',
        note: "OpenAI's coding CLI. The Pro 5x upgrade moved it from occasional second opinion to something I use constantly through Hermes.",
      },
      {
        title: 'Warp',
        tags: ['terminal', 'Build $20/mo'],
        badge: 'daily',
        note: 'My terminal. Both Claude Code CLI and Codex CLI run here daily — and I made an open source contribution to Warp itself.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
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
