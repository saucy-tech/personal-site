# Portfolio Hiring Gap Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close gaps between saucy.tech and Codecademy's [software developer portfolio tips](https://www.codecademy.com/resources/blog/software-developer-portfolio-tips) — visible contact, resume download, LinkedIn, recruiter-facing About copy, professional work summary, and stronger OSS proof links.

**Architecture:** Extend `/portfolio` with a hiring-focused hero (About + contact + resume CTA) without rebuilding the link-hub homepage. Reuse existing `PageLayout`, `ProjectCard`, and data files. Add footer contact links site-wide. Keep faith/personal tone on `/`; put engineering positioning on `/portfolio`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, existing `src/data/projects.ts` / `awards.ts`, Playwright smoke tests.

**Audit reference (2026-05-21):** Homepage promised "résumé" but `/portfolio` had no resume; no visible email or LinkedIn; bio not recruiter-oriented; no gov/pro work project card; Warp linked to marketing site not PR.

**Related plan:** `Career-Dev/docs/superpowers/plans/2026-05-21-resume-codecademy-gap-fixes.md` (exports `Brandon_Sauceda_Resume_ATS.pdf`).

**Repo:** `/Users/brandon/Developer/personal-site`

---

## File map

| File | Change |
|------|--------|
| `public/Brandon_Sauceda_Resume.pdf` | Canonical resume download |
| `src/app/portfolio/page.tsx` | Hiring hero + resume section |
| `src/data/projects.ts` | Gov-work card, Warp PR links, CDC URL, bump date |
| `src/data/portfolio-about.ts` | **Create** — recruiter About copy |
| `src/components/layout/Footer.tsx` | Email + LinkedIn |
| `src/app/page.tsx` | Fix portfolio card meta (accurate after resume ships) |
| `src/utils/constants.ts` | Hiring-oriented default description |
| `src/app/layout.tsx` | Metadata keywords/description |
| `tests/e2e/smoke.spec.ts` | Assert resume link + contact |
| `README.md` | Document resume PDF refresh workflow |

---

### Task 1: Add canonical resume PDF

**Files:**
- Create: `public/Brandon_Sauceda_Resume.pdf`

- [ ] **Step 1: Copy PDF from Career-Dev**

After Resume Plan Task 10, run:

```bash
cp /Users/brandon/Documents/Career-Dev/01_Current_Packet/Resume/Brandon_Sauceda_Resume_ATS.pdf \
   /Users/brandon/Developer/personal-site/public/Brandon_Sauceda_Resume.pdf
```

If PDF not ready yet, use current best v2 export temporarily — replace when Career-Dev plan completes.

- [ ] **Step 2: Verify static serving**

```bash
cd /Users/brandon/Developer/personal-site
pnpm dev
```

Open: `http://localhost:3000/Brandon_Sauceda_Resume.pdf` — should download/display PDF.

- [ ] **Step 3: Commit**

```bash
git add public/Brandon_Sauceda_Resume.pdf
git commit -m "feat(portfolio): add downloadable resume PDF"
```

---

### Task 2: Recruiter About data module

**Files:**
- Create: `src/data/portfolio-about.ts`

- [ ] **Step 1: Create data file**

```typescript
/**
 * Hiring-facing copy for /portfolio only.
 * Bump `portfolioAboutLastUpdated` when revised.
 */

export const portfolioAboutLastUpdated = '2026-05-21';

export const portfolioAbout = {
  headline: 'Brandon Sauceda',
  title: 'IT Development Manager · Software Engineer',
  summary:
    'Ten years in Georgia government technology — public-facing web apps, enterprise GIS, and full-stack delivery for 50,000+ monthly users. I also ship indie apps and contribute to open source (Next.js, TypeScript, Rust).',
  email: 'brandon@saucy.tech',
  linkedIn: 'https://linkedin.com/in/saucytech',
  github: 'https://github.com/saucy-tech',
  resumeHref: '/Brandon_Sauceda_Resume.pdf',
  resumeLabel: 'Download résumé (PDF)',
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/portfolio-about.ts
git commit -m "feat(portfolio): add hiring-facing about data"
```

---

### Task 3: Portfolio hiring hero + resume CTA

**Files:**
- Modify: `src/app/portfolio/page.tsx`

- [ ] **Step 1: Import about data**

Add imports:

```typescript
import { portfolioAbout } from '@/data/portfolio-about';
```

- [ ] **Step 2: Add hero section above project groups**

