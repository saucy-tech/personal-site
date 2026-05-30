/**
 * Field notes (`/field-notes`) — how I actually work with AI right now.
 *
 * Sections are workflow-native rather than a flat tool ranking: orchestration
 * first (Current workflow), then the coding agents that operate inside a repo,
 * the models I reach for, the interfaces I live in, and what I'm still
 * evaluating — plus the subscriptions, infrastructure, and utilities
 * underneath. The point is the loop, not the chat: give context, let an agent
 * inspect the repo, make edits, run tests/checks, review the output, iterate.
 *
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-05-30';

export type FieldNoteStatus =
  | 'workflow'
  | 'coding-agents'
  | 'models'
  | 'interfaces'
  | 'evaluating'
  | 'subscriptions'
  | 'infrastructure'
  | 'tools';

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
    id: 'workflow',
    title: 'Current workflow',
    blurb:
      'How I actually work with AI right now: orchestration first, coding agents second, models as interchangeable horsepower. The shift that matters is that AI coding is no longer just chatting with a model — it is a loop: give context, let an agent inspect the repo, make edits, run tests and checks, review the output, iterate.',
    items: [
      {
        title: 'Hermes Agent',
        tags: ['nous research', 'orchestration', 'command center'],
        badge: 'learning',
        homepage: 'https://hermes-agent.nousresearch.com',
        note: 'My orchestration layer and command center — Nous Research’s agent harness, self-hosted on the VPS. It coordinates Claude Code and Codex CLI as workers, exposes a dashboard, and takes work over a Telegram gateway, all over Tailscale rather than the public internet. This is where the loop starts: I hand it context and a goal, and it routes the actual repo work to a coding agent.',
        pros: [
          'One surface to dispatch and coordinate coding agents',
          'Remote control from my phone via Telegram',
          'Private by default — no public exposure',
        ],
        cons: ['Early days; I am still shaping how I lean on it day to day'],
      },
      {
        title: 'M1 MacBook Pro',
        tags: ['apple silicon', 'local environment', 'hardware'],
        badge: 'daily',
        homepage: 'https://www.apple.com',
        note: 'The local environment everything runs against — not an AI tool, but the machine the agents edit and the checks run on. Still plenty of headroom for the whole stack of CLIs, editors, and a browser at once.',
        pros: ['Handles the full local toolchain comfortably', 'Quiet, cool, and always ready'],
        cons: ['Heavier model and container work still belongs on the VPS'],
      },
    ],
  },
  {
    id: 'coding-agents',
    title: 'Coding agents & harnesses',
    blurb: 'Tools that can operate inside a repo instead of just answering in chat.',
    items: [
      {
        title: 'Claude Code',
        tags: ['anthropic', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'My default coding agent for high-context, repo-shaped work — planning, larger edits, and longer sessions where keeping the whole repo in view matters.',
        pros: ['Strong at planning and repo-shaped work', 'Holds context across longer sessions'],
        cons: ['I still pair it with Codex when I want a second read'],
      },
      {
        title: 'Codex CLI',
        tags: ['openai', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My implementation-and-inspection agent: fast at reading the repo, making focused edits, and running the test/check loop. I drive it mostly through Warp, often as a second read against Claude Code.',
        pros: ['Quick into implementation and repo inspection', 'Clean inside Warp'],
        cons: ['I reach for Claude Code first on the largest, most context-heavy tasks'],
      },
      {
        title: 'T3 Code',
        tags: ['agent harness', 'coding interface'],
        badge: 'daily',
        homepage: 'https://t3.codes',
        note: 'An agent harness, not just a wrapper — it lets me drive Claude Code, Codex, and other agents from one coding interface and switch between them without rebuilding context each time.',
        pros: ['One harness over several coding agents', 'Switch agents without leaving the flow'],
        cons: ['Overlaps with running the CLIs directly in Warp'],
      },
    ],
  },
  {
    id: 'models',
    title: 'Models',
    blurb: 'The reasoning engines I reach for when I want a different read.',
    items: [
      {
        title: 'GPT-5.5',
        tags: ['openai', 'model', 'second opinion'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My generalist reasoning partner and go-to second opinion — broad coding help, synthesis, and a different angle when Claude and I keep circling the same answer.',
        pros: [
          'Versatile across many kinds of problems',
          'Useful contrast to the Anthropic models',
        ],
      },
      {
        title: 'Opus 4.8',
        tags: ['anthropic', 'model', 'reasoning partner'],
        badge: 'daily',
        homepage: 'https://www.anthropic.com',
        note: 'The reasoning engine behind most of my Claude Code work, and the one I trust for tight, deterministic output and careful reasoning on niche problems.',
        pros: ['Strong, precise reasoning', 'Reliable for high-stakes generation'],
      },
      {
        title: 'Composer 2.5',
        tags: ['cursor', 'model'],
        badge: 'watching',
        homepage: 'https://cursor.com',
        note: 'Cursor’s in-house model — compact and fast for quick drafts and assistant-style edits. I still rate the model even though Cursor itself is out of my daily interface rotation.',
        pros: ['Low-latency drafting', 'Good for quick iterations'],
      },
    ],
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    blurb: 'Where the work happens day to day.',
    items: [
      {
        title: 'Warp',
        tags: ['terminal', 'interface', 'daily driver'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'The center of gravity for the whole setup. Most coding-agent work — Claude Code, Codex CLI — runs through Warp, so it is the surface I actually live in.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
        pros: ['Keeps the terminal as home base', 'Works naturally with both major CLIs'],
        cons: ['Still learning where Oz fits alongside it'],
      },
      {
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop app'],
        badge: 'learning',
        homepage: 'https://claude.ai',
        note: 'Where I go for coworking and longer thinking sessions — conversation and high-context drafting rather than repo edits, which stay in Claude Code.',
        pros: ['Good for conversation and thinking out loud'],
        cons: ['Not a replacement for Claude Code on repo work'],
      },
      {
        title: 'Codex desktop',
        tags: ['openai', 'desktop app'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'A separate surface from the terminal for Codex work; in the active rotation alongside Warp and the Codex CLI.',
        pros: ['Useful as a non-terminal surface'],
        cons: ['Still finding when I prefer it over the CLI'],
      },
    ],
  },
  {
    id: 'evaluating',
    title: 'Evaluating',
    blurb:
      'Tools I am testing against my real workflow before promoting them to daily-driver status.',
    items: [
      {
        title: 'Oz',
        tags: ['warp', 'cloud agents'],
        badge: 'experimenting',
        homepage: 'https://warp.dev',
        note: "Warp's cloud-agent orchestration. Same family as my daily terminal, so I am testing where cloud agents fit next to Hermes and the local CLIs.",
        pros: ['Fits the Warp-centered direction of the stack'],
        cons: ['Still forming an opinion on when to reach for it'],
      },
      {
        title: 'VS Code',
        tags: ['microsoft', 'editor', 'agent mode'],
        badge: 'experimenting',
        homepage: 'https://code.visualstudio.com',
        note: 'Agent mode brings Cursor-style autonomous edits into plain VS Code, so it can now operate inside a repo. Trying it as a lighter-weight alternative to a dedicated AI editor.',
        pros: [
          'Agent mode closes much of the gap with Cursor',
          'Familiar editor I already know well',
        ],
        cons: ['Still deciding whether it earns a daily-driver slot'],
      },
      {
        title: 'Copilot CLI',
        tags: ['github', 'cli', 'agent'],
        badge: 'experimenting',
        homepage: 'https://github.com/github/copilot-cli',
        note: "GitHub's terminal agent. Poking at it to see how it compares with Claude Code and Codex CLI in the same Warp workflow.",
        pros: [
          'Lives in the terminal alongside my other CLIs',
          'Tied into the GitHub ecosystem I already use',
        ],
        cons: ['Too early to say where it lands versus the CLIs I run daily'],
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    blurb:
      'The paid plans that make the stack work — a different kind of thing from the agents and models they unlock.',
    items: [
      {
        title: 'Claude Max',
        tags: ['anthropic', '$100 plan'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'The plan behind my Claude Code and Claude desktop usage — enough headroom for the heavier, repo-shaped sessions.',
        pros: ['Room for longer Claude Code runs'],
        cons: ['Still deciding how much belongs in desktop vs. CLI'],
      },
      {
        title: 'ChatGPT Pro',
        tags: ['openai', '$100 plan'],
        badge: 'daily',
        homepage: 'https://chatgpt.com',
        note: 'The plan behind my Codex work and GPT-5.5 access. I am still confirming the cleanest public-facing name for the exact Codex tier.',
        pros: ['Makes Codex a real daily agent instead of an occasional backup'],
        cons: ['Naming around the Codex tiers is easy to make too messy'],
      },
      {
        title: 'Warp Build',
        tags: ['warp', 'Build plan'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'The terminal plan that supports the interface where most of the workflow actually happens.',
        pros: ['Worth it because Warp is where the work happens'],
        cons: ['Oz is still in the evaluating bucket for me'],
      },
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
];
