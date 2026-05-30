/**
 * Field notes (`/field-notes`) — what I'm into in tech right now.
 * Sections: harnesses, subscriptions, agents, and paused.
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-05-30';

export type FieldNoteStatus =
  | 'harnesses'
  | 'subscriptions'
  | 'agents'
  | 'infrastructure'
  | 'models'
  | 'tools'
  | 'paused';

export type FieldNoteBadge = 'daily' | 'experimenting' | 'learning' | 'paused' | 'watching';

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
        title: 'Oz',
        tags: ['warp', 'cloud agents'],
        badge: 'experimenting',
        homepage: 'https://warp.dev',
        note: "Warp's cloud-agent orchestration platform. Sits next to Warp because it is the same family — I am actively trying it to see where cloud agents fit in my flow.",
        pros: ['Fits the Warp-centered direction of the stack'],
        cons: ['Still forming an opinion on when to reach for it'],
      },
      // Anthropic surfaces
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
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop app'],
        badge: 'learning',
        homepage: 'https://claude.ai',
        note: 'Useful for coworking and longer thinking sessions; I use it sometimes, but prefer the Codex app and Warp for most work.',
        pros: ['Good for conversation and high-context thinking'],
        cons: ['Not replacing Claude Code for repo work'],
      },
      // OpenAI surfaces
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
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'Part of the active rotation now and a preferred separate surface alongside Warp and the Codex CLI.',
        pros: ['Useful as a separate surface from the terminal'],
        cons: ['Still finding when I prefer it over the CLI'],
      },
      // Microsoft / GitHub surfaces
      {
        title: 'VS Code',
        tags: ['microsoft', 'editor', 'agent mode'],
        badge: 'experimenting',
        homepage: 'https://code.visualstudio.com',
        note: 'Back in the rotation now that Agent mode brings Cursor-style autonomous edits into plain VS Code. Trying it as a lighter-weight alternative to a dedicated AI editor.',
        pros: [
          'Agent mode closes much of the gap with Cursor',
          'Familiar editor I already know well',
        ],
        cons: ['Still deciding whether it replaces my other surfaces'],
      },
      {
        title: 'Copilot CLI',
        tags: ['github', 'cli', 'agent'],
        badge: 'experimenting',
        homepage: 'https://github.com/github/copilot-cli',
        note: "GitHub's terminal agent. Have poked at it a bit to see how it compares with Claude Code and Codex CLI in the same Warp workflow.",
        pros: [
          'Lives in the terminal alongside my other CLIs',
          'Tied into the GitHub ecosystem I already use',
        ],
        cons: ['Too early to say where it lands versus the CLIs I run daily'],
      },
      // Wrapper that ties the surfaces above together
      {
        title: 'T3 Code',
        tags: ['wrapper'],
        badge: 'daily',
        homepage: 'https://t3.codes',
        note: 'Useful as a wrapper that lets me switch between Claude Code, Codex, and other agents as needed.',
        pros: ['Convenient switcher for multiple CLIs and desktop apps'],
        cons: ['Overlap with direct Warp+CLI workflows'],
      },
      // Superwhisper moved to Tools section
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
      // Hermes moved to Infrastructure (it lives on the VPS)
      // Oz moved to Harnesses (grouped with Warp, its parent)
      // T3 Code moved to Harnesses (now listed with daily usage)
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    blurb: 'Where my sites and services actually live — hosting, DNS, and the always-on box.',
    items: [
      {
        title: 'Hostinger VPS',
        tags: ['hostinger', 'KVM 4', 'Ubuntu 24.04'],
        badge: 'daily',
        homepage: 'https://www.hostinger.com',
        note: 'My always-on server — a Hostinger KVM 4 box on Ubuntu 24.04. It complements Vercel rather than replacing it: Vercel stays the default for public web apps, while this runs Docker workloads, private tools, background jobs, and Hermes. Access is private-first over Tailscale, with only SSH and HTTP/S exposed publicly.',
        link: { href: 'https://www.hostinger.com?REFERRALCODE=62HBRANDOYK4', label: 'my referral' },
        pros: [
          'Always-on home for self-hosted services and agents',
          'Private-first access over Tailscale keeps the surface small',
          'Cheap, predictable place to run things Vercel is not meant for',
        ],
        cons: ['I own the patching, backups, and uptime myself'],
      },
      {
        title: 'Hermes',
        tags: ['nous research', 'orchestration', 'telegram'],
        badge: 'learning',
        homepage: 'https://hermes-agent.nousresearch.com',
        note: 'Nous Research’s agent harness, self-hosted on my VPS. It coordinates Claude Code and Codex CLI as workers, exposes a dashboard, and accepts work through a Telegram gateway — all reachable over Tailscale rather than the public internet. Still a learning project and my main way into agent orchestration.',
        pros: [
          'One surface to coordinate Claude Code and Codex workers',
          'Remote control from my phone via Telegram',
          'Private by default — no public exposure',
        ],
        cons: ['Early days; I am still shaping how I use it day to day'],
      },
      {
        title: 'Vercel',
        tags: ['hosting', 'next.js', 'ci/cd'],
        badge: 'daily',
        homepage: 'https://vercel.com',
        note: 'Where all my public sites live, including this one. Every push deploys with a preview URL, so the default path for anything GitHub-backed and web-facing is Vercel — the VPS only picks up what Vercel is not meant to run.',
        pros: [
          'Git push to production with zero server babysitting',
          'Preview deploys on every branch make review easy',
          'Pairs naturally with Next.js',
        ],
        cons: ['Less suited to always-on background jobs and stateful services'],
      },
      {
        title: 'Cloudflare',
        tags: ['dns', 'domains', 'registrar'],
        badge: 'daily',
        homepage: 'https://www.cloudflare.com',
        note: 'My DNS and domain registrar — the layer that points every domain at Vercel, the VPS, and everything else. At-cost domain pricing and fast DNS make it the quiet foundation under the whole stack.',
        pros: [
          'At-cost domain registration with no markup',
          'Fast, reliable DNS for every property',
          'Single place to manage all my domains',
        ],
      },
    ],
  },
  {
    id: 'models',
    title: 'Models',
    blurb: 'The foundation models I prefer and reach for in different contexts.',
    items: [
      {
        title: 'Opus 4.8',
        tags: ['opus', 'model'],
        badge: 'daily',
        homepage: 'https://www.anthropic.com',
        note: 'High-quality specialist model I use when I need tight, deterministic outputs and strong reasoning in niche domains.',
        pros: ['Strong specialist performance', 'Good for precise generation'],
      },
      {
        title: 'GPT 5.5',
        tags: ['openai', 'model'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My generalist go-to for broad tasks: coding help, summarization, and creative drafting.',
        pros: ['Versatile across many tasks', 'Strong coding and synthesis ability'],
      },
      {
        title: 'Composer 2.5',
        tags: ['cursor', 'model'],
        badge: 'daily',
        homepage: 'https://cursor.com',
        note: 'Cursor’s in-house model — compact and fast for quick drafts and assistant-style edits. I still rate the model even though Cursor itself is out of my daily harness rotation.',
        pros: ['Low-latency drafting', 'Good for quick iterations'],
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    blurb: 'Companion utilities and helper surfaces that support my workflow.',
    items: [
      {
        title: 'Superwhisper',
        tags: ['voice', 'dictation', 'macOS'],
        badge: 'daily',
        homepage: 'https://superwhisper.com',
        note: 'Push-to-talk dictation surface. Hold the hotkey, talk, release — audio is transcribed then processed by an LLM mode of my choice.',
        link: { href: 'https://superwhisper.com', label: 'superwhisper.com' },
        pros: [
          'Push-to-talk hotkey makes voice feel like a real input mode',
          'Choose transcription and processing models independently',
          'Modes for verbose dictation, summarized meeting notes, and clean prose',
        ],
        cons: [
          'Mode customization takes a beat to internalize when you build out more than a couple',
        ],
      },
      {
        title: 'Obsidian',
        tags: ['notes', 'vault', 'editor'],
        badge: 'daily',
        homepage: 'https://obsidian.md',
        note: 'My personal knowledge vault and note-taking surface; central to workflows and long-form drafting.',
        pros: ['Local-first, extensible with plugins', 'Great for Zettelkasten-style linking'],
      },
      {
        title: 'Tailscale',
        tags: ['vpn', 'network'],
        badge: 'daily',
        homepage: 'https://tailscale.com',
        note: 'Zero-config mesh VPN that keeps my machines and VPS reachable securely.',
        pros: ['Simple secure networking across devices', 'Works well for remote agent access'],
      },
      {
        title: 'Helium Browser',
        tags: ['browser', 'privacy'],
        badge: 'daily',
        homepage: 'https://helium.computer',
        note: 'Lightweight browser I use for isolated browsing and testing; useful for quick checks.',
        pros: ['Fast, minimal surface for quick browsing and testing'],
      },
      {
        title: 'Codex Bar',
        tags: ['menu bar', 'codex'],
        badge: 'daily',
        homepage: 'https://codexbar.app',
        note: 'Menu-bar runner for quick Codex prompts and snippets without opening the full app.',
        pros: ['Convenient for one-off prompts and small snippets'],
      },
    ],
  },
  {
    id: 'paused',
    title: 'Paused',
    blurb: 'Good tools I am not reaching for much right now.',
    items: [
      // Cursor removed from rotation; experimenting with VS Code Agent mode instead
    ],
  },
];
