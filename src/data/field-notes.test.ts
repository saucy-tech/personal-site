import { existsSync } from 'node:fs';
import path from 'node:path';

import { fieldNotesSections } from './field-notes';

const section = (id: string) => fieldNotesSections.find((entry) => entry.id === id)!;

describe('current notes stack', () => {
  it('keeps daily models distinct from occasional use and experiments', () => {
    const models = section('models').items;
    expect(models.filter((item) => item.badge === 'daily').map((item) => item.title)).toEqual([
      'Claude Opus 5.5',
      'Claude Fable 5.2',
    ]);
    expect(models.find((item) => item.title === 'Grok 4.7')?.badge).toBe('occasional');
    expect(models.find((item) => item.title === 'Claude Opus 5.5')?.tags).toContain('default');
    expect(models.map((item) => item.title)).toEqual([
      'Claude Opus 5.5',
      'Claude Fable 5.2',
      'Muse Wonder',
      'Grok 4.7',
      'Qwen3.8-27B',
    ]);
    for (const title of ['GPT-6 Astra', 'Claude Fable 5.1', 'GPT-6.1 Sol', 'GPT-6.1 Terra']) {
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

  it('keeps Grok Bot daily and Claude Duet an experiment', () => {
    const interfaces = section('interfaces').items;
    expect(interfaces.find((item) => item.title === 'Grok Bot')?.badge).toBe('daily');
    expect(interfaces.find((item) => item.title === 'Claude Duet')?.badge).toBe('experimenting');
    expect(section('interfaces').blurb).toContain('I use Grok Bot daily');
    expect(section('interfaces').blurb).toContain('experimenting with Claude Duet');
  });

  it('groups assistants with interfaces rather than a separate evaluating section', () => {
    expect(section('coding-agents').items.map((item) => item.title)).toEqual([
      'Claude Code',
      'OpenCode',
      'Codex',
    ]);
    expect(section('coding-agents').items.find((item) => item.title === 'Codex')?.badge).toBe(
      'occasional'
    );
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

  it('lists the X subscription on Super, not Premium', () => {
    const plan = section('subscriptions').items.find(
      (item) => item.title === 'The X Subscription'
    )!;
    expect(plan.tags).toContain('Super tier');
    expect(plan.note).toContain('Super');
    expect(plan.note).not.toContain('Premium');
    expect(
      section('subscriptions')
        .items.flatMap((item) => [item.note, ...(item.pros ?? [])])
        .join(' ')
    ).not.toContain('Premium');
  });

  it('uses the same icon for ChatGPT and Codex', () => {
    const codex = section('coding-agents').items.find((item) => item.title === 'Codex')!;
    const chatgpt = section('subscriptions').items.find(
      (item) => item.title === 'ChatGPT Pro 100'
    )!;
    expect(chatgpt.badge).toBe('occasional');
    expect(chatgpt.icon).toBe(`/icons/tools/${new URL(codex.homepage!).hostname}.png`);
  });

  it('documents the Claude Max API-credit benefit', () => {
    const plan = section('subscriptions').items.find((item) => item.title === 'Claude Max')!;
    expect(plan.tags).toContain('$100/mo');
    expect(plan.pros).toContainEqual(expect.stringContaining('$100/month in API credits'));
    expect(plan.pros).toContainEqual(expect.stringContaining('dictation software'));
  });

  it('condenses Cloudflare and keeps dictation tools in Tools', () => {
    const cloudflare = section('infrastructure').items.filter((item) =>
      item.title.startsWith('Cloudflare')
    );
    expect(cloudflare).toHaveLength(1);
    expect(cloudflare[0].tags).toEqual(expect.arrayContaining(['Workers', 'R2', 'Access', 'DNS']));
    const tools = section('tools').items;
    expect(tools.some((item) => item.title === 'Superwhisper')).toBe(false);
    const hex = tools.find((item) => item.title === 'Hex');
    expect(hex?.badge).toBe('daily');
    expect(hex?.tags).toEqual(expect.arrayContaining(['macOS', 'Windows', 'Linux']));
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
