export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Product = { slug: string; family: 'diagnostics' | 'research' | 'quality'; title: string; summary: string; benefit: string };

type Copy = { languageName: string; brandStatement: string; nav: { home: string; products: string; contact: string }; cta: string; secondaryCta: string; hero: { eyebrow: string; title: string; body: string }; trusted: string; families: Record<Product['family'], { title: string; description: string }>; contact: { title: string; intro: string; name: string; email: string; company: string; message: string; send: string; success: string; failure: string }; footer: string };

export const siteCopy: Record<Locale, Copy> = {
  it: {
    languageName: 'English', brandStatement: 'Quint trasforma la complessità scientifica in decisioni affidabili.', nav: { home: 'Home', products: 'Prodotti', contact: 'Contatti' }, cta: 'Parla con Quint', secondaryCta: 'Scopri le soluzioni',
    hero: { eyebrow: 'Soluzioni scientifiche affidabili', title: 'Tecnologie che rendono affidabili le decisioni', body: 'Portiamo diagnostica, ricerca e controllo qualità più vicini alle persone che devono decidere.' }, trusted: 'Dalla prima valutazione al supporto post-vendita.',
    families: { diagnostics: { title: 'Diagnostica', description: 'Strumenti e test per risultati rapidi, tracciabili e utili.' }, research: { title: 'Ricerca', description: 'Tecnologie che accelerano la scoperta senza sacrificare la qualità.' }, quality: { title: 'Qualità', description: 'Controllo dei processi per standard sostenibili e ripetibili.' } },
    contact: { title: 'Parliamo del tuo progetto', intro: 'Raccontaci l’obiettivo: il team Quint ti risponderà con il percorso più adatto.', name: 'Nome e cognome', email: 'Email di lavoro', company: 'Azienda', message: 'Messaggio', send: 'Invia richiesta', success: 'Grazie. La tua richiesta è stata inviata.', failure: 'Non è stato possibile inviare la richiesta. Riprova più tardi.' }, footer: 'Tecnologie scientifiche per decisioni migliori.'
  },
  en: {
    languageName: 'Italiano', brandStatement: 'Quint turns scientific complexity into reliable decisions.', nav: { home: 'Home', products: 'Products', contact: 'Contact' }, cta: 'Talk to Quint', secondaryCta: 'Explore solutions',
    hero: { eyebrow: 'Reliable scientific solutions', title: 'Technology that makes decisions dependable', body: 'We bring diagnostics, research and quality control closer to the people who need to decide.' }, trusted: 'From first evaluation to after-sales support.',
    families: { diagnostics: { title: 'Diagnostics', description: 'Instruments and tests for fast, traceable and useful results.' }, research: { title: 'Research', description: 'Technology that accelerates discovery without sacrificing quality.' }, quality: { title: 'Quality', description: 'Process control for sustainable, repeatable standards.' } },
    contact: { title: 'Let’s discuss your project', intro: 'Tell us your goal and the Quint team will respond with the right path.', name: 'Full name', email: 'Work email', company: 'Company', message: 'Message', send: 'Send request', success: 'Thank you. Your request has been sent.', failure: 'We could not send your request. Please try again later.' }, footer: 'Scientific technology for better decisions.'
  }
};

const products: Record<Locale, Product[]> = {
  it: [
    { slug: 'rapid-diagnostics', family: 'diagnostics', title: 'Diagnostica rapida', summary: 'Test rapidi per decisioni tempestive.', benefit: 'Riduce il tempo tra campione e decisione.' },
    { slug: 'molecular-diagnostics', family: 'diagnostics', title: 'Diagnostica molecolare', summary: 'Workflow affidabili per analisi molecolari.', benefit: 'Aumenta confidenza e ripetibilità.' },
    { slug: 'clinical-analyzers', family: 'diagnostics', title: 'Analizzatori clinici', summary: 'Automazione progettata per il laboratorio moderno.', benefit: 'Supporta continuità operativa e tracciabilità.' },
    { slug: 'cell-analysis', family: 'research', title: 'Analisi cellulare', summary: 'Strumenti per osservare processi biologici complessi.', benefit: 'Rende i dati cellulari più leggibili.' },
    { slug: 'sample-preparation', family: 'research', title: 'Preparazione campioni', summary: 'Preparazione coerente fin dal primo passaggio.', benefit: 'Protegge la qualità dell’intero workflow.' },
    { slug: 'research-imaging', family: 'research', title: 'Imaging per la ricerca', summary: 'Immagini che aiutano a vedere oltre il dato.', benefit: 'Collega osservazione e decisione.' },
    { slug: 'process-monitoring', family: 'quality', title: 'Monitoraggio di processo', summary: 'Misurazioni chiare per processi controllati.', benefit: 'Anticipa le deviazioni critiche.' },
    { slug: 'quality-control', family: 'quality', title: 'Controllo qualità', summary: 'Strumenti per standard solidi e verificabili.', benefit: 'Rende la conformità parte del processo.' }
  ],
  en: [
    { slug: 'rapid-diagnostics', family: 'diagnostics', title: 'Rapid diagnostics', summary: 'Fast tests for timely decisions.', benefit: 'Reduces the time between sample and decision.' },
    { slug: 'molecular-diagnostics', family: 'diagnostics', title: 'Molecular diagnostics', summary: 'Reliable workflows for molecular analysis.', benefit: 'Builds confidence and repeatability.' },
    { slug: 'clinical-analyzers', family: 'diagnostics', title: 'Clinical analyzers', summary: 'Automation designed for the modern laboratory.', benefit: 'Supports operational continuity and traceability.' },
    { slug: 'cell-analysis', family: 'research', title: 'Cell analysis', summary: 'Tools for observing complex biological processes.', benefit: 'Makes cellular data easier to understand.' },
    { slug: 'sample-preparation', family: 'research', title: 'Sample preparation', summary: 'Consistent preparation from the very first step.', benefit: 'Protects quality across the workflow.' },
    { slug: 'research-imaging', family: 'research', title: 'Research imaging', summary: 'Images that help teams see beyond the data.', benefit: 'Connects observation and decision.' },
    { slug: 'process-monitoring', family: 'quality', title: 'Process monitoring', summary: 'Clear measurements for controlled processes.', benefit: 'Anticipates critical deviations.' },
    { slug: 'quality-control', family: 'quality', title: 'Quality control', summary: 'Tools for robust, verifiable standards.', benefit: 'Makes compliance part of the process.' }
  ]
};

export const getLocale = (value?: string): Locale => locales.includes(value as Locale) ? value as Locale : 'it';
export const getProducts = (locale: Locale) => products[locale];
export const getProduct = (locale: Locale, slug: string) => products[locale].find((product) => product.slug === slug);
export const localizedPath = (locale: Locale, path = '') => `/${locale}/${path ? `${path.replace(/^\/+|\/+$/g, '')}/` : ''}`;
