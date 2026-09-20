// Content for the Home page hero that genuinely varies by destination country
// and, for the origin city, by selected nationality - unlike the old version
// which was hardcoded to "Algiers" and "Spanish campus" regardless of what
// the user picked.

export const HERO_TEMPLATE = {
  fr: (city, adj) => `De ${city} à votre campus ${adj}`,
  en: (city, adj) => `From ${city} to your ${adj} campus`,
  ar: (city, adj) => `من ${city} إلى حرمك الجامعي ${adj}`,
};

export const CAPITAL_CITY = {
  dz: { fr: 'Alger', en: 'Algiers', ar: 'الجزائر' },
  ma: { fr: 'Rabat', en: 'Rabat', ar: 'الرباط' },
  tn: { fr: 'Tunis', en: 'Tunis', ar: 'تونس' },
};

export const DEST_ADJECTIVE = {
  es: { fr: 'espagnol', en: 'Spanish', ar: 'إسباني' },
  fr: { fr: 'français', en: 'French', ar: 'فرنسي' },
  it: { fr: 'italien', en: 'Italian', ar: 'إيطالي' },
};

export const ROUTE_LABELS = {
  fr: { origin: null, visa: 'Visa & documents', arrival: 'Arrivée', settled: 'Installé·e' },
  en: { origin: null, visa: 'Visa & documents', arrival: 'Arrival', settled: 'Settled in' },
  ar: { origin: null, visa: 'التأشيرة والوثائق', arrival: 'الوصول', settled: 'الاستقرار' },
};

// Four short stats per destination, genuinely different facts for each country
// rather than reusing Spain's numbers everywhere.
export const HOME_STATS = {
  es: {
    fr: [
      { n: '2–3 mois', l: 'délai de traitement du visa' },
      { n: '30 jours', l: 'pour demander la TIE après arrivée' },
      { n: '30h/sem.', l: "droit de travail étudiant" },
      { n: 'BLS', l: 'centre de dépôt du visa' },
    ],
    en: [
      { n: '2–3 months', l: 'typical visa processing time' },
      { n: '30 days', l: 'deadline to request the TIE' },
      { n: '30h/week', l: 'student work rights' },
      { n: 'BLS', l: 'visa application center' },
    ],
    ar: [
      { n: '2–3 أشهر', l: 'مدة معالجة التأشيرة عادةً' },
      { n: '30 يومًا', l: 'مهلة طلب بطاقة TIE بعد الوصول' },
      { n: '30 س/أسبوع', l: 'حق العمل للطالب' },
      { n: 'BLS', l: 'مركز إيداع التأشيرة' },
    ],
  },
  fr: {
    fr: [
      { n: '877,50€', l: 'ressources mensuelles exigées (2026)' },
      { n: 'TCF/DAP', l: 'test de français requis' },
      { n: '964h/an', l: "droit de travail (hors accord DZ)" },
      { n: 'TLScontact', l: 'centre de dépôt du visa' },
    ],
    en: [
      { n: '€877.50', l: 'monthly resources required (2026)' },
      { n: 'TCF/DAP', l: 'French test required' },
      { n: '964h/year', l: 'work rights (standard regime)' },
      { n: 'TLScontact', l: 'visa application center' },
    ],
    ar: [
      { n: '877.50€', l: 'الموارد الشهرية المطلوبة (2026)' },
      { n: 'TCF/DAP', l: 'اختبار الفرنسية المطلوب' },
      { n: '964 س/سنة', l: 'حق العمل (النظام العادي)' },
      { n: 'TLScontact', l: 'مركز إيداع التأشيرة' },
    ],
  },
  it: {
    fr: [
      { n: '10 179,85€', l: 'seuil financier annuel (2026-27)' },
      { n: '8 jours', l: 'pour demander le permesso di soggiorno' },
      { n: '20h/sem.', l: 'droit de travail étudiant' },
      { n: 'CIMEA', l: 'reconnaissance du diplôme' },
    ],
    en: [
      { n: '€10,179.85', l: 'annual financial threshold (2026-27)' },
      { n: '8 days', l: 'deadline to request the permesso di soggiorno' },
      { n: '20h/week', l: 'student work rights' },
      { n: 'CIMEA', l: 'degree recognition' },
    ],
    ar: [
      { n: '10179.85€', l: 'العتبة المالية السنوية (2026-27)' },
      { n: '8 أيام', l: 'مهلة طلب تصريح الإقامة' },
      { n: '20 س/أسبوع', l: 'حق العمل للطالب' },
      { n: 'CIMEA', l: 'معادلة الشهادة' },
    ],
  },
};
