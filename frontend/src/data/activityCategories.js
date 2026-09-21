// Nomadtable-style activity categories for the Explore/Map "Add activity"
// wizard (step 2, "What type?") and for rendering each activity's pin/badge
// on the map and in lists. Replaces the old, narrower CohortRoom-only set
// ('meetup'/'housing'/'orientation'/'arrival'/'study'/'other') for anything
// created going forward - existing activities in the database that still
// carry one of those old values keep working fine (the `category` column is
// a plain string, no DB-level enum), they just fall back to the OTHER_CATEGORY
// emoji/color/label below since their key won't be in this list.
export const ACTIVITY_CATEGORIES = [
  { key: 'food', emoji: '🍽️', color: '#C0392B', label: { fr: 'Restauration', en: 'Food & Drinks', ar: 'مطاعم ومشروبات' } },
  { key: 'nightlife', emoji: '🍸', color: '#6B3FA0', label: { fr: 'Vie nocturne', en: 'Nightlife', ar: 'حياة ليلية' } },
  { key: 'outdoor', emoji: '🏃', color: '#1A7A5E', label: { fr: 'Plein air', en: 'Outdoor & Active', ar: 'أنشطة خارجية' } },
  { key: 'sightseeing', emoji: '🏛️', color: '#2E7CF6', label: { fr: 'Visites', en: 'Sightseeing', ar: 'مَعالم سياحية' } },
  { key: 'entertainment', emoji: '🎭', color: '#B85C2E', label: { fr: 'Divertissement', en: 'Entertainment', ar: 'ترفيه' } },
  { key: 'shopping', emoji: '🛍️', color: '#C2447A', label: { fr: 'Shopping', en: 'Shopping', ar: 'تسوّق' } },
  { key: 'wellness', emoji: '🧘', color: '#3E9E8C', label: { fr: 'Bien-être', en: 'Wellness', ar: 'عافية' } },
  { key: 'rideshare', emoji: '🚗', color: '#4A6FA5', label: { fr: 'Covoiturage', en: 'Rideshare', ar: 'مشاركة الركوب' } },
  { key: 'social', emoji: '👋', color: '#0B5C56', label: { fr: 'Social', en: 'Social', ar: 'اجتماعي' } },
  { key: 'other', emoji: '✨', color: '#5A5A6E', label: { fr: 'Autre', en: 'Other', ar: 'أخرى' } },
];

export const OTHER_CATEGORY = ACTIVITY_CATEGORIES[ACTIVITY_CATEGORIES.length - 1];

export function categoryFor(key) {
  return ACTIVITY_CATEGORIES.find((c) => c.key === key) || OTHER_CATEGORY;
}
