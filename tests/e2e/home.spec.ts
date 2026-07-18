import { expect, test } from '@playwright/test';

test('Italian home guides a visitor to products and contact', async ({ page }) => {
  await page.goto('/it/');
  await expect(page.getByRole('heading', { name: 'Dati scientifici più chiari. Decisioni più sicure.' })).toBeVisible();
  await expect(page.getByText('Piattaforma scientifica Quint', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Intelligenza dei flussi di lavoro' })).toBeVisible();
  await page.getByRole('link', { name: 'Scopri le soluzioni' }).first().click();
  await expect(page).toHaveURL(/\/it\/products\/$/);
  await page.getByRole('navigation', { name: 'Navigazione principale' }).getByRole('link', { name: 'Contatti' }).click();
  await expect(page.getByRole('heading', { name: 'Parliamo del tuo progetto' })).toBeVisible();
});

test('contact form validates through accessible labels', async ({ page }) => {
  await page.goto('/en/contact/');
  const form = page.getByTestId('contact-form');
  await form.getByRole('button', { name: 'Send request' }).click();
  const nameError = page.getByText('Please enter your name.', { exact: true });
  await expect(nameError).toBeVisible();
  await expect(nameError).toHaveAttribute('id', 'error-name');
  await expect(form.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel('Full name')).toHaveAttribute('aria-describedby', 'error-name');
  await expect(form.getByLabel('Full name')).toBeFocused();
  await page.getByLabel('Full name').fill('Ada Lovelace');
  await page.getByLabel('Work email').fill('ada@example.com');
  await page.getByLabel('Message').fill('I would like a product consultation.');
  await expect(page.getByTestId('contact-form')).toBeVisible();
});

test('Italian contact form submits the validated localized payload', async ({ page }) => {
  let submittedPayload: Record<string, string> | undefined;
  await page.route('**/api/quint/contact', async (route) => {
    submittedPayload = JSON.parse(route.request().postData() ?? '{}') as Record<string, string>;
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/it/contact/');
  const form = page.getByTestId('contact-form');
  await form.getByLabel('Nome e cognome').fill('Ada Lovelace');
  await form.getByLabel('Email di lavoro').fill('ada@example.com');
  await form.getByLabel('Azienda').fill('Quint Lab');
  await form.getByLabel('Messaggio').fill('Vorrei una consulenza sui vostri prodotti.');
  await form.getByRole('button', { name: 'Invia richiesta' }).click();
  await expect(page.getByRole('status')).toHaveText('Grazie. La tua richiesta è stata inviata.');
  expect(submittedPayload).toMatchObject({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Quint Lab',
    message: 'Vorrei una consulenza sui vostri prodotti.',
    website: '',
    locale: 'it'
  });
});

test('contact form reports a failed request', async ({ page }) => {
  await page.route('**/api/quint/contact', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/en/contact/');
  const form = page.getByTestId('contact-form');
  await form.getByLabel('Full name').fill('Ada Lovelace');
  await form.getByLabel('Work email').fill('ada@example.com');
  await form.getByLabel('Message').fill('I would like a product consultation.');
  await form.getByRole('button', { name: 'Send request' }).click();
  await expect(page.getByRole('status')).toHaveText('We could not send your request. Please try again later.');
});
