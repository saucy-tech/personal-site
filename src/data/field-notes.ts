/**
 * Notes (`/notes`) — how I actually work with AI right now.
 *
 * Sections follow the order the choice is actually made: the models, the
 * harnesses that run them inside a repo, the interfaces I drive those harnesses
 * from — plus the subscriptions, infrastructure, and utilities underneath.
 * Harness = the agent loop (Claude Code, Codex, and OpenCode); interface =
 * the surface I sit in front of (T3 Code, Grok Bot, Claude Duet, and Muse).
 * Experiments live alongside daily tools, distinguished by their badges.
 * The point is the loop, not the chat: give context, let an agent inspect the
 * repo, make edits, run tests/checks, review the output, iterate.
 *
 * Edit here to update copy; bump `fieldNotesLastUpdated` when you revise.
 */

/** ISO date — bump when you revise items or copy. Shown on `/notes`. */
export const fieldNotesLastUpdated = '2026-11-03';

export type FieldNoteStatus =
  'life' | 'coding-agents' | 'models' | 'interfaces' | 'subscriptions' | 'infrastructure' | 'tools';

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
  /** Local product icon when a shared homepage favicon is not specific enough. */
  icon?: string;
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
      'Opus 5.5, GPT-6.1 Sol, and GPT-6.1 Terra carry my daily work. Muse Wonder and Grok 4.7 are occasional choices, with Grok mainly coming through Grok Bot or Cursor. The one local model, Qwen3.8-27B, runs at Q4_K_M quantization through llama.cpp.',
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
        title: 'GPT-6.1 Terra',
        tags: ['openai', 'model'],
        badge: 'daily',
        homepage: 'https://openai.com',
        note: 'Another daily OpenAI model through Codex, alongside Sol. Both are part of my regular rotation next to Opus.',
      },
      {
        title: 'Muse Wonder',
        tags: ['meta', 'model', 'opencode'],
        badge: 'occasional',
        homepage: 'https://dev.meta.ai',
        note: 'Meta’s model, run through OpenCode. It is not a frontier coding model, but it is better than that sounds — I like how it has worked and how it responds, so it stays in the rotation for occasional use.',
        pros: [
          'Better than its tier suggests on real work',
          'A response style I keep coming back to',
        ],
      },
      {
        title: 'Grok 4.7',
        tags: ['xai', 'model'],
        badge: 'occasional',
        homepage: 'https://grok.com',
        note: 'An occasional third perspective, mainly when Grok Bot or Cursor uses it. Opus, Sol, and Terra are the daily drivers.',
        pros: ['Another perspective outside the Claude and GPT pairing'],
      },
      {
        title: 'Qwen3.8-27B',
        tags: ['qwen', 'model', 'llama.cpp', 'local'],
        badge: 'experimenting',
        homepage: 'https://qwen.ai',
        note: 'The only local model I still run. Qwen3.8-27B at Q4_K_M quantization, served by llama.cpp on the 3090.',
        pros: ['Private and local'],
      },
    ],
  },
  {
    id: 'coding-agents',
    title: 'Harnesses',
    blurb:
      'The agent loop itself — the thing that takes a model, gives it tools, and lets it inspect a repo, edit, and run checks. Claude Code and Codex carry the daily work; OpenCode covers other providers and my local model. I drive them from T3 Code.',
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
        title: 'OpenCode',
        tags: ['open source', 'cli', 'coding agent'],
        badge: 'daily',
        homepage: 'https://opencode.ai',
        note: 'The open-source harness, and the one I run Muse Wonder through. It is also how the local model fits the loop: OpenCode talks to llama.cpp on the RTX 3090 PC, which serves Qwen3.8-27B at Q4_K_M quantization, so the same inspect, edit, and check workflow runs against a model on my own hardware.',
        pros: [
          'Vendor-neutral — cloud and local models in the same loop',
          'Runs the 3090’s Qwen3.8-27B through llama.cpp',
        ],
        cons: ['One more harness to keep configured next to the vendor CLIs'],
      },
    ],
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    blurb:
      'T3 Code is my main coding interface. Grok Bot and Claude Duet are my assistants; Muse is another experiment in that same category.',
    items: [
      {
        title: 'T3 Code',
        tags: ['interface', 'multi-harness', 'daily driver'],
        badge: 'daily',
        homepage: 'https://t3.codes',
        note: 'My main interface and where I spend most of my time. Not a harness — it sits on top of Claude Code, Codex, and OpenCode and lets me run them from one window, with my models pinned to keyboard shortcuts so switching is a keystroke instead of a context rebuild.',
        pros: [
          'One interface over my coding harnesses',
          'Switch models and harnesses without leaving the flow',
        ],
      },
      {
        title: 'Grok Bot',
        tags: ['spacexsi', 'personal agent', 'app'],
        badge: 'daily',
        homepage: 'https://grok.com',
        note: 'One of my assistants alongside Claude Duet. It runs on its own cloud computer, signs into apps the way I would, and keeps working with my laptop closed. Occasional Cursor work happens through here rather than in a separate harness I sit in. It comes with my X Subscription.',
        pros: ['Keeps working without my machine on', 'Dispatches Cursor cloud agents'],
      },
      {
        title: 'Claude Duet',
        tags: ['anthropic', 'personal agent', 'app'],
        badge: 'experimenting',
        homepage: 'https://claude.com/product/claude-duet',
        icon: '/icons/tools/claude-duet.svg',
        note: 'The new assistant I am most excited about. I am experimenting with it alongside Grok Bot: an ongoing thread with Claude that can work in connected apps, keep going while I am away, and come back when it needs my attention or approval.',
        link: { href: 'https://claude.com/product/claude-duet', label: 'Claude Duet' },
        pros: [
          'Carries over my Claude memory, skills, and connected apps',
          'Keeps working on its own cloud computer',
        ],
      },
      {
        title: 'Muse',
        tags: ['meta', 'personal agent'],
        badge: 'experimenting',
        homepage: 'https://muse.ai',
        note: 'Meta’s personal agent. Another interface I am experimenting with alongside Grok Bot and Claude Duet.',
        pros: ['Another personal assistant to compare against Grok Bot and Duet'],
        cons: ['Too new to have an opinion yet'],
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
        tags: ['anthropic', '$100/mo'],
        badge: 'daily',
        homepage: 'https://claude.ai',
        note: 'My $100/month Claude plan, now simply called Max. It supports my Claude Code work through T3 Code and my experiments with Claude Duet.',
        pros: [
          'Room for longer Claude Code runs',
          '$100/month in API credits for my own builds and API-backed third-party tools, including dictation software',
        ],
      },
      {
        title: 'ChatGPT Pro 100',
        tags: ['openai', '$100/mo'],
        badge: 'daily',
        homepage: 'https://chatgpt.com',
        icon: '/icons/tools/openai.com.png',
        note: 'My $100/month ChatGPT Pro tier, behind my daily Codex work with GPT-6.1 Sol and Terra.',
        pros: [
          'Makes Codex a real daily agent instead of an occasional backup',
          '$100/month in API credits for my own builds and API-backed third-party tools, including dictation software',
        ],
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
        title: 'Cloudflare',
        tags: ['Workers', 'R2', 'Access', 'DNS', 'domains'],
        badge: 'daily',
        homepage: 'https://www.cloudflare.com',
        note: 'One platform underneath my sites: Workers hosts the public apps, including this one and morningportion.com; R2 holds files and object storage; Access keeps private apps behind a login; DNS and Registrar handle my domains. Next.js apps deploy through OpenNext, while simpler sites ship as plain assets.',
        pros: [
          'Hosting, storage, private-app access, and domains in one dashboard',
          'OpenNext for Next.js; plain assets for simpler sites',
        ],
        cons: [
          'The Workers runtime is not Node, so some npm packages need a compatibility flag or a swap',
        ],
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
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    blurb: 'Companion utilities and helper surfaces that support my workflow.',
    items: [
      {
        title: 'Hex',
        tags: ['voice', 'dictation', 'macOS', 'Windows', 'Linux', 'open source'],
        badge: 'daily',
        homepage: 'https://anoma.ly/hex/',
        icon: '/icons/tools/hex.svg',
        note: 'Free, open-source local dictation from Anomaly, the team behind OpenCode. It replaced Superwhisper for me: hold a shortcut, speak, and it transcribes on the device with Parakeet or Cohere models and pastes into the app I am using. Post-processing is optional, and it can run through the Claude Code and OpenAI subscriptions I already pay for.',
        link: { href: 'https://anoma.ly/hex/', label: 'Hex' },
        pros: [
          'Runs on Mac, Windows and Linux at no cost',
          'On-device transcription with Parakeet and Cohere models',
          'Post-processing through my existing Claude Code and OpenAI subscriptions when I want it',
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
