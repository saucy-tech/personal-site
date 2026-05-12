/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Sections: daily stack, learning, and paused.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-05-12';

export type FieldNoteStatus = 'daily' | 'learning' | 'paused';

export type FieldNoteBadge = 'default' | 'daily' | 'learning' | 'paused' | 'watching';

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
    id: 'daily',
    title: 'Daily stack',
    blurb: 'The tools I reach for without thinking about it.',
    items: [
      {
        title: 'Warp',
        tags: ['terminal', 'Build $20/mo'],
        badge: 'daily',
        note: 'Still the center of gravity for my coding setup. Most implementation work runs through Warp now, especially Claude Code and Codex CLI sessions.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
      },
      {
        title: 'Claude Code',
        tags: ['anthropic', 'cli'],
        badge: 'daily',
        note: 'My default high-context coding partner. I still like it for planning, writing, and long sessions where I want the model to stay close to the shape of the repo.',
      },
      {
        title: 'Codex CLI',
        tags: ['openai', 'Codex subscription', 'Codex Pro', 'cli'],
        badge: 'daily',
        note: "OpenAI's coding CLI has become a daily part of the workflow. I run it mostly through Warp, where the terminal-native flow feels natural.",
      },
      {
        title: 'Hermes Agent',
        tags: ['orchestration'],
        badge: 'daily',
        note: 'My command center for agent work. It helps Codex, Claude Code, repo automation, and long-running workflows feel like one setup instead of a pile of separate tools.',
      },
      {
        title: 'Codex desktop',
        tags: ['openai', 'desktop'],
        badge: 'daily',
        note: 'Part of the active rotation now. I am using the desktop app more as I learn where it fits best next to CLI-based work.',
      },
      {
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop'],
        badge: 'daily',
        note: 'Still useful for coworking and longer thinking sessions, especially when I want a separate surface from the terminal.',
      },
    ],
  },
  {
    id: 'learning',
    title: 'Learning',
    blurb: 'Tools and workflows I am actively evaluating.',
    items: [
      {
        title: 'Codex cloud agents',
        tags: ['openai', 'cloud agents'],
        badge: 'learning',
        note: 'Still learning where cloud agents fit compared with local CLI work. The interesting question is what should move out of the terminal and into longer-running remote workflows.',
      },
      {
        title: 'Claude cloud agents',
        tags: ['anthropic', 'cloud agents'],
        badge: 'learning',
        note: 'Also in the learning bucket. I am watching how it changes planning, branch work, and async coding compared with Claude Code running locally.',
      },
      {
        title: 'Awe Agent',
        tags: ['agent'],
        badge: 'watching',
        note: 'A tool I use from time to time while I figure out where it belongs in the stack.',
      },
      {
        title: 'T3 Code',
        tags: ['wrapper'],
        badge: 'watching',
        note: 'Still interesting as a wrapper around Codex and Claude Code, but Warp plus direct CLIs is winning most days.',
      },
    ],
  },
  {
    id: 'paused',
    title: 'Paused',
    blurb: 'Good tools I am not reaching for much right now.',
    items: [
      {
        title: 'Cursor',
        tags: ['editor'],
        badge: 'paused',
        note: 'I stopped using Cursor for now. The bigger shift is that I do not want the editor to be the main agent surface; Warp plus CLI agents fits me better.',
      },
    ],
  },
];
