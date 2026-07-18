import { expect, test } from '@playwright/test';

test('Italian home visual baseline', async ({ page }) => {
  await page.goto('/it/');
  await expect(page.locator('astro-dev-toolbar')).toHaveCount(0);
  await expect(page).toHaveScreenshot('home-it.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 30 });
});

test('English home visual baseline', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('astro-dev-toolbar')).toHaveCount(0);
  await expect(page).toHaveScreenshot('home-en.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 30 });
});
