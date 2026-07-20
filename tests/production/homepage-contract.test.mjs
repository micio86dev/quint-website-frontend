import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { before, test } from 'node:test';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const distRoot = new URL('../../dist/', import.meta.url);
const configuredOrigin = 'https://example.test';

const runAstro = (command) => {
  const result = spawnSync(process.execPath, ['node_modules/astro/astro.js', command], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, SITE_URL: configuredOrigin }
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
};

before(() => {
  runAstro('check');
  runAstro('build');
});

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
    const html = await readFile(new URL(`${contract.locale}/index.html`, distRoot), 'utf8');

    assert.match(html, new RegExp(`<html lang="${contract.locale}">`));
    assert.match(html, /<title>Quint<\/title>/);
    assert.doesNotMatch(html, /<title>Quint \| Quint<\/title>/);
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

test('production metadata uses the configured HTTPS origin for canonical, alternate, Open Graph and JSON-LD URLs', async () => {
  const html = await readFile(new URL('it/products/diagnostics/rapid-diagnostics/index.html', distRoot), 'utf8');

  assert.match(html, new RegExp(`<link rel="canonical" href="${configuredOrigin}/it/products/diagnostics/rapid-diagnostics/">`));
  assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${configuredOrigin}/en/products/diagnostics/rapid-diagnostics/">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${configuredOrigin}/it/products/diagnostics/rapid-diagnostics/">`));
  assert.match(html, new RegExp(`"url":"${configuredOrigin}/"`));
  assert.doesNotMatch(html, /localhost:4321/);
});

test('production output publishes crawlable, consistent sitemap and robots signals', async () => {
  const robots = await readFile(new URL('robots.txt', distRoot), 'utf8');
  const sitemapFiles = (await readdir(distRoot))
    .filter((file) => /^sitemap(?:-index|-\d+)?\.xml$/.test(file));
  const sitemapXml = await Promise.all(sitemapFiles.map((file) => readFile(new URL(file, distRoot), 'utf8')));
  const allSitemaps = sitemapXml.join('\n');

  assert.match(robots, new RegExp(`Sitemap: ${configuredOrigin}/sitemap-index\\.xml`));
  assert.match(allSitemaps, new RegExp(`<loc>${configuredOrigin}/it/</loc>`));
  assert.doesNotMatch(allSitemaps, new RegExp(`<loc>${configuredOrigin}/</loc>`));
});

test('localized product calls to action have distinct accessible names, and contextual category labels and CTA focus rings meet WCAG contrast', async () => {
  const italianProducts = await readFile(new URL('it/products/index.html', distRoot), 'utf8');
  const englishProducts = await readFile(new URL('en/products/index.html', distRoot), 'utf8');
  const styles = await readFile(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

  assert.match(italianProducts, /href="\/it\/products\/diagnostics\/rapid-diagnostics\/" aria-label="Scopri di più: Diagnostica rapida"/);
  assert.match(englishProducts, /href="\/en\/products\/diagnostics\/rapid-diagnostics\/" aria-label="Learn more: Rapid diagnostics"/);
  assert.match(italianProducts, /aria-label="Pagina iniziale Quint"/);
  assert.match(englishProducts, /aria-label="Quint home page"/);

  const orangeText = styles.match(/--orange-text:\s*(#[\da-f]{6})/i)?.[1];
  const paper = styles.match(/--paper:\s*(#[\da-f]{6})/i)?.[1];
  const violet = styles.match(/--violet:\s*(#[\da-f]{6})/i)?.[1];
  const focusOnViolet = styles.match(/--focus-on-violet:\s*(#[\da-f]{6})/i)?.[1];

  assert.ok(orangeText, 'Expected the dedicated product-category text token.');
  assert.ok(paper, 'Expected the paper surface token.');
  assert.ok(violet, 'Expected the violet surface token.');
  assert.ok(focusOnViolet, 'Expected the focus token for violet surfaces.');
  assert.match(styles, /\.product-card \.eyebrow\s*\{[^}]*color:\s*var\(--orange-text\)/s);
  assert.match(styles, /\.family-section \.section-heading \.eyebrow\s*\{[^}]*color:\s*var\(--orange-text\)/s);
  assert.ok(contrastRatio(orangeText, paper) >= 4.5, `${orangeText} must meet WCAG AA contrast on paper.`);
  assert.match(styles, /\.cta-block \.button:focus-visible\s*\{[^}]*outline-color:\s*var\(--focus-on-violet\)/s);
  assert.ok(contrastRatio(focusOnViolet, violet) >= 3, `${focusOnViolet} must meet WCAG focus-indicator contrast on violet.`);
});

test('llms guides provide accurate, linked coverage for localized key and product-detail pages', async () => {
  const [guide, fullGuide] = await Promise.all([
    readFile(new URL('llms.txt', distRoot), 'utf8'),
    readFile(new URL('llms-full.txt', distRoot), 'utf8')
  ]);

  for (const pathname of [
    '/it/',
    '/en/',
    '/it/products/',
    '/en/products/',
    '/it/products/diagnostics/',
    '/en/products/diagnostics/',
    '/it/products/research/',
    '/en/products/research/',
    '/it/products/quality/',
    '/en/products/quality/',
    '/it/contact/',
    '/en/contact/',
    '/it/products/diagnostics/rapid-diagnostics/',
    '/en/products/diagnostics/rapid-diagnostics/',
    '/it/products/diagnostics/molecular-diagnostics/',
    '/en/products/diagnostics/molecular-diagnostics/',
    '/it/products/diagnostics/clinical-analyzers/',
    '/en/products/diagnostics/clinical-analyzers/',
    '/it/products/research/cell-analysis/',
    '/en/products/research/cell-analysis/',
    '/it/products/research/sample-preparation/',
    '/en/products/research/sample-preparation/',
    '/it/products/research/research-imaging/',
    '/en/products/research/research-imaging/',
    '/it/products/quality/process-monitoring/',
    '/en/products/quality/process-monitoring/',
    '/it/products/quality/quality-control/',
    '/en/products/quality/quality-control/'
  ]) {
    assert.match(guide, new RegExp(`\\]\\(${escapeRegExp(pathname)}\\)`));
    assert.match(fullGuide, new RegExp(`\\]\\(${escapeRegExp(pathname)}\\)`));
  }
});

const contrastRatio = (first, second) => {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};
