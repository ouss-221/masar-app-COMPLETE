// Real, well-known city-center coordinates for every city offered in
// CITIES_BY_COUNTRY (profileOptions.js) - used only to center/zoom the
// Community map to the right place, not to plot anything on their own.
export const CITY_COORDINATES = {
  // Spain
  Madrid: [40.4168, -3.7038],
  Barcelona: [41.3874, 2.1686],
  Valencia: [39.4699, -0.3763],
  Granada: [37.1773, -3.5986],
  Alicante: [38.3452, -0.481],
  Zaragoza: [41.6488, -0.8891],
  Sevilla: [37.3891, -5.9845],
  // France
  Paris: [48.8566, 2.3522],
  Lyon: [45.764, 4.8357],
  Marseille: [43.2965, 5.3698],
  Lille: [50.6292, 3.0573],
  Strasbourg: [48.5734, 7.7521],
  Bordeaux: [44.8378, -0.5792],
  Montpellier: [43.6108, 3.8767],
  Nantes: [47.2184, -1.5536],
  // Italy
  Rome: [41.9028, 12.4964],
  Milan: [45.4642, 9.19],
  Turin: [45.0703, 7.6869],
  Bologna: [44.4949, 11.3426],
  Padua: [45.4064, 11.8768],
  Pisa: [43.7228, 10.4017],
  Florence: [43.7696, 11.2558],
  Naples: [40.8518, 14.2681],
};

// Country-level fallback (used when a city isn't in the list above, e.g. a
// city typed as "Other" at signup) - each destination's capital.
export const COUNTRY_FALLBACK_CENTER = {
  es: [40.4168, -3.7038],
  fr: [48.8566, 2.3522],
  it: [41.9028, 12.4964],
};

// Same formula as the backend's LocationController/ActivityController - used
// client-side for immediate feedback in the "Add activity" wizard's Where
// step (see Explore.jsx) before the backend's own authoritative check runs.
export function haversineKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Kept in sync with the backend's ActivityController MAX_ACTIVITY_DISTANCE_KM.
export const MAX_ACTIVITY_DISTANCE_KM = 80;
