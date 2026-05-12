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
        tags: ['terminal', 'Build plan'],
        badge: 'daily',
        note: 'Still the center of gravity for my coding setup. Most implementation work runs through Warp now, especially Claude Code and Codex CLI sessions.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
      },
      {
        title: 'Claude Code',
        tags: ['anthropic', 'Claude Max $100', 'cli'],
        badge: 'daily',
        note: 'My default high-context coding partner. I still like it for planning, writing, and long sessions where I want the model to stay close to the shape of the repo.',
      },
      {
        title: 'Codex CLI',
        tags: ['openai', 'ChatGPT Pro $100', 'cli'],
        badge: 'daily',
        note: "OpenAI's coding CLI has become a daily part of the workflow. I run it mostly through Warp, where the terminal-native flow feels natural.",
      },
    ],
  },
  {
    id: 'learning',
    title: 'Learning',
    blurb: 'Tools and workflows I am actively evaluating.',
    items: [
      {
        title: 'Hermes Agent',
        tags: ['orchestration', 'vps'],
        badge: 'learning',
        note: 'I have Hermes running on a VPS, so it sits in the learning bucket for both agent orchestration and VPS operations. Useful to keep in view, but I am still getting fully comfortable with it.',
      },
      {
        title: 'Codex desktop',
        tags: ['openai', 'desktop'],
        badge: 'learning',
        note: 'Part of the active rotation now, but still something I am learning alongside CLI-based work.',
      },
      {
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop'],
        badge: 'learning',
        note: 'Useful for coworking and longer thinking sessions, especially when I want a separate surface from the terminal. Still learning the best place for it in the workflow.',
      },
      {
        title: 'Oz',
        tags: ['warp', 'cloud agents'],
        badge: 'watching',
        note: "Warp's cloud-agent orchestration platform. This is the cloud-agent lane I actually mean when I talk about learning agents.",
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
