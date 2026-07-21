import { expect, test } from '@playwright/test';

// These tests are intentionally content-agnostic: the form copy and messages
// come from the CMS, so expected strings are read from the form's data-*
// attributes at runtime and elements are selected structurally (name / role /
// testid). This keeps them stable across copy changes.

test('home navigation reaches products and contact', async ({ page }) => {
  await page.goto('/it/');
  const banner = page.getByRole('banner');
  // Header spans the full viewport width (accessibility / layout regression guard).
  await expect(banner).toHaveCSS('width', `${page.viewportSize()?.width}px`);
  await expect(banner).toHaveCSS('margin-left', '0px');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

  await page.locator('a[href="/it/products/"]').first().click();
  await expect(page).toHaveURL(/\/it\/products\/$/);

  await page.locator('header a[href="/it/contact/"]').first().click();
  await expect(page).toHaveURL(/\/it\/contact\/$/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('contact form surfaces accessible, red validation errors', async ({ page }) => {
  await page.goto('/en/contact/');
  const form = page.getByTestId('contact-form');
  const firstName = form.locator('input[name="first_name"]');

  const expectedFirstNameError = await form.getAttribute('data-error-first-name');

  await form.locator('button[type="submit"]').click();

  // Every required field reports an error, tied to its input via ARIA.
  for (const field of ['first_name', 'last_name', 'email', 'message']) {
    await expect(page.locator(`#error-${field}`)).toBeVisible();
    await expect(form.locator(`[name="${field}"]`)).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator(`[name="${field}"]`)).toHaveAttribute('aria-describedby', `error-${field}`);
  }

  // Message text comes from the CMS; assert against the form's own data.
  await expect(page.locator('#error-first_name')).toHaveText(expectedFirstNameError ?? '');
  // The first invalid field takes focus.
  await expect(firstName).toBeFocused();
  // Errors are shown in red (regression guard for the danger token + :global fix).
  await expect(page.locator('#error-first_name')).toHaveCSS('color', 'rgb(198, 40, 40)');
});

test('contact form submits the validated, localized payload', async ({ page }) => {
  let submittedPayload: Record<string, string> | undefined;
  await page.route('**/api/quint/contact', async (route) => {
    submittedPayload = JSON.parse(route.request().postData() ?? '{}') as Record<string, string>;
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
  });

  await page.goto('/it/contact/');
  const form = page.getByTestId('contact-form');
  const expectedSuccess = await form.getAttribute('data-success');

  await form.locator('input[name="first_name"]').fill('Ada');
  await form.locator('input[name="last_name"]').fill('Lovelace');
  await form.locator('input[name="email"]').fill('ada@example.com');
  await form.locator('input[name="company"]').fill('Quint Lab');
  await form.locator('textarea[name="message"]').fill('Vorrei una consulenza sui vostri prodotti.');
  await form.locator('button[type="submit"]').click();

  await expect(page.getByRole('status')).toHaveText(expectedSuccess ?? '');
  expect(submittedPayload).toMatchObject({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Quint Lab',
    message: 'Vorrei una consulenza sui vostri prodotti.',
    website: '',
    locale: 'it',
  });
});

test('contact form reports a failed request', async ({ page }) => {
  await page.route('**/api/quint/contact', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
  });

  await page.goto('/en/contact/');
  const form = page.getByTestId('contact-form');
  const expectedFailure = await form.getAttribute('data-failure');

  await form.locator('input[name="first_name"]').fill('Ada');
  await form.locator('input[name="last_name"]').fill('Lovelace');
  await form.locator('input[name="email"]').fill('ada@example.com');
  await form.locator('textarea[name="message"]').fill('I would like a product consultation.');
  await form.locator('button[type="submit"]').click();

  const status = page.getByRole('status');
  await expect(status).toHaveText(expectedFailure ?? '');
  await expect(status).toHaveClass(/form-status--error/);
});
