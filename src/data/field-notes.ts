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
    blurb: 'Daily drivers — what I actually reach for without thinking.',
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
        note: 'The subscription I care about most. I hit the caps regularly, which is its own signal about how much I lean on it.',
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
    blurb: 'Currently evaluating — jury\u2019s still out.',
    items: [
      {
        title: 'T3 Code',
        tags: ['wrapper'],
        badge: 'new',
        note: 'Clean wrapper around Codex and Claude Code. Fast, focused, and gets out of the way — I\u2019ve been driving the CLIs through it more than directly.',
      },
      {
        title: 'Cursor Pro',
        tags: ['editor', '$20/mo'],
        note: 'Paying for Cursor while I figure out how much I want to live in the editor vs. T3 Code + Warp. Still the tightest editor + agent loop when the work is clearly "in a repo."',
      },
      {
        title: 'Codex',
        tags: ['openai', 'cli'],
        note: 'OpenAI\u2019s terminal agent, mostly via T3 Code. Snappy with 5.4 Mini and a good fit for short, tool-using asks.',
      },
      {
        title: 'Claude Teams (enhanced)',
        tags: ['anthropic', '$100/seat'],
        badge: 'watching',
        note: 'Looking at this to stop bouncing off Pro limits. The economics take some thinking through.',
      },
    ],
  },
  {
    id: 'enjoying',
    title: 'Enjoying',
    blurb: 'Things in tech I\u2019m into right now — not daily tools, just good.',
    items: [
      {
        title: 'Sonnet 4.6',
        tags: ['anthropic', 'workhorse'],
        note: 'The middle-tier model that quietly does a lot of the work in Claude Code and Cursor. Good speed-to-capability tradeoff.',
      },
    ],
  },
];
