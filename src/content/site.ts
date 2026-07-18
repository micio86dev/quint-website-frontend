export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Product = { slug: string; family: 'diagnostics' | 'research' | 'quality'; title: string; summary: string; benefit: string };

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

type Copy = {
  languageName: string;
  brandStatement: string;
  nav: { home: string; products: string; contact: string };
  cta: string;
  secondaryCta: string;
  learnMore: string;
  hero: { eyebrow: string; title: string; body: string };
  trusted: string;
  home: HomeCopy;
  families: Record<Product['family'], { title: string; description: string }>;
  contact: { title: string; intro: string; name: string; email: string; company: string; message: string; send: string; success: string; failure: string };
  footer: string;
};

export const siteCopy: Record<Locale, Copy> = {
  it: {
    languageName: 'English', brandStatement: 'Quint trasforma la complessità scientifica in decisioni affidabili.', nav: { home: 'Home', products: 'Prodotti', contact: 'Contatti' }, cta: 'Parla con Quint', secondaryCta: 'Scopri le soluzioni', learnMore: 'Scopri di più',
    hero: { eyebrow: 'Soluzioni scientifiche affidabili', title: 'Tecnologie che rendono affidabili le decisioni', body: 'Portiamo diagnostica, ricerca e controllo qualità più vicini alle persone che devono decidere.' }, trusted: 'Dalla prima valutazione al supporto post-vendita.',
    home: {
      hero: {
        eyebrow: 'Piattaforma scientifica Quint',
        title: 'Dati scientifici più chiari. Decisioni più sicure.',
        body: 'Un ecosistema di tecnologie per rendere diagnostica, ricerca e qualità più connesse, tracciabili e pronte all’azione.',
        platformLabel: 'Piattaforma Quint',
        platformTitle: 'Intelligenza dei flussi di lavoro',
        platformDescription: 'Una vista operativa pensata per i team scientifici.',
        platformStatus: 'Operatività sotto controllo',
        platformSignals: [{ label: 'Campioni', value: '128' }, { label: 'Flussi', value: '24' }, { label: 'Qualità', value: '99,8%' }],
        assurance: 'Progettata per team che non possono lasciare spazio all’incertezza.'
      },
      product: { eyebrow: 'Soluzioni Quint', title: 'Una piattaforma che accompagna ogni passaggio critico.', body: 'Scopri tecnologie progettate per la continuità operativa e la qualità del dato.', allProducts: 'Esplora tutte le soluzioni' },
      capabilities: {
        eyebrow: 'Dall’evidenza all’azione',
        title: 'La complessità resta nel sistema. Il controllo torna al team.',
        body: 'Quint unisce strumenti e flussi di lavoro per rendere ogni decisione più leggibile, verificabile e tempestiva.',
        items: [
          { number: '01', title: 'Flussi di lavoro connessi', body: 'Collega le fasi operative senza interrompere il contesto.' },
          { number: '02', title: 'Segnali prioritari', body: 'Porta le informazioni rilevanti davanti alle persone giuste.' },
          { number: '03', title: 'Qualità verificabile', body: 'Trasforma standard e tracciabilità in una pratica quotidiana.' }
        ]
      },
      statistics: [{ value: '3', label: 'aree scientifiche connesse' }, { value: '8', label: 'soluzioni nel catalogo Quint' }, { value: '1', label: 'visione operativa condivisa' }],
      faqHeading: { eyebrow: 'Quint, in breve', title: 'Le domande più frequenti' },
      faq: [
        { question: 'Per quali team è pensata Quint?', answer: 'Per laboratori e organizzazioni che lavorano tra diagnostica, ricerca e qualità e vogliono un processo più chiaro e affidabile.' },
        { question: 'Quint può adattarsi al nostro flusso di lavoro?', answer: 'Ogni soluzione parte dal contesto operativo del team, per rendere l’adozione concreta senza aggiungere complessità inutile.' },
        { question: 'Come iniziamo a valutare una soluzione?', answer: 'Condividi il tuo obiettivo con il team Quint: identificheremo insieme il percorso e le tecnologie più adatte.' }
      ],
      finalCta: { eyebrow: 'Il prossimo segnale conta', title: 'Costruiamo un flusso di lavoro più sicuro.', body: 'Parliamo del tuo contesto scientifico e delle decisioni che vuoi rendere più solide.', action: 'Parla con Quint' }
    },
    families: { diagnostics: { title: 'Diagnostica', description: 'Strumenti e test per risultati rapidi, tracciabili e utili.' }, research: { title: 'Ricerca', description: 'Tecnologie che accelerano la scoperta senza sacrificare la qualità.' }, quality: { title: 'Qualità', description: 'Controllo dei processi per standard sostenibili e ripetibili.' } },
    contact: { title: 'Parliamo del tuo progetto', intro: 'Raccontaci l’obiettivo: il team Quint ti risponderà con il percorso più adatto.', name: 'Nome e cognome', email: 'Email di lavoro', company: 'Azienda', message: 'Messaggio', send: 'Invia richiesta', success: 'Grazie. La tua richiesta è stata inviata.', failure: 'Non è stato possibile inviare la richiesta. Riprova più tardi.' }, footer: 'Tecnologie scientifiche per decisioni migliori.'
  },
  en: {
    languageName: 'Italiano', brandStatement: 'Quint turns scientific complexity into reliable decisions.', nav: { home: 'Home', products: 'Products', contact: 'Contact' }, cta: 'Talk to Quint', secondaryCta: 'Explore solutions', learnMore: 'Learn more',
    hero: { eyebrow: 'Reliable scientific solutions', title: 'Technology that makes decisions dependable', body: 'We bring diagnostics, research and quality control closer to the people who need to decide.' }, trusted: 'From first evaluation to after-sales support.',
    home: {
      hero: {
        eyebrow: 'Quint scientific platform',
        title: 'Clearer scientific data. Safer decisions.',
        body: 'An ecosystem of technologies that makes diagnostics, research and quality more connected, traceable and ready for action.',
        platformLabel: 'Quint platform',
        platformTitle: 'Workflow intelligence',
        platformDescription: 'An operational view built for scientific teams.',
        platformStatus: 'Operations in control',
        platformSignals: [{ label: 'Samples', value: '128' }, { label: 'Workflows', value: '24' }, { label: 'Quality', value: '99.8%' }],
        assurance: 'Designed for teams that cannot leave room for uncertainty.'
      },
      product: { eyebrow: 'Quint solutions', title: 'One platform for every critical step.', body: 'Explore technologies built for operational continuity and data quality.', allProducts: 'Explore all solutions' },
      capabilities: {
        eyebrow: 'From evidence to action',
        title: 'Complexity stays in the system. Control returns to the team.',
        body: 'Quint combines instruments and workflows to make every decision easier to understand, verify and act on.',
        items: [
          { number: '01', title: 'Connected workflows', body: 'Link operational phases without losing the context around them.' },
          { number: '02', title: 'Prioritised signals', body: 'Bring the information that matters to the people who need it.' },
          { number: '03', title: 'Verifiable quality', body: 'Turn standards and traceability into a daily operating practice.' }
        ]
      },
      statistics: [{ value: '3', label: 'connected scientific areas' }, { value: '8', label: 'solutions in the Quint catalogue' }, { value: '1', label: 'shared operational view' }],
      faqHeading: { eyebrow: 'Quint, at a glance', title: 'Frequently asked questions' },
      faq: [
        { question: 'Who is Quint built for?', answer: 'For laboratories and organisations working across diagnostics, research and quality that need a clearer, more reliable process.' },
        { question: 'Can Quint adapt to our workflow?', answer: 'Every solution starts with the team’s operational context, so adoption is practical without adding unnecessary complexity.' },
        { question: 'How do we begin evaluating a solution?', answer: 'Share your goal with the Quint team and we will identify the right path and technologies together.' }
      ],
      finalCta: { eyebrow: 'The next signal matters', title: 'Build a safer workflow.', body: 'Tell us about your scientific context and the decisions you want to make more dependable.', action: 'Talk to Quint' }
    },
    families: { diagnostics: { title: 'Diagnostics', description: 'Instruments and tests for fast, traceable and useful results.' }, research: { title: 'Research', description: 'Technology that accelerates discovery without sacrificing quality.' }, quality: { title: 'Quality', description: 'Process control for sustainable, repeatable standards.' } },
    contact: { title: 'Let’s discuss your project', intro: 'Tell us your goal and the Quint team will respond with the right path.', name: 'Full name', email: 'Work email', company: 'Company', message: 'Message', send: 'Send request', success: 'Thank you. Your request has been sent.', failure: 'We could not send your request. Please try again later.' }, footer: 'Scientific technology for better decisions.'
  }
};

const products: Record<Locale, Product[]> = {
  it: [
    { slug: 'rapid-diagnostics', family: 'diagnostics', title: 'Diagnostica rapida', summary: 'Test rapidi per decisioni tempestive.', benefit: 'Riduce il tempo tra campione e decisione.' },
    { slug: 'molecular-diagnostics', family: 'diagnostics', title: 'Diagnostica molecolare', summary: 'Flussi di lavoro affidabili per analisi molecolari.', benefit: 'Aumenta confidenza e ripetibilità.' },
    { slug: 'clinical-analyzers', family: 'diagnostics', title: 'Analizzatori clinici', summary: 'Automazione progettata per il laboratorio moderno.', benefit: 'Supporta continuità operativa e tracciabilità.' },
    { slug: 'cell-analysis', family: 'research', title: 'Analisi cellulare', summary: 'Strumenti per osservare processi biologici complessi.', benefit: 'Rende i dati cellulari più leggibili.' },
    { slug: 'sample-preparation', family: 'research', title: 'Preparazione campioni', summary: 'Preparazione coerente fin dal primo passaggio.', benefit: 'Protegge la qualità dell’intero flusso di lavoro.' },
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
