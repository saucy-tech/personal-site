/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Sections: harnesses, subscriptions, agents, and paused.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-05-19';

export type FieldNoteStatus = 'harnesses' | 'subscriptions' | 'agents' | 'paused';

export type FieldNoteBadge = 'daily' | 'learning' | 'paused' | 'watching';

export interface FieldNoteItem {
  title: string;
  note: string;
  tags?: string[];
  link?: { href: string; label?: string };
  badge?: FieldNoteBadge;
  pros?: string[];
  cons?: string[];
  /** Official homepage URL — used to render a favicon next to the title. */
  homepage?: string;
}

export interface FieldNoteSection {
  id: FieldNoteStatus;
  title: string;
  blurb: string;
  items: FieldNoteItem[];
}

export const fieldNotesSections: FieldNoteSection[] = [
  {
    id: 'harnesses',
    title: 'Harnesses',
    blurb: 'The surfaces I actually work through.',
    items: [
      {
        title: 'Warp',
        tags: ['terminal', 'Build plan', 'daily driver'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'Still the center of gravity for my coding setup. Most implementation work runs through Warp now, especially Claude Code and Codex CLI.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
        pros: ['Keeps the terminal as the home base', 'Works naturally with both major CLIs'],
        cons: ['I am still learning where Oz fits into the flow'],
      },
      {
        title: 'Claude Code',
        tags: ['anthropic', 'cli', 'coding harness'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'My default high-context coding partner for planning, writing, and longer repo-shaped sessions.',
        pros: ['Strong for planning and repo-shaped work', 'Good fit for longer coding sessions'],
        cons: ['I still pair it with Codex when I want a second read'],
      },
      {
        title: 'Codex CLI',
        tags: ['openai', 'cli', 'coding harness'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: "OpenAI's coding CLI is now a daily part of the workflow. I run it mostly through Warp.",
        pros: ['Fast to bring into implementation work', 'Feels clean inside Warp'],
        cons: ['Plan details may change as I confirm the exact subscription label'],
      },
      {
        title: 'Codex desktop',
        tags: ['openai', 'desktop app'],
        badge: 'learning',
        homepage: 'https://openai.com',
        note: 'Part of the active rotation now, but still something I am learning alongside CLI-based work.',
        pros: ['Useful as a separate surface from the terminal'],
        cons: ['Still finding when I prefer it over the CLI'],
      },
      {
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop app'],
        badge: 'learning',
        homepage: 'https://claude.ai',
        note: 'Useful for coworking and longer thinking sessions when I want a separate surface from the terminal.',
        pros: ['Good for conversation and high-context thinking'],
        cons: ['Not replacing Claude Code for repo work'],
      },
      {
        title: 'Superwhisper',
        tags: ['voice', 'dictation', 'macOS'],
        badge: 'daily',
        homepage: 'https://superwhisper.com',
        note: 'My push-to-talk dictation surface. Hold the hotkey, talk, release — the audio gets transcribed and then run through an LLM mode of my choice before it lands in whatever app I am in.',
        link: { href: 'https://superwhisper.com', label: 'superwhisper.com' },
        pros: [
          'Push-to-talk hotkey makes voice feel like a real input mode',
          'I pick both the transcription model and the processing model (Sonnet is in the mix)',
          'Modes for verbose dictation, summarized meeting notes, and clean prose',
          'The newer super mode adapts the output to the app I am dictating into',
          'Cheaper than the other dictation tools I have tried',
        ],
        cons: [
          'Mode customization takes a beat to internalize when you build out more than a couple',
        ],
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    blurb: 'The paid plans that make the stack work.',
    items: [
      {
        title: 'Claude Max',
        tags: ['anthropic', '$100 plan'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'The subscription behind my Claude Code and Claude desktop usage right now.',
        pros: ['Enough room for heavier Claude sessions'],
        cons: ['Still deciding how much belongs in desktop vs. CLI'],
      },
      {
        title: 'ChatGPT Pro',
        tags: ['openai', '$100 plan'],
        badge: 'daily',
        homepage: 'https://chatgpt.com',
        note: 'The subscription behind my Codex work right now. I am still confirming the cleanest public-facing name for the exact Codex access.',
        pros: ['Makes Codex a real daily tool instead of an occasional backup'],
        cons: ['Naming around Codex plans is easy to make too messy'],
      },
      {
        title: 'Warp Build',
        tags: ['warp', 'Build plan'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'The terminal plan that supports the place where most of the workflow happens.',
        pros: ['Worth it because Warp is where the work actually happens'],
        cons: ['Oz is still in the watching bucket for me'],
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agents',
    blurb: 'Orchestration and cloud-agent workflows I am still learning.',
    items: [
      {
        title: 'Hermes Agent',
        tags: ['orchestration', 'vps'],
        badge: 'learning',
        note: 'Running on my VPS, so it sits in the learning bucket for both agent orchestration and VPS operations.',
      },
      {
        title: 'Oz',
        tags: ['warp', 'cloud agents'],
        badge: 'watching',
        homepage: 'https://warp.dev',
        note: "Warp's cloud-agent orchestration platform. This is the agent lane I mean when I talk about learning cloud agents.",
        pros: ['Fits the Warp-centered direction of the stack'],
        cons: ['Still early for me'],
      },
      {
        title: 'T3 Code',
        tags: ['wrapper'],
        badge: 'watching',
        note: 'Still interesting as a wrapper around Codex and Claude Code, but Warp plus direct CLIs wins most days.',
        pros: ['Nice wrapper idea for the tools I already use'],
        cons: ['Not beating Warp plus direct CLIs right now'],
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
        homepage: 'https://cursor.com',
        note: 'Paused for now. The bigger shift is that I do not want the editor to be the main agent surface.',
      },
    ],
  },
];
