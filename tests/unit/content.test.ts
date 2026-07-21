import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLocale, localizedPath } from '../../src/content/site';
import {
  getAllLegalPages,
  getCapabilities,
  getFaqs,
  getImageUrl,
  getLegalPage,
  getPlatformSignals,
  getProduct,
  getProducts,
  getSiteText,
  getStatistics,
} from '../../src/lib/content';

// Minimal PocketBase list-endpoint response.
const ok = <T,>(items: T[]) => ({ ok: true, status: 200, json: async () => ({ items }) });
const fail = (status = 500) => ({ ok: false, status, json: async () => ({}) });

describe('site content — pure helpers (src/content/site.ts)', () => {
  it('keeps supported locales and defaults the rest to Italian', () => {
    expect(getLocale('en')).toBe('en');
    expect(getLocale('it')).toBe('it');
    expect(getLocale('fr')).toBe('it');
    expect(getLocale()).toBe('it');
  });

  it('builds stable, trailing-slashed localized paths', () => {
    expect(localizedPath('it')).toBe('/it/');
    expect(localizedPath('en', 'products')).toBe('/en/products/');
    expect(localizedPath('it', '/legal/privacy/')).toBe('/it/legal/privacy/');
  });
});

describe('content client — PocketBase reads (src/lib/content.ts)', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('getSiteText maps records into a flat key→value dictionary', async () => {
    fetchMock.mockResolvedValue(ok([{ key: 'nav.home', value: 'Home' }, { key: 'footer', value: 'Quint' }]));
    await expect(getSiteText('it')).resolves.toEqual({ 'nav.home': 'Home', footer: 'Quint' });
  });

  it('URL-encodes the locale filter so PocketBase && / = operators survive', async () => {
    fetchMock.mockResolvedValue(ok([]));
    await getSiteText('en');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/api/collections/site_text/records');
    expect(url).toContain(`filter=${encodeURIComponent("(locale='en')")}`);
  });

  it('getProducts returns the locale catalogue sorted by sort_order', async () => {
    fetchMock.mockResolvedValue(ok([{ slug: 'rapid-diagnostics' }]));
    await expect(getProducts('it')).resolves.toEqual([{ slug: 'rapid-diagnostics' }]);
    expect(fetchMock.mock.calls[0][0]).toContain('sort=sort_order');
  });

  it('getProduct returns the first match and encodes both locale and slug', async () => {
    fetchMock.mockResolvedValue(ok([{ slug: 'rapid-diagnostics', title: 'Rapid diagnostics' }]));
    await expect(getProduct('en', 'rapid-diagnostics')).resolves.toMatchObject({ title: 'Rapid diagnostics' });
    expect(fetchMock.mock.calls[0][0]).toContain(encodeURIComponent("(locale='en' && slug='rapid-diagnostics')"));
  });

  it('getProduct swallows backend failures and resolves to undefined', async () => {
    fetchMock.mockResolvedValue(fail());
    await expect(getProduct('it', 'missing')).resolves.toBeUndefined();
  });

  it('list getters (faqs, capabilities, statistics, platform signals) return their items', async () => {
    const getters = { getFaqs, getCapabilities, getStatistics, getPlatformSignals };
    for (const [name, getter] of Object.entries(getters)) {
      fetchMock.mockResolvedValueOnce(ok([{ id: name }]));
      await expect(getter('it')).resolves.toEqual([{ id: name }]);
    }
  });

  it('getLegalPage returns a match, null when absent, and null on failure', async () => {
    fetchMock.mockResolvedValueOnce(ok([{ page_key: 'privacy' }]));
    await expect(getLegalPage('it', 'privacy')).resolves.toEqual({ page_key: 'privacy' });

    fetchMock.mockResolvedValueOnce(ok([]));
    await expect(getLegalPage('it', 'unknown')).resolves.toBeNull();

    fetchMock.mockResolvedValueOnce(fail(404));
    await expect(getLegalPage('it', 'boom')).resolves.toBeNull();
  });

  it('getAllLegalPages returns the locale set sorted by page_key', async () => {
    fetchMock.mockResolvedValue(ok([{ page_key: 'cookie' }, { page_key: 'privacy' }]));
    await expect(getAllLegalPages('en')).resolves.toHaveLength(2);
    expect(fetchMock.mock.calls[0][0]).toContain('sort=page_key');
  });

  it('surfaces a descriptive error when PocketBase responds non-OK', async () => {
    fetchMock.mockResolvedValue(fail(503));
    await expect(getSiteText('it')).rejects.toThrow(/PocketBase fetch failed.*503/);
  });

  it('resolves the API base: INTERNAL_API_URL → PUBLIC_API_URL → localhost', async () => {
    fetchMock.mockResolvedValue(ok([]));

    // Default (neither var set in the test env) falls back to localhost.
    await getSiteText('it');
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('http://localhost:8090');

    // PUBLIC_API_URL wins when INTERNAL is absent.
    vi.stubEnv('PUBLIC_API_URL', 'https://public.example');
    await getSiteText('it');
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('https://public.example');

    // INTERNAL_API_URL takes precedence over PUBLIC.
    vi.stubEnv('INTERNAL_API_URL', 'http://internal.local:9000');
    await getSiteText('it');
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain('http://internal.local:9000');
  });

  it('getImageUrl builds a PocketBase file URL from the configured base', () => {
    expect(getImageUrl('col1', 'rec1', 'logo.png')).toBe('http://localhost:8090/api/files/col1/rec1/logo.png');
    vi.stubEnv('INTERNAL_API_URL', 'http://internal.local:9000');
    expect(getImageUrl('col1', 'rec1', 'logo.png')).toBe('http://internal.local:9000/api/files/col1/rec1/logo.png');
  });
});
