import { expect, test } from '@playwright/test';

test('Italian home visual baseline', async ({ page }) => {
  await page.goto('/it/');
  await expect(page).toHaveScreenshot('home-it.png', { fullPage: true, animations: 'disabled' });
});
