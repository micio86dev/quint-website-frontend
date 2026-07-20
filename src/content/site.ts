export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export type ProductFamily = 'diagnostics' | 'research' | 'quality';
export type Product = {
  slug: string;
  family: ProductFamily;
  title: string;
  summary: string;
  benefit: string;
};

export type HomeCopy = {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    platformLabel: string;
    platformTitle: string;
    platformDescription: string;
    platformStatus: string;
    platformSignals: readonly { label: string; value: string }[];
    assurance: string;
  };
  product: { eyebrow: string; title: string; body: string; allProducts: string };
  capabilities: { eyebrow: string; title: string; body: string; items: readonly { number: string; title: string; body: string }[] };
  statistics: readonly { value: string; label: string }[];
  faqHeading: { eyebrow: string; title: string };
  faq: readonly { question: string; answer: string }[];
  finalCta: { eyebrow: string; title: string; body: string; action: string };
};

export const getLocale = (value?: string): Locale =>
  locales.includes(value as Locale) ? (value as Locale) : 'it';

export const localizedPath = (locale: Locale, path = '') =>
  `/${locale}/${path ? `${path.replace(/^\/+|\/+$/g, '')}/` : ''}`;
