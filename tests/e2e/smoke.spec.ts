import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('link', { name: /^writing$/i }).first()).toBeVisible();
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

  test('home subscribe form is visible and actionable', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.getByPlaceholder('Your email');
    const subscribeButton = page.getByRole('button', { name: /^subscribe$/i });
    await expect(emailInput).toBeVisible();
    await expect(subscribeButton).toBeVisible();
    await expect(page.getByText(/no spam, unsubscribe anytime/i)).toBeVisible();
  });
});