Insert inside `<PageLayout>`, before the projects map:

```tsx
<section className="w-full max-w-xl text-center space-y-4 mb-4">
  <p className="text-sm uppercase tracking-widest text-(--text-secondary)">
    {portfolioAbout.title}
  </p>
  <h2 className="text-2xl font-semibold">{portfolioAbout.headline}</h2>
  <p className="text-base text-(--text-secondary) leading-relaxed">
    {portfolioAbout.summary}
  </p>
  <div className="flex flex-wrap justify-center gap-3 text-sm">
    <a
      href={`mailto:${portfolioAbout.email}`}
      className="inline-block px-4 py-2 bg-(--accent) text-(--on-accent) rounded-sm hover:bg-(--accent-dark) transition"
    >
      {portfolioAbout.email}
    </a>
    <a
      href={portfolioAbout.linkedIn}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
    >
      LinkedIn
    </a>
    <a
      href={portfolioAbout.github}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
    >
      GitHub
    </a>
    <a
      href={portfolioAbout.resumeHref}
      className="inline-block px-4 py-2 border border-(--accent-border) rounded-sm hover:bg-white/10 transition"
    >
      {portfolioAbout.resumeLabel}
    </a>
  </div>
  <p className="text-xs text-(--text-secondary)">
    Portfolio updated {portfolioAboutLastUpdated}
  </p>
</section>
```

Import `portfolioAboutLastUpdated` from the same module.

- [ ] **Step 3: Update portfolio metadata description**

In `export const metadata`, set description to:

```typescript
description:
  'Brandon Sauceda — IT Development Manager and software engineer. Gov-tech, GIS, full-stack apps, open source, awards, and downloadable résumé.',
```

- [ ] **Step 4: Run dev and visually check**

```bash
pnpm dev
# Visit http://localhost:3000/portfolio
```

Expected: hero, email mailto, four CTAs, then existing project cards.

- [ ] **Step 5: Commit**

```bash
git add src/app/portfolio/page.tsx
git commit -m "feat(portfolio): add hiring hero with contact and resume CTA"
```

---

### Task 4: Site-wide footer contact links

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add contact row above copyright**

```tsx
<div className="flex flex-wrap justify-center gap-4 text-sm">
  <a
    href="mailto:brandon@saucy.tech"
    className="text-(--accent) hover:text-white transition"
  >
    brandon@saucy.tech
  </a>
  <a
    href="https://linkedin.com/in/saucytech"
    target="_blank"
    rel="noopener noreferrer"
    className="text-(--accent) hover:text-white transition"
  >
    LinkedIn
  </a>
  <a
    href="/Brandon_Sauceda_Resume.pdf"
    className="text-(--accent) hover:text-white transition"
  >
    Résumé
  </a>
</div>
```

Place between `<SiteNav />` and the copyright `<p>`.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(site): add email, LinkedIn, and resume to footer"
```

---

### Task 5: Homepage portfolio card accuracy

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update meta text (after Task 3 ships)**

Change portfolio LinkCard meta from:

```typescript
meta="Work, projects, awards, and résumé"
```

To:

```typescript
meta="Gov-tech, projects, awards, résumé PDF"
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "copy(home): accurate portfolio card description"
```

---

### Task 6: Professional work project card + OSS proof links

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Bump date**

```typescript
export const projectsLastUpdated = '2026-05-21';
```

- [ ] **Step 2: Add gov-tech card at top of projects array**

```typescript
{
  id: 'gda-public-systems',
  group: 'apps',
  title: 'Georgia DGA — Public Web & GIS Systems',
  status: 'launched',
  tags: ['Product leadership', 'GIS', 'Azure', 'C#', 'Public sector'],
  blurb:
    'IT Development Manager for state agency systems serving 50,000+ monthly users. Owned public-facing web roadmap, cut citizen wait times 40%, led enterprise ArcGIS program (Esri SAG award), and built cross-agency APIs for five partner organizations. Details available on request — no public repo.',
  links: [
    { href: '/Brandon_Sauceda_Resume.pdf', label: 'Résumé (PDF)' },
  ],
},
```

- [ ] **Step 3: Update Warp entry links**

Replace Warp `links` with:

```typescript
links: [
  { href: 'https://github.com/warpdotdev/warp/pull/9451', label: 'PR #9451' },
  { href: 'https://github.com/warpdotdev/warp/issues/9439', label: 'Issue #9439' },
],
```

Update blurb to mention repo-picker UX fix (one sentence).

- [ ] **Step 4: Fix CDC publication link**

In `publications`, set:

```typescript
link: {
  href: 'https://www.cdc.gov/nceh/hsb/disaster/rrt.htm',
  label: 'CDC Rapid Response Teams',
},
```

(Replace with exact publication URL if you have it in Career-Dev vault — search `CDC` in Obsidian/Career-Dev and use the precise link.)

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(portfolio): add gov-tech card and stronger OSS proof links"
```

