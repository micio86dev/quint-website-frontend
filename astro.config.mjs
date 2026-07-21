import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { resolveSiteOrigin } from './src/config/site-origin.mjs';

const command = process.argv.includes('build') ? 'build' : 'dev';
const site = resolveSiteOrigin(process.env, command);

export default defineConfig({
  site,
  integrations: [sitemap({
    i18n: { defaultLocale: 'it', locales: { it: 'it-IT', en: 'en-US' } },
    filter: (page) => new URL(page, site).pathname !== '/'
  })],
  output: 'static',
  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: 'Open Sans',
      cssVariable: '--font-open-sans',
      weights: [400, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif']
    }],
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https:",
        "form-action 'self' https:",
        "object-src 'none'",
        "base-uri 'self'",
        "require-trusted-types-for 'script'"
      ]
    }
  },
  vite: { plugins: [tailwindcss()], server: { host: true } }
});
