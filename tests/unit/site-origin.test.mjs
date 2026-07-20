import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSiteOrigin } from '../../src/config/site-origin.mjs';

test('uses localhost only for local development when no deployment origin exists', () => {
  assert.equal(resolveSiteOrigin({}, 'dev'), 'http://localhost:4321');
});

test('uses an explicit HTTPS deployment origin for production builds', () => {
  assert.equal(resolveSiteOrigin({ SITE_URL: 'https://example.test/docs/' }, 'build'), 'https://example.test');
});

test('derives the Vercel production origin without hardcoding a domain', () => {
  assert.equal(resolveSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'quint.vercel.app' }, 'build'), 'https://quint.vercel.app');
});

test('rejects missing or insecure production origins', () => {
  assert.throws(() => resolveSiteOrigin({}, 'build'), /SITE_URL/);
  assert.throws(() => resolveSiteOrigin({ SITE_URL: 'http://example.test' }, 'build'), /HTTPS/);
});
