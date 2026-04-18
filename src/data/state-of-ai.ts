/**
 * Field notes (`/field-notes`) — same shape as a typical “stack” post:
 * Models → Harnesses → Subscriptions, then gear. Edit here to update copy.
 */

/** ISO date — bump when you revise tools or copy. Shown on `/field-notes`. */
export const stateOfAiLastUpdated = '2026-04-18';

export interface StateOfAiItem {
  index: string;
  title: string;
  tags: string[];
  description: string;
  pros: string[];
  cons: string[];
}

export interface StateOfAiSection {
  ordinal: string;
  id: string;
  title: string;
  items: StateOfAiItem[];
}

export const stateOfAiSections: StateOfAiSection[] = [
  {
    ordinal: '01',
    id: 'models',
    title: 'Models',
    items: [
      {
        index: '01',
        title: 'GPT 5.4',
        tags: ['openai', 'default', 'computer use'],
        description:
          'My daily default for simple computer-use tasks and general “get this done” work. Reliable, fast enough, good at following instructions.',
        pros: ['Solid all-rounder', 'Strong at tool calling and instruction following'],
        cons: ['Not where I reach for big, thoughtful UI work'],
      },
      {
        index: '02',
        title: 'GPT 5.4 Mini',
        tags: ['openai', 'fast', 'cheap'],
        description:
          'The sleeper. Stupid fast and cheap for small tasks, subagent-style searching, and anything I want to turn around quickly.',
        pros: ['Very fast', 'Cheap enough to use casually'],
        cons: ['Lacks the depth of the full 5.4 for harder problems'],
      },
      {
        index: '03',
        title: 'Opus 4.7',
        tags: ['anthropic', 'heavier', 'ui'],
        description:
          'What I reach for when I want more care and taste—longer reasoning, writing, and anything where I want it to feel pleasant to work with.',
        pros: ['Great for frontend / UI sensibility', 'Feels pleasant in long sessions'],
        cons: ['Expensive', 'Not as strong at raw tool-loop stamina'],
      },
      {
        index: '04',
        title: 'Sonnet 4.6',
        tags: ['anthropic', 'middle tier'],
        description:
          'Solid middle-tier workhorse. Fast enough to live with, smart enough for most day-to-day agent tasks.',
        pros: ['Good speed / capability tradeoff', 'Reliable in Claude Code and Cursor'],
        cons: ['Opus still wins on the harder / nicer-output stuff'],
      },
    ],
  },
  {
    ordinal: '02',
    id: 'harnesses',
    title: 'Harnesses',
    items: [
      {
        index: '01',
        title: 'Warp',
        tags: ['terminal', 'daily driver'],
        description:
          'My terminal. I live here—saved command blocks, reruns, and the in-terminal agent mean I rarely need to leave the shell just to ask a quick question.',
        pros: ['Reusable workflows', 'Agent is right next to the prompt'],
        cons: ['Another surface to keep in sync with editors and other agents'],
      },
      {
        index: '02',
        title: 'Claude (desktop)',
        tags: ['anthropic', 'thinking'],
        description:
          'Where I open Claude for longer thinking, writing, and anything that benefits from continuity outside an IDE. The app that feels most like “my workspace.”',
        pros: ['Home for long threads', 'Best surface for Opus-style work'],
        cons: ['Plan limits show up when it is your main tool'],
      },
      {
        index: '03',
        title: 'T3 Code',
        tags: ['t3', 'wrapper'],
        description:
          'Nice wrapper around Codex and Claude Code with less of the UI noise—fast, focused, and lets me use the CLIs under the hood without babysitting them.',
        pros: ['Very fast', 'Wraps the CLIs without getting in the way'],
        cons: ['Limited model selection to what it currently supports'],
      },
      {
        index: '04',
        title: 'Cursor',
        tags: ['editor', 'agents'],
        description:
          'My default IDE-shaped harness when I want the project context and cloud agents. Still the editor I reach for when the work is clearly “in a repo.”',
        pros: ['Tight editor + agent loop', 'Cloud agents are actually useful'],
        cons: ['Overlaps with other paid AI products', 'Can feel heavy next to the terminal flow'],
      },
      {
        index: '05',
        title: 'VS Code',
        tags: ['editor', 'plain'],
        description:
          'When I want a boring editor without agents in my face. Still my fallback for reading code and quick edits outside an AI loop.',
        pros: ['Boring in a good way', 'Extensions I already know'],
        cons: ['No native AI story I actually use'],
      },
      {
        index: '06',
        title: 'Claude Code',
        tags: ['anthropic', 'cli', 'terminal agent'],
        description:
          'Anthropic’s terminal agent for deep repo work. I mostly drive it through T3 Code these days, but I still reach for it directly when I want the raw Claude experience on a codebase. Sonnet 4.6 and Opus 4.7 under the hood.',
        pros: ['Strong agent for real repo work'],
        cons: ['Multi-session days need a system or you lose the plot'],
      },
      {
        index: '07',
        title: 'Codex',
        tags: ['openai', 'cli', 'terminal agent'],
        description:
          'OpenAI’s terminal agent for GPT 5.4 and 5.4 Mini. Great for quick, tool-using tasks from the shell; I usually run it through T3 Code too.',
        pros: ['Snappy with 5.4 Mini', 'Good fit for short, agentic asks'],
        cons: ['Another CLI to keep authed and in sync'],
      },
    ],
  },
  {
    ordinal: '03',
    id: 'subscriptions',
    title: 'Subscriptions',
    items: [
      {
        index: '01',
        title: 'Claude Pro — $20',
        tags: ['anthropic', 'personal'],
        description:
          'Personal Pro plan. This is the one I hit limits on fastest—if anything, I want more. I’m evaluating a $100 enhanced Claude Teams seat at work to stop bouncing off the caps.',
        pros: ['Best fit for how I think and write'],
        cons: ['I hit plan limits regularly', 'Teams-tier economics complicate the “right” answer'],
      },
      {
        index: '02',
        title: 'ChatGPT Plus — $20',
        tags: ['openai', 'codex'],
        description:
          'Mostly here for Codex access in the CLI and T3 Code. ChatGPT itself is a light-use utility for me.',
        pros: ['Unlocks Codex in the harnesses I actually use'],
        cons: ['Chat app alone isn’t what keeps me on it'],
      },
      {
        index: '03',
        title: 'Cursor Pro — $20',
        tags: ['cursor', 'evaluating'],
        description:
          'Paying for Cursor while I evaluate how much I want to live in the editor vs T3 Code + Warp. Jury’s still out.',
        pros: ['Full editor + cloud agents while I test it'],
        cons: ['Overlaps with other paid AI I already get value from'],
      },
      {
        index: '04',
        title: 'Warp Builder — $20',
        tags: ['warp', 'terminal'],
        description:
          'Unlocks the Warp agent and builder features in my daily terminal. Worth it because Warp is where I actually spend my time.',
        pros: ['Agent right where I already work'],
        cons: ['Another $20 in the stack'],
      },
    ],
  },
  {
    ordinal: '04',
    id: 'gear',
    title: 'Gear',
    items: [
      {
        index: '01',
        title: 'M1 MacBook Pro 16"',
        tags: ['16GB', '1TB', 'daily'],
        description:
          'Primary machine for development, writing, and most AI work. 16GB / 1TB—old but still gets the job done for almost everything I do.',
        pros: ['Screen, battery, Unix-ish ergonomics'],
        cons: ['16GB is getting tight for heavier local stuff'],
      },
      {
        index: '02',
        title: 'Custom PC — 5800X3D / RTX 3090 / 32GB',
        tags: ['gaming', 'occasional local inference'],
        description:
          'Desktop for games and the occasional poking at local models. Keeps play off the work laptop.',
        pros: ['Right tool for the Steam library', '3090 is still plenty of VRAM'],
        cons: ['Another OS to keep updated'],
      },
      {
        index: '03',
        title: 'Windows 11 (work)',
        tags: ['separate machine'],
        description:
          'Work-issued Windows 11 box for work-only tasks. Hard boundary between personal and work gear.',
        pros: ['Clean separation when it matters'],
        cons: ['More context switching across machines'],
      },
    ],
  },
];
