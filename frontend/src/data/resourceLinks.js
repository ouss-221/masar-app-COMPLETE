// Real, verified official/external links used on the Resources page, grouped
// into 4 categories per destination. "Templates" deliberately links back into
// the app's own guide sections rather than external files, since Masar
// doesn't have real downloadable template files to offer - pointing to a
// fabricated "template.docx" link would be worse than just being honest
// about what's actually available.
//
// label: { fr, en, ar } - kept short, description is one more line.
// url: verified real URL (or an internal "/section/xxx" path for guides).
// external: true -> opens in a new tab with rel=noreferrer.

export const RESOURCE_LINKS = {
  es: {
    official: [
      { label: { fr: 'SEPIE (agence nationale Erasmus+/éducation)', en: 'SEPIE (national Erasmus+/education agency)', ar: 'SEPIE (الوكالة الوطنية لإيراسموس+ والتعليم)' }, url: 'https://www.sepie.es', external: true },
      { label: { fr: 'Secrétariat général des universités (Ministerio de Universidades)', en: 'Secretaría General de Universidades (Ministry of Universities)', ar: 'الأمانة العامة للجامعات (وزارة الجامعات)' }, url: 'https://universidades.sede.gob.es/', external: true },
      { label: { fr: "Ministère espagnol des Affaires étrangères (visas)", en: 'Spanish Ministry of Foreign Affairs (visas)', ar: 'وزارة الخارجية الإسبانية (التأشيرات)' }, url: 'https://www.exteriores.gob.es', external: true },
    ],
    documents: [
      { label: { fr: "Déclaration d'équivalence des diplômes étrangers", en: 'Declaration of equivalence of foreign degrees', ar: 'إعلان معادلة الشهادات الأجنبية' }, url: 'https://www.ciencia.gob.es/Universidades/validate.html', external: true },
      { label: { fr: 'Portail Valida-TE (reconnaissance des titres)', en: 'Valida-TE portal (degree recognition)', ar: 'بوابة Valida-TE (الاعتراف بالشهادات)' }, url: 'https://www.ciencia.gob.es/Universidades/validate.html', external: true },
    ],
    tools: [
      { label: { fr: 'UNEDasiss — dossier pour titulaires hors UE', en: 'UNEDasiss — file for non-EU degree holders', ar: 'UNEDasiss — ملف لحاملي الشهادات من خارج الاتحاد الأوروبي' }, url: 'https://www.uned.es/universidad/inicio/en/estudios/masteres/informacion-general/acceso-titulados-extranjeros.html', external: true },
    ],
    guides: [
      { label: { fr: 'Guide Masar — Visa & séjour', en: 'Masar guide — Visa & Residence', ar: 'دليل مسار — التأشيرة والإقامة' }, url: '/section/visa', external: false },
      { label: { fr: 'Guide Masar — Logement', en: 'Masar guide — Housing', ar: 'دليل مسار — السكن' }, url: '/section/housing', external: false },
    ],
  },
  fr: {
    official: [
      { label: { fr: 'Campus France (candidature & information)', en: 'Campus France (applications & info)', ar: 'Campus France (الترشح والمعلومات)' }, url: 'https://www.campusfrance.org/en', external: true },
      { label: { fr: 'France-Visas — portail officiel des visas', en: 'France-Visas — official visa portal', ar: 'France-Visas — البوابة الرسمية للتأشيرات' }, url: 'https://france-visas.gouv.fr/en/', external: true },
      { label: { fr: "Ministère de l'Europe et des Affaires étrangères", en: 'Ministry for Europe and Foreign Affairs', ar: 'وزارة أوروبا والشؤون الخارجية' }, url: 'https://www.diplomatie.gouv.fr/en/coming-to-france/studying-in-france/', external: true },
    ],
    documents: [
      { label: { fr: 'Liste des visas étudiants (Campus France)', en: 'Student visa types (Campus France)', ar: 'أنواع التأشيرات الطلابية (Campus France)' }, url: 'https://www.campusfrance.org/en/the-different-types-of-visas', external: true },
      { label: { fr: 'Validation du VLS-TS en ligne (France-Visas)', en: 'Online VLS-TS validation (France-Visas)', ar: 'التحقق من VLS-TS عبر الإنترنت (France-Visas)' }, url: 'https://www.campusfrance.org/en/student-long-stay-visa', external: true },
    ],
    tools: [
      { label: { fr: 'CROUS — logement étudiant', en: 'CROUS — student housing', ar: 'CROUS — السكن الطلابي' }, url: 'https://www.crous.fr', external: true },
    ],
    guides: [
      { label: { fr: 'Guide Masar — Visa & séjour', en: 'Masar guide — Visa & Residence', ar: 'دليل مسار — التأشيرة والإقامة' }, url: '/section/visa', external: false },
      { label: { fr: 'Guide Masar — Logement', en: 'Masar guide — Housing', ar: 'دليل مسار — السكن' }, url: '/section/housing', external: false },
    ],
  },
  it: {
    official: [
      { label: { fr: 'Universitaly — portail officiel de préinscription', en: 'Universitaly — official pre-enrollment portal', ar: 'Universitaly — البوابة الرسمية للتسجيل المسبق' }, url: 'https://www.universitaly.it/it/first-steps', external: true },
      { label: { fr: 'Ministero degli Affari Esteri (MAECI)', en: 'Ministry of Foreign Affairs (MAECI)', ar: 'وزارة الخارجية الإيطالية (MAECI)' }, url: 'https://www.esteri.it', external: true },
    ],
    documents: [
      { label: { fr: 'Universitaly — premiers pas en Italie', en: 'Universitaly — first steps in Italy', ar: 'Universitaly — الخطوات الأولى في إيطاليا' }, url: 'https://www.universitaly.it/it/first-steps', external: true },
      { label: { fr: 'Permesso di soggiorno — info (Sapienza)', en: 'Residence permit — info (Sapienza)', ar: 'تصريح الإقامة — معلومات (Sapienza)' }, url: 'https://www.uniroma1.it/en/pagina/residence-permit-study-purposes', external: true },
    ],
    tools: [
      { label: { fr: 'Universitaly — étudiants étrangers', en: 'Universitaly — international students', ar: 'Universitaly — الطلبة الدوليون' }, url: 'https://www.universitaly.it/it/studenti-stranieri', external: true },
    ],
    guides: [
      { label: { fr: 'Guide Masar — Visa & séjour', en: 'Masar guide — Visa & Residence', ar: 'دليل مسار — التأشيرة والإقامة' }, url: '/section/visa', external: false },
      { label: { fr: 'Guide Masar — Logement', en: 'Masar guide — Housing', ar: 'دليل مسار — السكن' }, url: '/section/housing', external: false },
    ],
  },
};

export const RESOURCE_CATEGORY_META = [
  { key: 'official', label: { fr: 'Sites officiels', en: 'Official Websites', ar: 'المواقع الرسمية' }, bg: 'var(--m-blue-bg)', fg: 'var(--m-blue)' },
  { key: 'documents', label: { fr: 'Documents', en: 'Documents', ar: 'الوثائق' }, bg: 'var(--m-orange-bg)', fg: 'var(--m-orange)' },
  { key: 'tools', label: { fr: 'Outils', en: 'Tools', ar: 'الأدوات' }, bg: 'var(--m-green-bg)', fg: 'var(--m-green)' },
  { key: 'guides', label: { fr: 'Guides Masar', en: 'Masar Guides', ar: 'أدلة مسار' }, bg: 'var(--m-purple-bg)', fg: 'var(--m-purple)' },
];
