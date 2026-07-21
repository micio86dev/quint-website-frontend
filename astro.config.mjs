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
  // Inline CSS into each page so the design-system stylesheet is no longer a
  // render-blocking request on the critical path (improves FCP/LCP). Astro's
  // CSP hashes the inlined <style> blocks, so this stays CSP-compliant.
  build: { inlineStylesheets: 'always' },
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
      // strict-dynamic: injected scripts can't run even from 'self' — only our
      // hashed scripts (and what they load) are trusted. Safe here because every
      // script is inline and Astro-hashed; there are no external <script src>.
      scriptDirective: { strictDynamic: true },
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
