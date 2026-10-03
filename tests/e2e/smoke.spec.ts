import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Site sections' }).getByRole('link')
    ).toHaveText(['Portfolio', 'About', 'Notes']);
  });

  test('skip link moves keyboard focus into the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  for (const width of [1280, 390]) {
    test(`newsletter dialog contains focus and returns it on close at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/blog/2026-03-04-for-god-so-loved');
      const trigger = page.locator('[aria-label="Subscribe"] button').first();
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Subscribe — Saucy.tech Updates' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByLabel('Email address')).toBeFocused();
      await dialog.getByRole('link', { name: 'privacy notice' }).focus();
      await page.keyboard.press('Tab');
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.getByRole('link', { name: 'privacy notice' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Enter');
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Enter');
      await dialog.click({ position: { x: 4, y: 4 } });
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  }

  test('mobile notes keeps every keyboard-focused section chip fully visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/notes');
    const links = page.getByRole('navigation', { name: 'Sections', exact: true }).getByRole('link');
    await links.first().focus();
    for (let index = 0; index < (await links.count()); index++) {
      const link = links.nth(index);
      await expect(link).toBeFocused();
      await expect
        .poll(() =>
          link.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            const list = element.closest('ul')!.getBoundingClientRect();
            return rect.left >= list.left - 1 && rect.right <= list.right + 1;
          })
        )
        .toBe(true);
      await page.keyboard.press('Tab');
    }
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
    await expect(main.getByRole('link', { name: 'View résumé' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'brandon@saucy.tech' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });

  test('resume PDF is served', async ({ request }) => {
    const res = await request.get('/Brandon_Sauceda_Resume.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });

  test('subscribe form rejects an invalid email before any request leaves the page', async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      if (/\/api\/subscribe|kit\.com|convertkit/.test(req.url())) requests.push(req.url());
    });

    await page.goto('/blog');
    const email = page.getByLabel('Email address');
    await email.fill('not-an-email');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    // The email input is `type="email" required`, so the browser's constraint
    // validation blocks submit and surfaces the inline message itself.
    await expect(page.locator('#subscribe-email:invalid')).toBeVisible();
    expect(await email.evaluate((el: HTMLInputElement) => el.validationMessage)).not.toBe('');
    expect(requests).toEqual([]);
  });

  test('tip jar shows the Lightning error when the invoice service is unconfigured', async ({
    page,
  }) => {
    await page.goto('/support');
    await page.getByRole('button', { name: 'Custom' }).click();
    await page.getByPlaceholder('Enter sats').fill('500');

    const invoiceResponse = page.waitForResponse(
      (res) => res.url().includes('/api/invoice') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Tip me' }).click();

    const res = await invoiceResponse;
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: 'Service temporarily unavailable' });

    await expect(
      page.getByText(/couldn't connect to the Lightning Network at this time/)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tip me' })).toBeEnabled();
  });
});
