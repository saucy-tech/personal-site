import { existsSync } from 'node:fs';
import path from 'node:path';

import { fieldNotesSections } from './field-notes';

const section = (id: string) => fieldNotesSections.find((entry) => entry.id === id)!;

describe('current notes stack', () => {
  it('keeps daily models distinct from occasional use and experiments', () => {
    const models = section('models').items;
    expect(models.filter((item) => item.badge === 'daily').map((item) => item.title)).toEqual([
      'Claude Opus 5.5',
      'GPT-6.1 Sol',
      'GPT-6.1 Terra',
    ]);
    expect(models.find((item) => item.title === 'Grok 4.7')?.badge).toBe('occasional');
    expect(models.map((item) => item.title)).toEqual([
      'Claude Opus 5.5',
      'GPT-6.1 Sol',
      'GPT-6.1 Terra',
      'Muse Wonder',
      'Grok 4.7',
      'Qwen3.8-27B',
    ]);
    for (const title of ['GPT-6 Astra', 'Claude Fable 5.1']) {
      expect(models.map((item) => item.title)).not.toContain(title);
    }
  });
  it('orders each section from daily to occasional to experimenting', () => {
    const rank: Record<string, number> = { daily: 0, occasional: 1, experimenting: 2 };
    for (const entry of fieldNotesSections) {
      const ranks = entry.items
        .filter((item) => item.badge && item.badge in rank)
        .map((item) => rank[item.badge!]);
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it('uses the same icon for ChatGPT and Codex', () => {
    const codex = section('coding-agents').items.find((item) => item.title === 'Codex')!;
    const chatgpt = section('subscriptions').items.find(
      (item) => item.title === 'ChatGPT Pro 100'
    )!;
    expect(chatgpt.icon).toBe(`/icons/tools/${new URL(codex.homepage!).hostname}.png`);
  });

  it('groups assistants with interfaces rather than a separate evaluating section', () => {
    expect(section('coding-agents').items.map((item) => item.title)).toEqual([
      'Claude Code',
      'Codex',
      'OpenCode',
    ]);
    expect(section('interfaces').items.map((item) => item.title)).toEqual([
      'T3 Code',
      'Grok Bot',
      'Claude Duet',
      'Muse',
    ]);
    expect(fieldNotesSections.map((entry) => entry.id)).not.toContain('evaluating');
    expect(
      fieldNotesSections.flatMap((entry) => entry.items).map((item) => item.title)
    ).not.toContain('Hermes Agent');
  });

  it('documents both $100 subscriptions and their API-credit benefit', () => {
    for (const title of ['Claude Max', 'ChatGPT Pro 100']) {
      const plan = section('subscriptions').items.find((item) => item.title === title)!;
      expect(plan.tags).toContain('$100/mo');
      expect(plan.pros).toContainEqual(expect.stringContaining('$100/month in API credits'));
      expect(plan.pros).toContainEqual(expect.stringContaining('dictation software'));
    }
  });

  it('condenses Cloudflare and keeps dictation tools in Tools', () => {
    const cloudflare = section('infrastructure').items.filter((item) =>
      item.title.startsWith('Cloudflare')
    );
    expect(cloudflare).toHaveLength(1);
    expect(cloudflare[0].tags).toEqual(expect.arrayContaining(['Workers', 'R2', 'Access', 'DNS']));
    const tools = section('tools').items;
    expect(tools.find((item) => item.title === 'Superwhisper')?.tags).toContain('Windows');
    expect(tools.find((item) => item.title === 'Hex')?.badge).toBe('experimenting');
  });

  it('has a local image for every product icon and homepage favicon', () => {
    for (const item of fieldNotesSections.flatMap((entry) => entry.items)) {
      if (!item.homepage || item.marks) continue;
      const hostname = new URL(item.homepage).hostname.replace(/^www\./, '');
      const icon = item.icon ?? `/icons/tools/${hostname}.png`;
      expect(existsSync(path.join(process.cwd(), 'public', icon))).toBe(true);
    }
  });
});
