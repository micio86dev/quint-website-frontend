import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const homepageContracts = [
  {
    locale: 'it',
    navigation: { home: 'Home', products: 'Prodotti', contact: 'Contatti' },
    title: 'Dati scientifici più chiari. Decisioni più sicure.',
    platformTitle: 'Intelligenza dei flussi di lavoro',
    primaryAction: 'Parla con Quint',
    secondaryAction: 'Scopri le soluzioni'
  },
  {
    locale: 'en',
    navigation: { home: 'Home', products: 'Products', contact: 'Contact' },
    title: 'Clearer scientific data. Safer decisions.',
    platformTitle: 'Workflow intelligence',
    primaryAction: 'Talk to Quint',
    secondaryAction: 'Explore solutions'
  }
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const contract of homepageContracts) {
  test(`production ${contract.locale} homepage preserves its visible localized contract`, async () => {
    const html = await readFile(new URL(`../../dist/${contract.locale}/index.html`, import.meta.url), 'utf8');

    assert.match(html, new RegExp(`<html lang="${contract.locale}">`));
    assert.match(html, /<main id="content">/);
    assert.match(html, /class="home-hero"/);
    assert.match(html, new RegExp(`<h1 id="home-hero-title">${escapeRegExp(contract.title)}</h1>`));
    assert.match(html, new RegExp(`<h2 id="platform-preview-title">${escapeRegExp(contract.platformTitle)}</h2>`));
    assert.match(html, new RegExp(`>${escapeRegExp(contract.primaryAction)}<span`));
    assert.match(html, new RegExp(`>${escapeRegExp(contract.secondaryAction)}<span`));
    assert.match(html, new RegExp(`<a href="/${contract.locale}/">${escapeRegExp(contract.navigation.home)}</a>`));
    assert.match(html, new RegExp(`<a href="/${contract.locale}/products/">${escapeRegExp(contract.navigation.products)}</a>`));
    assert.match(html, new RegExp(`<a href="/${contract.locale}/contact/">${escapeRegExp(contract.navigation.contact)}</a>`));

    assert.doesNotMatch(html, /astro-dev-toolbar/);
  });
}
