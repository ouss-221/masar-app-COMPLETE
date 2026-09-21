// Shared between the signup form (Login.jsx) and the profile editor
// (PersonalInfo.jsx), so the two never drift out of sync with each other.

// Real major student-destination cities per country - not exhaustive, but
// every name here is a real city (several match universities already seeded
// in the app).
export const CITIES_BY_COUNTRY = {
  es: ['Madrid', 'Barcelona', 'Valencia', 'Granada', 'Alicante', 'Zaragoza', 'Sevilla', 'Other'],
  fr: ['Paris', 'Lyon', 'Marseille', 'Lille', 'Strasbourg', 'Bordeaux', 'Montpellier', 'Nantes', 'Other'],
  it: ['Rome', 'Milan', 'Turin', 'Bologna', 'Padua', 'Pisa', 'Florence', 'Naples', 'Other'],
};

export const PROGRAMS = ['Bachelor', 'Master', 'PhD', 'Language course', 'Other'];

// Where the student is moving FROM - optional, powers the Community tab's
// per-city nationality breakdown ("21 Algerian, 15 Moroccan..."). Kept to the
// countries Masar's own guide content is actually written for, plus "other"
// rather than a full country picker, since the rest of the app doesn't
// support other origin countries yet.
export const ORIGIN_COUNTRIES = [
  { code: 'dz', flag: '🇩🇿', label: { fr: 'Algérie', en: 'Algeria', ar: 'الجزائر' } },
  { code: 'ma', flag: '🇲🇦', label: { fr: 'Maroc', en: 'Morocco', ar: 'المغرب' } },
  { code: 'tn', flag: '🇹🇳', label: { fr: 'Tunisie', en: 'Tunisia', ar: 'تونس' } },
  { code: 'other', flag: '🌍', label: { fr: 'Autre', en: 'Other', ar: 'أخرى' } },
];
