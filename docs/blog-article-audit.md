# Blog Article Audit

Date: 2026-03-27
Branch: `feat/blog-article-polish`
Baseline reviewed: `origin/main`

## What I audited

- Blog index at `src/app/blog/page.tsx`
- Article template at `src/app/blog/[slug]/page.tsx`
- Post metadata parsing at `src/utils/posts.ts`
- Taxonomy helpers at `src/utils/post-taxonomy.ts`
- Example posts in `src/posts/`
- Build, lint, and test status on this branch

## Current state

The blog archive on `origin/main` is stronger than the older live version that search engines have cached:

- It already has categories, tags, search, and better post cards.
- It already surfaces the latest post and gives the blog section more structure.
- It builds and tests cleanly on this branch.

The article page is still fairly minimal:

- Good: title, metadata chips, excerpt, and readable MDX rendering.
- Missing: stronger visual hierarchy inside the article body, better image treatment, and more intentional spacing for short-form posts.

## Small audit

### What is working

- The writing itself is clear and readable.
- The new archive direction on `origin/main` is a meaningful improvement over the older simple list layout.
- The article page keeps distractions low, which fits reflective writing.
- Category, series, and tag metadata help readers understand what kind of post they are opening.

### What feels weak

- The article body is mostly default `prose prose-invert`, so posts do not feel very branded.
- Short posts around 300 to 400 words can feel visually abrupt because the page structure is taller and heavier than the content.
- Images and captions are not getting a custom presentation, so they can feel dropped into the page instead of composed.
- There is no reading-time hint, no progress cue, and no contextual “what next?” after finishing a post.
- The subscribe section is useful, but as the only post-footer element it can make the ending feel transactional instead of editorial.

## Formatting suggestions for 300 to 400 word posts

For shorter devotional or reflective posts, favor rhythm over density:

- Open with a 1 to 2 sentence hook before the first heading.
- Use 2 to 4 `##` sections max.
- Keep paragraphs short, usually 2 to 4 lines.
- Use one emphasized line only when it truly earns attention.
- End with one clear landing point: reflection question, takeaway, or prayer.

For this site specifically:

- Add a lead deck below the title. You already have the excerpt; style it as the article’s thesis.
- Increase line-height slightly inside articles and narrow the reading width to keep short pieces feeling intentional.
- Give headings more top spacing so each section feels like a beat, not just a font change.
- Style blockquotes as featured reflections or scripture callouts.
- Give images rounded corners, a border, and a muted caption style.
- Add a compact footer with “Read next” or “More in this category” above the subscribe form.

## Recommended UI improvements

### High-value, low-risk

- Add estimated reading time beside the date.
- Add custom typography classes for article content instead of relying only on default Tailwind Typography.
- Style `img`, `figcaption`, `blockquote`, `hr`, and list spacing in article content.
- Add a post footer with one related post or one “latest Daily Word” link.

### Good next step after that

- Add a subtle article hero treatment for the title area.
- Add previous and next post navigation.
- Add MDX component support for callouts or scripture blocks.

### Probably unnecessary right now

- Table of contents for short posts.
- Heavy animations inside article content.
- Complex sidebars on mobile-first reading pages.

## Branching and merge advice

You are new to this, so keep the workflow boring and predictable:

1. Start feature work from the latest remote main, not an older local branch.
2. If a security PR is already open and likely to merge soon, let it merge first when possible.
3. If you do not want to wait, keep working on this feature branch and rebase onto `main` after the security PR lands.

For this repo, the open security work appears dependency-focused. That usually means:

- Lower chance of merge conflicts in blog UI files.
- Higher chance of lockfile churn if you branch from an older commit.

So the practical answer is:

- Best/easiest: merge the security PR into `main`, then rebase this branch onto the updated `main`.
- Also acceptable: keep building article polish now, then rebase once the security PR lands.

What you want to avoid is what happened in the older worktree:

- branching from a stale local `main`
- doing feature work there
- then realizing the real `origin/main` moved ahead underneath you

## Verification on this branch

- `pnpm install`
- `pnpm lint`
- `pnpm test`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000 pnpm build`

All passed.

One follow-up note:

- Next.js 16.2.1 warns that `middleware.ts` should move to the newer `proxy` convention eventually. That is not a blocker for article design work, but it is worth tracking.
