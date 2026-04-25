import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('blog index loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /articles & reflections/i })).toBeVisible();
  });

  test('first blog post renders article', async ({ page }) => {
    await page.goto('/blog');
    const firstRead = page.getByRole('link', { name: /read article/i }).first();
    await firstRead.click();
    await expect(page.locator('article')).toBeVisible();
  });
});