---

### Task 7: SEO / metadata for hiring discovery

**Files:**
- Modify: `src/utils/constants.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add hiring description constant**

In `constants.ts`:

```typescript
export const SITE_DESCRIPTION_HIRING =
  'Brandon Sauceda — IT Development Manager and software engineer. Gov-tech, GIS, full-stack web apps, and open source.';
```

Keep existing `SITE_DESCRIPTION` for homepage personal brand OR replace default metadata only — recommended: use `SITE_DESCRIPTION_HIRING` in root `layout.tsx` metadata `description` and OpenGraph description; leave homepage Profile bio unchanged.

- [ ] **Step 2: Update layout metadata**

In `src/app/layout.tsx`, set:

```typescript
description: SITE_DESCRIPTION_HIRING,
```

and expand keywords:

```typescript
keywords: [
  'software engineer',
  'IT development manager',
  'government technology',
  'GIS',
  'full-stack developer',
  'Next.js',
  'Brandon Sauceda',
],
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/constants.ts src/app/layout.tsx
git commit -m "seo: hiring-oriented site metadata"
```

---

### Task 8: Playwright smoke tests

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Add portfolio hiring assertions**

```typescript
test('portfolio exposes resume and contact', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('link', { name: /résumé/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'brandon@saucy.tech' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
});

test('resume PDF is served', async ({ request }) => {
  const res = await request.get('/Brandon_Sauceda_Resume.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});
```

- [ ] **Step 2: Run tests**

```bash
pnpm exec playwright test tests/e2e/smoke.spec.ts
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test(e2e): cover portfolio hiring CTAs and resume PDF"
```

---

### Task 9: README maintenance note

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add "Resume PDF" section**

```markdown
## Resume PDF

The downloadable résumé at `/Brandon_Sauceda_Resume.pdf` is copied from Career-Dev:

\`\`\`bash
cp ~/Documents/Career-Dev/01_Current_Packet/Resume/Brandon_Sauceda_Resume_ATS.pdf public/Brandon_Sauceda_Resume.pdf
\`\`\`

Regenerate after editing `v2_Concise_ATS.md` in Career-Dev.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: resume PDF refresh workflow"
```

---

### Task 10 (optional P2): Project screenshots

**Files:**
- Create: `public/portfolio/roll-to-eat.png`, `public/portfolio/portfolio-site.png` (etc.)
- Modify: `src/data/projects.ts` — add optional `image?: string` to `Project`
- Modify: `src/app/portfolio/page.tsx` — render `Image` when present

Defer to a follow-up session unless time allows. Codecademy lists screenshots as nice-to-have, not blocking.

---

## Verification checklist

- [ ] `https://saucy.tech/portfolio` shows About hero, email, LinkedIn, GitHub, résumé PDF link
- [ ] Footer shows email + LinkedIn + Résumé on every page
- [ ] `/Brandon_Sauceda_Resume.pdf` returns 200
- [ ] Homepage portfolio card text matches reality
- [ ] Warp card links to PR/issue, not only warp.dev
- [ ] Gov-tech card visible (no broken links)
- [ ] `pnpm exec playwright test tests/e2e/smoke.spec.ts` passes
- [ ] `pnpm lint` and `pnpm build` pass

---

## Deployment

- [ ] Push branch, open PR on `saucy-tech/personal-site`
- [ ] Verify production after merge: resume PDF + portfolio hero on saucy.tech

---

## Execution handoff

**Plan saved to:** `personal-site/docs/superpowers/plans/2026-05-21-portfolio-hiring-gap-fixes.md`

**Fresh session prompt:**

> Implement `docs/superpowers/plans/2026-05-21-portfolio-hiring-gap-fixes.md` in personal-site. Use executing-plans. Run Career-Dev resume plan first if PDF missing.

**Order:** Resume plan Task 10 → this plan Task 1 (PDF copy), then Tasks 2–9.
