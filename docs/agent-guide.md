# Agent guide

This is the tracked agent guide for Brandon's personal site. Keep it short,
practical, and grounded in the current repo.

## Project shape

- Next.js App Router site with local content in `src/`.
- Blog posts live in `src/posts/*.mdx`.
- Home, portfolio, Bitcoin, support, and Field notes pages live under
  `src/app/`.
- Shared content data usually lives in `src/data/`.
- Shared UI components live in `src/components/`.

## Field notes style

Field notes is a personal AI/tooling snapshot, not a product review page.

- Keep Brandon's current restrained formatting. Do not copy another person's
  page wholesale.
- Borrow useful terminology when it clarifies the stack: `harnesses`,
  `subscriptions`, `agents`, `models`, `tools`, and `paused`.
- Use `Harnesses` for the surfaces Brandon works through, such as Warp,
  Claude Code, Codex CLI, and desktop apps.
- Use `Subscriptions` for paid plans. Prefer clean plan names over noisy price
  copy inside every tool tag.
- Use `Agents` for orchestration/cloud-agent workflows such as Hermes and Oz.
- Use `Paused` for tools Brandon respects but is not currently using.
- Short notes beat long paragraphs. The page should feel like field notes, not
  an essay.
- Lightweight `+` and `-` notes are good when they help scanning. Keep them
  close to the item and avoid stretching them across the page.
- Preserve Brandon's voice: direct, personal, and specific. Avoid generic AI
  review language.

## Visual style

- Prefer readable, narrow content columns for text-heavy pages.
- Avoid full-width note layouts that make short observations feel sprawled out.
- Section headings should feel attached to their content.
- Keep badges small and useful: `daily`, `learning`, `watching`, `paused`.
- Do not turn Field notes into a hard S/A/B/C tier list unless Brandon asks
  for that exact format again.

## Git hygiene

- Never push directly to `main`.
- Open draft PRs for non-trivial site, content, or docs changes.
- Preserve unrelated local edits. If the worktree is mixed, stage explicit
  paths only.
- Devotion branches may exist locally and remotely. Deleting local devotion
  branches is fine when their remote branch should remain untouched.

## Validation

- Use `pnpm check` for focused TypeScript/UI/content-data changes.
- Use `pnpm quality:gate` before larger PRs or post/content pipeline changes.
