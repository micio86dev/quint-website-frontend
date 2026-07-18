import { describe, expect, it } from 'vitest';
import { getLocale, getProduct, getProducts, localizedPath, siteCopy } from '../../src/content/site';

describe('site content', () => {
  it('keeps supported locales unchanged', () => expect(getLocale('en')).toBe('en'));
  it('defaults unsupported locales to Italian', () => expect(getLocale('fr')).toBe('it'));
  it('provides a complete localized product catalogue', () => {
    expect(getProducts('it')).toHaveLength(8);
    expect(getProducts('en').every((product) => product.title.length > 0 && product.summary.length > 0)).toBe(true);
  });
  it('returns a product only for its own locale', () => {
    expect(getProduct('en', 'rapid-diagnostics')?.title).toBe('Rapid diagnostics');
    expect(getProduct('it', 'unknown')).toBeUndefined();
  });
  it('builds stable localized paths', () => {
    expect(localizedPath('it', '')).toBe('/it/');
    expect(localizedPath('en', 'products')).toBe('/en/products/');
  });
  it('keeps core calls to action localized', () => {
    expect(siteCopy.it.cta).not.toBe(siteCopy.en.cta);
  });

  it('defines a complete localized enterprise homepage model', () => {
    expect(siteCopy.it.home.capabilities.items).toHaveLength(3);
    expect(siteCopy.en.home.statistics).toHaveLength(3);
    expect(siteCopy.it.home.faq.every(({ question, answer }) => question.length > 0 && answer.length > 0)).toBe(true);
  });

  it('keeps the Italian platform surface fully localized', () => {
    expect(siteCopy.it.home.hero.eyebrow).toBe('Piattaforma scientifica Quint');
    expect(siteCopy.it.home.hero.platformTitle).toBe('Intelligenza dei flussi di lavoro');
    expect(siteCopy.it.home.finalCta.title).toBe('Costruiamo un flusso di lavoro più sicuro.');
  });
});
