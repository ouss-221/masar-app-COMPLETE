// Simple localStorage-backed "favorite universities" list. Deliberately not
// synced to the backend (no account requirement to save a shortlist) - the
// same tradeoff the app already makes for language/nationality/destination.
const KEY = 'masar_favorite_universities';

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

export function getFavorites() {
  return read();
}

export function isFavorite(slug) {
  return read().includes(slug);
}

export function toggleFavorite(slug) {
  const list = read();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  write(next);
  return next;
}
