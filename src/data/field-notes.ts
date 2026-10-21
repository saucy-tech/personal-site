/**
 * Notes (`/notes`) — how I actually work with AI right now.
 *
 * Sections follow the order the choice is actually made: the models, the
 * harnesses that run them inside a repo, the interfaces I drive those harnesses
 * from, and what I'm still evaluating — plus the subscriptions, infrastructure,
 * and utilities underneath. Harness = the agent loop (Claude Code, Codex, Grok Build, Cursor);
 * interface = the surface I sit in front of (T3 Code and Grok Bot).
 * The point is the loop, not the chat: give context, let an agent inspect the
 * repo, make edits, run tests/checks, review the output, iterate.
 *
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/notes`. */
export const fieldNotesLastUpdated = '2026-10-21';

export type FieldNoteStatus =
  | 'life'
  | 'coding-agents'
  | 'models'
  | 'interfaces'
  | 'evaluating'
  | 'subscriptions'
  | 'infrastructure'
  | 'tools';

export type FieldNoteBadge =
  'daily' | 'occasional' | 'experimenting' | 'learning' | 'paused' | 'watching';

/** Product marks drawn beside a subscription. */
export type FieldNoteMark = 'x' | 'grok' | 'cursor' | 'grok-bot';

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
  /** Product marks shown under the title, in this order. */
  marks?: FieldNoteMark[];
}

export interface FieldNoteSection {
  id: FieldNoteStatus;
  title: string;
  blurb: string;
  items: FieldNoteItem[];
}

