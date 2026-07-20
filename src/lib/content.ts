// Types
export type PBProduct = {
  id: string;
  slug: string;
  family: 'diagnostics' | 'research' | 'quality';
  locale: string;
  title: string;
  summary: string;
  benefit: string;
  description: string;
  image: string;
  sort_order: number;
  collectionId: string;
  collectionName: string;
};

export type FAQ = {
  id: string;
  locale: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type Capability = {
  id: string;
  locale: string;
  number_label: string;
  title: string;
  body: string;
  sort_order: number;
};

export type Statistic = {
  id: string;
  locale: string;
  value: string;
  label: string;
  sort_order: number;
};

export type PlatformSignal = {
  id: string;
  locale: string;
  label: string;
  value: string;
  sort_order: number;
};

// Internal fetch helper
async function pbFetch<T>(path: string): Promise<T> {
  const base = import.meta.env.INTERNAL_API_URL ?? import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8090';
  const url = `${base}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PocketBase fetch failed: ${url} (${res.status})`);
  return res.json() as Promise<T>;
}

// Builds an encoded `filter=` query param. PocketBase uses `&&`/`||` operators,
// which MUST be URL-encoded or they break the query string parsing (the `&`
// is read as a param separator → HTTP 400).
const filterParam = (expr: string): string => `filter=${encodeURIComponent(expr)}`;

// getSiteText: returns a flat key→value map for the given locale
export async function getSiteText(locale: string): Promise<Record<string, string>> {
  // PocketBase list endpoint, filter by locale, get all (perPage=500 should be enough)
  const data = await pbFetch<{ items: { key: string; value: string }[] }>(
    `/api/collections/site_text/records?${filterParam(`(locale='${locale}')`)}&perPage=500&fields=key,value`
  );
  return Object.fromEntries(data.items.map((r) => [r.key, r.value]));
}

// getProducts: returns all products for locale, sorted by sort_order
export async function getProducts(locale: string): Promise<PBProduct[]> {
  const data = await pbFetch<{ items: PBProduct[] }>(
    `/api/collections/products/records?${filterParam(`(locale='${locale}')`)}&sort=sort_order&perPage=100`
  );
  return data.items;
}

// getProduct: returns a single product by locale and slug
export async function getProduct(locale: string, slug: string): Promise<PBProduct | undefined> {
  try {
    const data = await pbFetch<{ items: PBProduct[] }>(
      `/api/collections/products/records?${filterParam(`(locale='${locale}' && slug='${slug}')`)}&perPage=1`
    );
    return data.items[0];
  } catch {
    return undefined;
  }
}

// getFaqs
export async function getFaqs(locale: string): Promise<FAQ[]> {
  const data = await pbFetch<{ items: FAQ[] }>(
    `/api/collections/faqs/records?${filterParam(`(locale='${locale}')`)}&sort=sort_order&perPage=100`
  );
  return data.items;
}

// getCapabilities
export async function getCapabilities(locale: string): Promise<Capability[]> {
  const data = await pbFetch<{ items: Capability[] }>(
    `/api/collections/capabilities/records?${filterParam(`(locale='${locale}')`)}&sort=sort_order&perPage=100`
  );
  return data.items;
}

// getStatistics
export async function getStatistics(locale: string): Promise<Statistic[]> {
  const data = await pbFetch<{ items: Statistic[] }>(
    `/api/collections/statistics/records?${filterParam(`(locale='${locale}')`)}&sort=sort_order&perPage=100`
  );
  return data.items;
}

// getPlatformSignals
export async function getPlatformSignals(locale: string): Promise<PlatformSignal[]> {
  const data = await pbFetch<{ items: PlatformSignal[] }>(
    `/api/collections/platform_signals/records?${filterParam(`(locale='${locale}')`)}&sort=sort_order&perPage=100`
  );
  return data.items;
}

// getImageUrl: build a PocketBase file URL
export function getImageUrl(collectionId: string, recordId: string, filename: string): string {
  const base = import.meta.env.INTERNAL_API_URL ?? import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8090';
  return `${base}/api/files/${collectionId}/${recordId}/${filename}`;
}

// LegalPage type
export interface LegalPage {
  page_key: string;
  locale: string;
  title: string;
  content: string;
  last_updated: string;
}

// getLegalPage: fetch a single legal page by locale and page key
export async function getLegalPage(locale: string, pageKey: string): Promise<LegalPage | null> {
  try {
    const data = await pbFetch<{ items: LegalPage[] }>(
      `/api/collections/legal_pages/records?${filterParam(`(locale='${locale}' && page_key='${pageKey}')`)}&perPage=1`
    );
    return data.items[0] ?? null;
  } catch {
    return null;
  }
}

// getAllLegalPages: fetch all legal pages for a locale
export async function getAllLegalPages(locale: string): Promise<LegalPage[]> {
  const data = await pbFetch<{ items: LegalPage[] }>(
    `/api/collections/legal_pages/records?${filterParam(`(locale='${locale}')`)}&sort=page_key`
  );
  return data.items;
}
