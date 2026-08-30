/**
 * Field notes (`/field-notes`) — how I actually work with AI right now.
 *
 * Sections follow the order the choice is actually made: the models, the
 * harnesses that run them inside a repo, the interfaces I drive those harnesses
 * from, and what I'm still evaluating — plus the subscriptions, infrastructure,
 * and utilities underneath. Harness = the agent loop (Claude Code, Codex, OpenCode);
 * interface = the surface I sit in front of (T3 Code, Warp, the desktop apps).
 * The point is the loop, not the chat: give context, let an agent inspect the
 * repo, make edits, run tests/checks, review the output, iterate.
 *
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/field-notes`. */
export const fieldNotesLastUpdated = '2026-08-30';

export type FieldNoteStatus =
  | 'coding-agents'
  | 'models'
  | 'interfaces'
  | 'evaluating'
  | 'subscriptions'
  | 'infrastructure'
  | 'tools';

export type FieldNoteBadge =
  'daily' | 'occasional' | 'experimenting' | 'learning' | 'paused' | 'watching';

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
    id: 'models',
    title: 'Models',
    blurb: 'The raw horsepower. Seven models, pinned ⌘1–⌘7 in T3 Code.',
    items: [
      {
        title: 'Claude Fable 5',
        tags: ['anthropic', 'model', 'default'],
        badge: 'daily',
        homepage: 'https://www.anthropic.com',
        note: 'My default. The model behind most of my Claude Code sessions — the one I hand the large, context-heavy, repo-shaped work to.',
        pros: ['Strongest at planning and long sessions', 'Careful on niche problems'],
      },
      {
        title: 'Claude Opus 5',
        tags: ['anthropic', 'model'],
        badge: 'daily',
        homepage: 'https://www.anthropic.com',
        note: 'The everyday Anthropic model when I do not need Fable — fast, precise, and still the one I trust for tight, deterministic output.',
        pros: ['Quick and reliable for routine edits', 'Same harness, lower cost'],
      },
      {
        title: 'GPT-5.6-Sol',
        tags: ['openai', 'model', 'second opinion'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'The heavier of the two GPT-5.6 variants, and my go-to second read through Codex — a different angle when Claude and I keep circling the same answer.',
        pros: ['Useful contrast to the Anthropic models', 'Good at reading a repo cold'],
      },
      {
        title: 'GPT-5.6 Luna',
        tags: ['openai', 'model', 'opencode go'],
        badge: 'daily',
        homepage: 'https://opencode.ai',
        note: 'The lighter GPT-5.6 variant, run through OpenCode Go. Fast into focused edits when I do not need Sol.',
        pros: ['Fast into implementation', 'A lighter option for routine work'],
      },
      {
        title: 'Kimi K3',
        tags: ['moonshot', 'model', 'opencode'],
        badge: 'daily',
        homepage: 'https://www.kimi.com',
        note: 'Moonshot’s model, run through OpenCode Go inside T3 Code. A different read from Claude and GPT without leaving the same loop.',
        pros: ['Open weights', 'A genuinely different read from the big two'],
      },
      {
        title: 'GPT-OSS 20B',
        tags: ['openai', 'model', 'opencode', 'ollama', 'local'],
        badge: 'daily',
        homepage: 'https://ollama.com',
        note: 'The fast local model running through OpenCode and Ollama on my home 3090.',
        pros: ['Private and local', 'Fast enough for routine work'],
      },
      {
        title: 'Qwen3.8 27B',
        tags: ['alibaba', 'model', 'opencode', 'ollama', 'local'],
        badge: 'daily',
        homepage: 'https://ollama.com',
        note: 'The smarter local option on the same 3090 when the job can afford a slower pass.',
        pros: ['Private and local', 'More capable than the fast 20B option'],
      },
    ],
  },
  {
    id: 'coding-agents',
    title: 'Harnesses',
    blurb:
      'The agent loop itself — the thing that takes a model, gives it tools, and lets it inspect a repo, edit, and run checks. Claude Code and Codex each run their own vendor’s models; OpenCode runs anything. The interface I drive a harness from is a separate choice.',
    items: [
      {
        title: 'Claude Code',
        tags: ['anthropic', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'My default harness for high-context, repo-shaped work — planning, larger edits, and longer sessions where keeping the whole repo in view matters. Runs the Claude models; I drive it from T3 Code or Warp.',
        pros: ['Strong at planning and repo-shaped work', 'Holds context across longer sessions'],
        cons: ['I still pair it with Codex when I want a second read'],
      },
      {
        title: 'Codex',
        tags: ['openai', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My implementation-and-inspection agent: fast at reading the repo, making focused edits, and running the test/check loop. I drive it through T3 Code or Warp, often as a second read against Claude Code.',
        pros: ['Quick into implementation and repo inspection', 'Clean inside T3 Code and Warp'],
        cons: ['I reach for Claude Code first on the largest, most context-heavy tasks'],
      },
      {
        title: 'OpenCode',
        tags: ['open source', 'cli', 'coding agent'],
        badge: 'experimenting',
        homepage: 'https://opencode.ai',
        note: 'The open-source harness, and the only one of the three that is not tied to a single vendor. I run Luna and Kimi through the Go plan, plus GPT-OSS and Qwen locally through Ollama on my 3090.',
        pros: [
          'Vendor-neutral — any model in the same loop',
          'Same repo workflow as the other two',
        ],
        cons: ['Still deciding how much work it earns next to Claude Code and Codex'],
      },
    ],
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    blurb: 'The surfaces I sit in front of. An interface hosts a harness; it does not replace one.',
    items: [
      {
        title: 'T3 Code',
        tags: ['interface', 'multi-harness', 'daily driver'],
        badge: 'daily',
        homepage: 'https://t3.codes',
        note: 'Where I spend most of my time now. Not a harness — it sits on top of Claude Code, Codex, and OpenCode and lets me run any of them from one window, with seven models pinned to ⌘1–⌘7 so switching is a keystroke instead of a context rebuild.',
        pros: [
          'One interface over three harnesses',
          'Switch models and harnesses without leaving the flow',
        ],
        cons: ['Warp still wins when I just want a terminal'],
      },
      {
        title: 'Warp',
        tags: ['terminal', 'interface', 'daily driver'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'The terminal, and the second surface after T3 Code. Anything that is not an agent session — git, deploys, the odd CLI run — happens here, and it is still where I drop to when I want the raw CLIs.',
        link: { href: 'https://app.warp.dev/referral/3MJVPD', label: 'my referral' },
        pros: ['Keeps a real terminal in the loop', 'Works naturally with both major CLIs'],
        cons: ['Still learning where Oz fits alongside it'],
      },
      {
        title: 'Claude desktop',
        tags: ['anthropic', 'desktop app'],
        badge: 'occasional',
        homepage: 'https://claude.ai',
        note: 'Mostly for chat — conversation and thinking out loud rather than repo edits, which stay in Claude Code. In the rotation, but a smaller share of my week than it used to be.',
        pros: ['Good for conversation and thinking out loud'],
        cons: ['Not a replacement for Claude Code on repo work'],
      },
      {
        title: 'Codex desktop',
        tags: ['openai', 'desktop app'],
        badge: 'occasional',
        homepage: 'https://openai.com',
        note: 'Where my scheduled tasks live. Recurring jobs run here on a timer while the interactive Codex work happens in T3 Code.',
        pros: ['Scheduled tasks without a server or cron to babysit'],
        cons: ['Little reason to open it outside the schedule'],
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
        title: 'Hermes Agent',
        tags: ['nous research', 'orchestration', 'command center'],
        badge: 'experimenting',
        homepage: 'https://hermes-agent.nousresearch.com',
        note: 'Nous Research’s agent harness, self-hosted on the VPS. It can coordinate Claude Code and Codex as workers and take work over a Telegram gateway, all over Tailscale rather than the public internet. For me it is the remote and async lane — a job I can kick off from my phone — while most real work still happens locally on the Mac.',
        pros: [
          'Remote control from my phone via Telegram',
          'Private by default — no public exposure',
        ],
        cons: ['Still deciding what actually belongs in a remote lane versus the local loop'],
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
        note: 'The plan behind my Claude Code, T3 Code, and Claude desktop usage — enough headroom for the heavier, repo-shaped sessions.',
        pros: ['Room for longer Claude Code runs'],
        cons: ['Still deciding how much belongs in desktop vs. CLI'],
      },
      {
        title: 'ChatGPT Pro',
        tags: ['openai', '$100 plan'],
        badge: 'daily',
        homepage: 'https://chatgpt.com',
        note: 'The plan behind my Codex work and GPT-5.6 access. I am still confirming the cleanest public-facing name for the exact Codex tier.',
        pros: ['Makes Codex a real daily agent instead of an occasional backup'],
        cons: ['Naming around the Codex tiers is easy to make too messy'],
      },
      {
        title: 'OpenCode Go',
        tags: ['opencode', 'Go plan'],
        badge: 'experimenting',
        homepage: 'https://opencode.ai',
        note: 'The plan behind OpenCode and my Kimi K3 access. Cheap enough to keep a third harness in the rotation without thinking about it.',
        pros: ['Puts an open-weight model in the same loop as the big two'],
        cons: ['Only earns its slot if OpenCode does'],
      },
      {
        title: 'Warp Build',
        tags: ['warp', 'Build plan'],
        badge: 'daily',
        homepage: 'https://warp.dev',
        note: 'The terminal plan behind my second surface.',
        pros: ['Worth it for a terminal I open every day'],
        cons: ['Oz is still in the evaluating bucket for me'],
      },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    blurb:
      'Where the work and the sites actually live — the local box, the always-on box, hosting, and DNS.',
    items: [
      {
        title: 'M1 MacBook Pro',
        tags: ['apple silicon', 'local environment', 'hardware'],
        badge: 'daily',
        homepage: 'https://www.apple.com',
        note: 'Where the work actually happens. Not an AI tool, but the machine the harnesses edit on and the checks run against, and the default over the VPS for nearly everything. Still plenty of headroom for the whole stack of CLIs, editors, and a browser at once.',
        pros: ['Handles the full local toolchain comfortably', 'Quiet, cool, and always ready'],
        cons: ['Heavier model and container work still belongs on the VPS'],
      },
      {
        title: 'Hostinger VPS',
        tags: ['hostinger', 'KVM 4', 'Ubuntu 24.04'],
        badge: 'daily',
        homepage: 'https://www.hostinger.com',
        note: 'My always-on server — a Hostinger KVM 4 box on Ubuntu 24.04. It complements Cloudflare rather than replacing it: Workers stay the default for public web apps, while this runs Docker workloads, private tools, background jobs, and Hermes. Access is private-first over Tailscale, with only SSH and HTTP/S exposed publicly.',
        link: { href: 'https://www.hostinger.com?REFERRALCODE=62HBRANDOYK4', label: 'my referral' },
        pros: [
          'Always-on home for self-hosted services and agents',
          'Private-first access over Tailscale keeps the surface small',
          'Cheap, predictable place to run long-lived processes Workers are not meant for',
        ],
        cons: ['I own the patching, backups, and uptime myself'],
      },
      {
        title: 'Cloudflare Workers',
        tags: ['hosting', 'next.js', 'opennext', 'edge'],
        badge: 'daily',
        homepage: 'https://workers.cloudflare.com',
        note: 'Where my public sites live, including this one and morningportion.com. Next.js apps ship through the OpenNext adapter, so the same App Router codebase runs at the edge instead of on a Node server. Static things skip the framework entirely and deploy as plain assets. Moving here from Vercel put hosting, DNS, storage, and access control on one bill and one dashboard.',
        pros: [
          'One platform for hosting, DNS, KV, R2, and access control',
          'OpenNext runs a normal Next.js codebase at the edge with no rewrite',
          'Static sites deploy as assets with no framework overhead',
        ],
        cons: [
          'The Workers runtime is not Node, so some npm packages need a compatibility flag or a swap',
        ],
      },
      {
        title: 'Cloudflare Access',
        tags: ['zero-trust', 'auth', 'sso'],
        badge: 'daily',
        homepage: 'https://www.cloudflare.com/zero-trust/products/access/',
        note: 'How my private apps stay private without building auth. A one-time-code login sits in front of the whole origin, so tools like my workout logger and a few family apps are reachable from any device but open to nobody else. It is the reason those projects can be genuinely useful to me and still never expose a login form to the internet.',
        pros: [
          'Real access control on a personal project without writing an auth system',
          'One-time email codes mean no password to manage',
          'Applies to the origin, so nothing leaks if a route is forgotten',
        ],
        cons: ['Anything behind it cannot be shown off without a separate sanitized build'],
      },
      {
        title: 'Cloudflare DNS and Registrar',
        tags: ['dns', 'domains', 'registrar'],
        badge: 'daily',
        homepage: 'https://www.cloudflare.com',
        note: 'My DNS and domain registrar — the layer that points every domain at Workers, the VPS, and everything else. At-cost domain pricing and fast DNS make it the quiet foundation under the whole stack.',
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
