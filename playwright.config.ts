import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4322', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  webServer: {
    command: 'node ./node_modules/astro/astro.js check && node ./node_modules/astro/astro.js build && node ./node_modules/astro/astro.js preview --host 127.0.0.1 --port 4322',
    env: {
      ...process.env,
      SITE_URL: process.env.SITE_URL ?? 'https://example.test',
      // Build content from the real backend, but force a same-origin (relative)
      // contact endpoint so the mocked route isn't blocked by the connect-src CSP.
      INTERNAL_API_URL: process.env.INTERNAL_API_URL ?? process.env.PUBLIC_API_URL ?? 'http://localhost:8090',
      PUBLIC_API_URL: '',
    },
    url: 'http://127.0.0.1:4322/it/',
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
