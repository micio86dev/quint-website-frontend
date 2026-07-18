import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  integrations: [sitemap({ i18n: { defaultLocale: 'it', locales: { it: 'it-IT', en: 'en-US' } } })],
  output: 'static',
  vite: { server: { host: true } }
});
