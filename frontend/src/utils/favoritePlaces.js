// Same simple localStorage-backed pattern as favorites.js (universities), for
// places on the Explore map - a separate key so the two lists never mix.
const KEY = 'masar_favorite_places';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // localStorage unavailable (private mode, quota) - favorites just won't persist this session
  }
}

export function getFavoritePlaces() {
  return read();
}

export function isFavoritePlace(id) {
  return read().includes(id);
}

export function toggleFavoritePlace(id) {
  const list = read();
  const next = list.includes(id) ? list.filter((s) => s !== id) : [...list, id];
  write(next);
  return next;
}