export const fieldNotesSections: FieldNoteSection[] = [
  {
    id: 'life',
    title: 'Away from the keyboard',
    blurb: 'Faith, Bitcoin, and the things I keep coming back to.',
    items: [
      {
        title: 'Bitcoin',
        note: 'I save in Bitcoin. This is where I explain why and collect the resources I would share with someone curious.',
        link: { href: '/bitcoin', label: 'Why I save in Bitcoin' },
      },
      {
        title: 'Truth Chapel',
        note: 'My church. Livestreams and teaching are available on YouTube.',
        link: {
          href: 'https://www.youtube.com/@TruthChapelUPC/streams',
          label: 'Watch Truth Chapel',
        },
      },
    ],
  },
  {
    id: 'models',
    title: 'Models',
    blurb:
      'The raw horsepower. Opus 5.5, GPT-6.1 Sol, and Grok 4.7 carry the daily work; the rest come in when a job calls for them. The one local model, Qwen3.8-27B, runs at Q4_K_M quantization through llama.cpp.',
    items: [
      {
        title: 'Claude Opus 5.5',
        tags: ['anthropic', 'model', 'default'],
        badge: 'daily',
        homepage: 'https://www.anthropic.com',
        note: 'My default. The model behind most of my Claude Code sessions — planning, larger edits, and the long, context-heavy, repo-shaped work.',
        pros: [
          'Strong at planning and long sessions',
          'Tight, deterministic output on routine edits',
        ],
      },
      {
        title: 'GPT-6.1 Sol',
        tags: ['openai', 'model', 'second opinion'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My daily OpenAI model through Codex, and my go-to second read — a different angle when Claude and I keep circling the same answer.',
        pros: ['Useful contrast to the Anthropic models', 'Good at reading a repo cold'],
      },
      {
        title: 'Grok 4.7',
        tags: ['xai', 'model', 'grok build'],
        badge: 'daily',
        homepage: 'https://grok.com',
        note: 'xAI’s current model, run through Grok Build and covered by my X Subscription. A third daily read next to Claude and GPT.',
        pros: ['A third independent read in the daily rotation'],
      },
      {
        title: 'Claude Fable 5.1',
        tags: ['anthropic', 'model'],
        badge: 'occasional',
        homepage: 'https://www.anthropic.com',
        note: 'Anthropic’s top model. I bring it in when a problem is niche or hard enough to be worth it; Opus handles the rest.',
        pros: ['Careful on niche, hard problems'],
      },
      {
        title: 'GPT-6 Astra',
        tags: ['openai', 'model'],
        badge: 'occasional',
        homepage: 'https://openai.com',
        note: 'OpenAI’s flagship, saved for the jobs where Sol comes up short.',
        pros: ['The heavier OpenAI option when Sol is not enough'],
      },
      {
        title: 'Qwen3.8-27B',
        tags: ['qwen', 'model', 'llama.cpp', 'local'],
        badge: 'experimenting',
        homepage: 'https://github.com/ggml-org/llama.cpp',
        note: 'The only local model I still run. Qwen3.8-27B at Q4_K_M quantization, served by llama.cpp on the 3090.',
        pros: ['Private and local'],
      },
    ],
  },
  {
    id: 'coding-agents',
    title: 'Harnesses',
    blurb:
      'The agent loop itself — the thing that takes a model, gives it tools, and lets it inspect a repo, edit, and run checks. Claude Code, Codex, and Grok Build each run their own vendor’s models; Cursor covers the others. The interface I drive a harness from is a separate choice.',
    items: [
      {
        title: 'Claude Code',
        tags: ['anthropic', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'My default harness for high-context, repo-shaped work — planning, larger edits, and longer sessions where keeping the whole repo in view matters. Runs the Claude models; I drive it from T3 Code.',
        pros: ['Strong at planning and repo-shaped work', 'Holds context across longer sessions'],
        cons: ['I still pair it with Codex when I want a second read'],
      },
      {
        title: 'Codex',
        tags: ['openai', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'My implementation-and-inspection agent: fast at reading the repo, making focused edits, and running the test/check loop. I drive it through T3 Code, often as a second read against Claude Code.',
        pros: ['Quick into implementation and repo inspection', 'Clean inside T3 Code'],
        cons: ['I reach for Claude Code first on the largest, most context-heavy tasks'],
      },
      {
        title: 'Grok Build',
        tags: ['xai', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://grok.com',
        note: 'xAI’s coding agent, and the newest vendor harness in my rotation. It runs Grok 4.7 through the same inspect, edit, and check loop as the others, and comes with my X Subscription.',
        pros: ['Grok models in a real repo loop', 'Included with the X Subscription'],
        cons: ['Newest vendor harness — still learning where it beats the others'],
      },
      {
        title: 'Cursor',
        tags: ['cursor', 'app', 'coding agent'],
        badge: 'occasional',
        homepage: 'https://cursor.com',
        note: 'My occasional harness for models outside the vendor CLIs — Muse Wonder, Gemini, and whatever else I want in the same inspect, edit, and check loop. It comes with the X Subscription.',
        pros: [
          'Vendor-neutral — other models in the same loop',
          'Same repo workflow as the others',
        ],
        cons: ['Occasional by design — the vendor harnesses carry the daily work'],
      },
    ],
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    blurb: 'The surfaces I sit in front of.',
    items: [
      {
        title: 'T3 Code',
        tags: ['interface', 'multi-harness', 'daily driver'],
        badge: 'daily',
        homepage: 'https://t3.codes',
        note: 'Where I spend most of my time now. Not a harness — it sits on top of Claude Code, Codex, Grok Build, and Cursor and lets me run any of them from one window, with my models pinned to keyboard shortcuts so switching is a keystroke instead of a context rebuild.',
        pros: [
          'One interface over four harnesses',
          'Switch models and harnesses without leaving the flow',
        ],
      },
      {
        title: 'Grok Bot',
        tags: ['spacexsi', 'personal agent', 'app'],
        badge: 'daily',
        homepage: 'https://grok.com',
        note: 'SpaceXSI’s personal agent, and one of the two apps I actually work in, with T3 Code. It runs on its own cloud computer, signs into apps the way I would, and keeps working with my laptop closed. It comes with my X Subscription.',
        pros: ['Keeps working without my machine on'],
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
        title: 'Muse',
        tags: ['meta', 'personal agent'],
        badge: 'experimenting',
        homepage: 'https://muse.ai',
        note: 'Meta’s personal agent. I am testing it next to Grok Bot.',
        pros: ['A second personal agent to compare against Grok Bot'],
        cons: ['Too new to have an opinion yet'],
      },
      {
        title: 'Hermes Agent',
        tags: ['nous research', 'orchestration', 'command center'],
        badge: 'experimenting',
        homepage: 'https://hermes-agent.nousresearch.com',
        note: 'Nous Research’s agent harness, self-hosted on my home StartOS box. It takes work over a private Discord server and can kick off T3 Code sessions on my Mac over Tailscale. For me it is an async lane I can reach from my phone while most real work still happens locally.',
        pros: [
          'Remote control from my phone via Discord',
          'Private by default — no public exposure',
        ],
        cons: [
          'Still deciding what actually belongs in a remote lane versus Grok Bot and the local loop',
        ],
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
        title: 'The X Subscription',
        tags: ['spacexsi', 'Super tier', '$100/mo'],
        badge: 'daily',
        homepage: 'https://x.com',
        marks: ['x', 'grok', 'cursor', 'grok-bot'],
        note: 'SpaceXSI’s bundle of Grok, Cursor, and X Premium, on the Super tier at $100/mo. I am a heavy Grok Bot and Grok user, with occasional Cursor use on the same plan.',
        pros: [
          'One plan covers Grok, Grok Bot, Cursor, and X',
          'Replaces what used to be three separate subscriptions',
        ],
      },
      {
        title: 'Claude Max',
        tags: ['anthropic', '$100 plan'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'The plan behind my Claude Code and T3 Code usage — enough headroom for the heavier, repo-shaped sessions.',
        pros: ['Room for longer Claude Code runs'],
      },
      {
        title: 'ChatGPT Pro',
        tags: ['openai', '$100 plan'],
        badge: 'daily',
        homepage: 'https://chatgpt.com',
        note: 'The plan behind my Codex work and the GPT-6 models.',
        pros: ['Makes Codex a real daily agent instead of an occasional backup'],
      },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    blurb:
      'Where the work and the sites actually live — the Mac, the home GPU PC, the always-on VPS, hosting, and DNS.',
    items: [
      {
        title: 'M1 MacBook Pro',
        tags: ['apple silicon', 'local environment', 'hardware'],
        badge: 'daily',
        homepage: 'https://www.apple.com',
        note: 'Where the work actually happens. Not an AI tool, but the machine the harnesses edit on and the checks run against, and the default over the VPS for nearly everything. Still plenty of headroom for the whole stack of CLIs, editors, and a browser at once.',
        pros: ['Handles the full local toolchain comfortably', 'Quiet, cool, and always ready'],
        cons: ['Local model inference runs on the 3090 PC instead'],
      },
      {
        title: 'RTX 3090 PC',
        tags: ['nvidia', '24 GB VRAM', 'llama.cpp', 'hardware'],
        badge: 'occasional',
        homepage: 'https://www.nvidia.com',
        note: 'My Windows desktop with a 24 GB RTX 3090. It runs llama.cpp serving Qwen3.8-27B at Q4_K_M quantization over Tailscale so the Mac can use the local model without giving up laptop memory.',
        pros: [
          '24 GB of VRAM handles 30B open-weight models comfortably',
          'Shared with the Mac over Tailscale',
        ],
        cons: ['Only on when I need local inference or gaming'],
      },
      {
        title: 'Hostinger VPS',
        tags: ['hostinger', 'KVM 4', 'Ubuntu 24.04'],
        badge: 'daily',
        homepage: 'https://www.hostinger.com',
        note: 'My always-on Linux box — a Hostinger KVM 4 on Ubuntu 24.04. Workers handle all of my public web apps, so this server has one job: an always-on T3 Code host I can reach from anywhere through T3 Connect or Grok Bot, plus a Tailscale exit node. No public web ports are open; SSH only listens on Tailscale.',
        link: { href: 'https://www.hostinger.com?REFERRALCODE=62HBRANDOYK4', label: 'my referral' },
        pros: [
          'Always-on T3 Code host when my Mac is closed',
          'SSH over Tailscale only — no public ports open',
          'Doubles as a Tailscale exit node with automated daily backups',
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
        note: 'Push-to-talk dictation surface. Hold the hotkey, talk, release — audio is transcribed then processed by a model of my choice, including local models.',
        link: { href: 'https://superwhisper.com', label: 'superwhisper.com' },
        pros: [
          'Push-to-talk hotkey makes voice feel like a real input mode',
          'Choose transcription and processing models independently, including local models',
          'Modes for verbose dictation, summarized meeting notes, and clean prose',
        ],
        cons: [
          'Mode customization takes a beat to internalize when you build out more than a couple',
        ],
      },
      {
        title: 'Tailscale',
        tags: ['vpn', 'network'],
        badge: 'daily',
        homepage: 'https://tailscale.com',
        note: 'Zero-config mesh VPN that keeps my machines and VPS reachable securely.',
        pros: ['Simple secure networking across devices', 'Works well for remote agent access'],
      },
    ],
  },
];
