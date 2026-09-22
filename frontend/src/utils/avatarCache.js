// In-memory cache of profile-photo blob URLs, keyed by userId ('me' for the
// logged-in user's own photo). Every avatar shown anywhere in the app
// (Profile, Community, Nearby Students, Activities, chats, user cards) goes
// through this so the same photo is only fetched once per session instead of
// once per card - member lists and chat logs can show the same person many
// times over. Not persisted anywhere (no localStorage/IndexedDB) - it's
// just avoiding repeat network round-trips within a single page session,
// same lifetime as any other in-memory React state.
//
// Entries: { url: string|null, promise: Promise|null }
// url === null means "confirmed no photo" (a real fetch happened and 404'd),
// not "not fetched yet" - callers distinguish that with hasEntry().
const cache = new Map();
const listeners = new Map(); // userId -> Set<fn> - notified when that entry changes

import { profilePhoto } from '../api/client.js';

function key(userId) {
  return userId == null ? 'me' : String(userId);
}

export function hasEntry(userId) {
  return cache.has(key(userId));
}

export function getCachedUrl(userId) {
  const entry = cache.get(key(userId));
  return entry ? entry.url : undefined;
}

// Fetches (or returns the in-flight/cached result for) a user's avatar.
// Resolves to a blob: URL string, or null if the user has no photo.
export function loadAvatar(userId) {
  const k = key(userId);
  const existing = cache.get(k);
  if (existing) {
    return existing.promise || Promise.resolve(existing.url);
  }

  const promise = profilePhoto.fetch(userId)
    .then((res) => {
      const url = URL.createObjectURL(res.data);
      cache.set(k, { url, promise: null });
      notify(k);
      return url;
    })
    .catch(() => {
      // 404 (no photo) or a network hiccup - either way, treat as "no photo"
      // rather than leaving the avatar stuck loading forever. A real network
      // error just means this user's initials show a bit longer than ideal,
      // which is a much better failure mode than a broken image icon.
      cache.set(k, { url: null, promise: null });
      notify(k);
      return null;
    });

  cache.set(k, { url: undefined, promise });
  return promise;
}

// Call after uploading or removing the current user's own photo, so every
// Avatar already on screen (and any mounted later) picks up the change
// instead of showing a stale cached copy for the rest of the session.
export function invalidateAvatar(userId) {
  const k = key(userId);
  const existing = cache.get(k);
  if (existing?.url) {
    try { URL.revokeObjectURL(existing.url); } catch { /* ignore */ }
  }
  cache.delete(k);
  notify(k);
}

export function subscribe(userId, fn) {
  const k = key(userId);
  if (!listeners.has(k)) listeners.set(k, new Set());
  listeners.get(k).add(fn);
  return () => listeners.get(k)?.delete(fn);
}

function notify(k) {
  listeners.get(k)?.forEach((fn) => fn());
}
