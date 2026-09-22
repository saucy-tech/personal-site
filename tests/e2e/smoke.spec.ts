import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Site sections' }).getByRole('link')
    ).toHaveText(['Portfolio', 'About', 'Notes']);
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /articles & reflections/i })).toBeVisible();
  });

  test('blog to post journey renders article content', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();
    await firstPostLink.click();
    await expect(page.locator('article')).toBeVisible();
  });

  test('post page shows subscribe region with actionable card', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    const subscribeCardButton = page.locator('[aria-label="Subscribe"] button').first();
    await expect(subscribeCardButton).toBeVisible();
    await expect(subscribeCardButton).toContainText(/enjoyed this post/i);
  });

  test('notes keeps existing bookmarks and personal destinations working', async ({ page }) => {
    await page.goto('/field-notes');
    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.getByRole('heading', { name: 'Notes', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Watch Truth Chapel' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Why I save in Bitcoin' })).toBeVisible();
  });

  test('portfolio exposes resume and contact', async ({ page }) => {
    await page.goto('/portfolio');
    const main = page.locator('#main-content');
    await expect(main.getByRole('link', { name: 'Download résumé (PDF)' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'brandon@saucy.tech' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });

  test('resume PDF is served', async ({ request }) => {
    const res = await request.get('/Brandon_Sauceda_Resume.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });
});
