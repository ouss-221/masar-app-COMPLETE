import axios from 'axios';

// Using `adb reverse tcp:8080 tcp:8080`, the emulator's own "localhost:8080"
// is tunneled straight to the PC's localhost:8080 over ADB - bypassing the
// network entirely, so no firewall or 10.0.2.2 configuration matters. Run
// that command again after every emulator restart, since the tunnel doesn't
// persist across reboots.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const api = axios.create({ baseURL: API_BASE });

// attach the short-lived access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('masar_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if the access token has expired (401), use the refresh token to get a new
// one automatically, then retry the original request - the user never
// notices, they just stay logged in.
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem('masar_refresh_token');

    if (error.response?.status === 401 && refreshToken && !original._retried) {
      original._retried = true;
      try {
        refreshing = refreshing || axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
        const res = await refreshing;
        refreshing = null;

        localStorage.setItem('masar_access_token', res.data.accessToken);
        localStorage.setItem('masar_refresh_token', res.data.refreshToken);

        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch {
        refreshing = null;
        localStorage.removeItem('masar_access_token');
        localStorage.removeItem('masar_refresh_token');
        localStorage.removeItem('masar_user_email');
        localStorage.removeItem('masar_user_name');
        localStorage.removeItem('masar_user_country');
        localStorage.removeItem('masar_user_city');
        localStorage.removeItem('masar_user_university');
      }
    }
    return Promise.reject(error);
  }
);

function saveSession(data) {
  localStorage.setItem('masar_access_token', data.accessToken);
  localStorage.setItem('masar_refresh_token', data.refreshToken);
  localStorage.setItem('masar_user_email', data.email);
  localStorage.setItem('masar_user_name', data.displayName || '');
  localStorage.setItem('masar_user_country', data.targetCountry || '');
  localStorage.setItem('masar_user_city', data.targetCity || '');
  localStorage.setItem('masar_user_university', data.university || '');
}

export const auth = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    saveSession(res.data);
    return res;
  },
  register: async (email, password, displayName, originCountry, targetCountry, targetCity, university, programType) => {
    const res = await api.post('/api/auth/register', {
      email, password, displayName, originCountry, targetCountry, targetCity, university, programType,
    });
    saveSession(res.data);
    return res;
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('masar_refresh_token');
    try {
      if (refreshToken) await api.post('/api/auth/logout', { refreshToken });
    } finally {
      ['masar_access_token', 'masar_refresh_token', 'masar_user_email', 'masar_user_name',
       'masar_user_country', 'masar_user_city', 'masar_user_university']
        .forEach((k) => localStorage.removeItem(k));
    }
  },
  isLoggedIn: () => !!localStorage.getItem('masar_access_token'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.get('/api/auth/verify-email', { params: { token } }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  me: () => api.get('/api/auth/me'),
  updateProfile: async (displayName, originCountry, targetCountry, targetCity, university, programType, discoverable, birthDate) => {
    const res = await api.put('/api/auth/me', { displayName, originCountry, targetCountry, targetCity, university, programType, discoverable, birthDate });
    // Keep localStorage (used for the avatar initial/name elsewhere) in sync too.
    localStorage.setItem('masar_user_name', res.data.displayName || '');
    localStorage.setItem('masar_user_country', res.data.targetCountry || '');
    localStorage.setItem('masar_user_city', res.data.targetCity || '');
    localStorage.setItem('masar_user_university', res.data.university || '');
    return res;
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await api.post('/api/auth/change-password', { currentPassword, newPassword });
    // The backend revokes every session (including this one) and returns a
    // fresh pair of tokens for this device, so we swap them in immediately
    // instead of forcing a re-login right after a successful password change.
    saveSession(res.data);
    return res;
  },
};

export const sections = {
  all: (country) => api.get('/api/sections', { params: country ? { country } : {} }),
  bySlug: (slug, country) => api.get(`/api/sections/${slug}`, { params: country ? { country } : {} }),
};

export const universitiesApi = {
  all: (country) => api.get('/api/universities', { params: country ? { country } : {} }),
  bySlug: (slug) => api.get(`/api/universities/${slug}`),
};

export const sponsors = {
  forSection: (slug) => api.get(`/api/sponsors/${slug}`),
};

export const checklist = {
  mine: (country) => api.get('/api/checklist', { params: country ? { country } : {} }),
  toggle: (itemId, done) => api.put(`/api/checklist/${itemId}`, { done }),
};

export const community = {
  // Live counts per destination (country, city), broken down by origin
  // country where enough members are visible - public, no login required, so
  // a guest can see "why join" before creating an account.
  counts: (country) => api.get('/api/community/counts', { params: country ? { country } : {} }),
  // Get-or-create the cohort group for a (country, city) and return it with
  // the caller's own membership state (requires login).
  group: (country, city) => api.get('/api/community/group', { params: { country, city } }),
  groupById: (groupId) => api.get(`/api/community/${groupId}`),
  join: (country, city, visible) => api.post('/api/community/join', { country, city, visible }),
  leave: (groupId) => api.post(`/api/community/${groupId}/leave`),
  setVisibility: (groupId, visible) => api.put(`/api/community/${groupId}/visibility`, { visible }),
  members: (groupId) => api.get(`/api/community/${groupId}/members`),
  messages: (groupId, afterId) => api.get(`/api/community/${groupId}/messages`, { params: afterId ? { afterId } : {} }),
  sendMessage: (groupId, content) => api.post(`/api/community/${groupId}/messages`, { content }),
  report: (targetUserId, targetMessageId, reason) => api.post('/api/community/report', { targetUserId, targetMessageId, reason }),
  block: (userId) => api.post(`/api/community/block/${userId}`),
  unblock: (userId) => api.delete(`/api/community/block/${userId}`),
  blockedIds: () => api.get('/api/community/blocked'),
};

export const activities = {
  forGroup: (groupId) => api.get(`/api/activities/group/${groupId}`),
  // Public, city-wide list for the Explore/Map tab - no login required to see
  // pins/cards; RSVPing still needs one (auto-joins the group, see backend).
  forCity: (country, city) => api.get('/api/activities/city', { params: { country, city } }),
  create: (groupId, payload) => api.post(`/api/activities/group/${groupId}`, payload),
  // Create straight from the Explore/Map tab - requires a pin (lat/lng), and
  // the caller doesn't need to already belong to (or even know about) that
  // city's cohort group; the backend silently creates/joins it. See
  // ActivityController.createOnCityMap.
  createOnMap: (country, city, payload) => api.post('/api/activities/city', { country, city, ...payload }),
  // going=true on a "private" activity doesn't RSVP straight away - it files
  // a pending ActivityJoinRequest for the host to approve/decline instead
  // (see ActivityController.rsvp); the response's joinStatus tells you which
  // happened ("going" vs "pending"). going=false withdraws either one.
  rsvp: (activityId, going) => api.post(`/api/activities/${activityId}/rsvp`, { going }),
  // Host-only: review and decide who's waiting to join a "private" activity.
  joinRequests: (activityId) => api.get(`/api/activities/${activityId}/join-requests`),
  approveJoinRequest: (requestId) => api.post(`/api/activities/join-requests/${requestId}/approve`),
  declineJoinRequest: (requestId) => api.post(`/api/activities/join-requests/${requestId}/decline`),
  // Full detail for one activity - powers ActivityChat.jsx, the destination
  // every "tap this activity" affordance in the app lands on.
  get: (activityId) => api.get(`/api/activities/${activityId}`),
  // Poll-based chat, same pattern as community.messages/sendMessage above -
  // gated server-side to the host and whoever has actually RSVP'd "going"
  // (see ActivityController.canAccessChat).
  chatMessages: (activityId, afterId) => api.get(`/api/activities/${activityId}/messages`, { params: afterId ? { afterId } : {} }),
  sendChatMessage: (activityId, content) => api.post(`/api/activities/${activityId}/messages`, { content }),
};

export const places = {
  // Real venues (restaurant/cafe/bar/landmark) sourced from OpenStreetMap -
  // public, no login required. See PlaceSyncService on the backend for why
  // there are no ratings/reviews here.
  forCity: (country, city, category) => api.get('/api/places', { params: { country, city, ...(category ? { category } : {}) } }),
  byId: (id) => api.get(`/api/places/${id}`),
  sync: (country, city) => api.post('/api/places/sync', null, { params: { country, city } }),
};

export const location = {
  // Opt-in live location sharing - see LocationController for the privacy
  // rules (server never returns another user's raw coordinates, only a
  // rounded distance; turning sharing off clears the stored position).
  setSharing: (sharing) => api.put('/api/location/sharing', { sharing }),
  ping: (lat, lng) => api.put('/api/location/ping', { lat, lng }),
  nearby: (lat, lng, radiusKm) => api.get('/api/location/nearby', { params: { lat, lng, radiusKm } }),
};

export const students = {
  byUniversity: (university) => api.get('/api/students/university', { params: university ? { university } : {} }),
};

export const profilePhoto = {
  // Fetched as an authenticated blob rather than a plain <img src> - same
  // reasoning as exportApi.downloadChecklistPdf below: a plain <img> tag
  // can't carry the Authorization header this app's JWT auth needs, and the
  // photo endpoints require a login (see ProfilePhotoController). `userId`
  // omitted fetches the logged-in user's own photo; pass another user's id
  // to fetch theirs (Community/Nearby/Activities/chats - anywhere their name
  // is already shown). Rejects (never resolves) when there's no photo, so
  // callers should .catch() and fall back to an initials avatar.
  fetch: (userId) => api.get(`/api/profile-photo/${userId || 'me'}`, { responseType: 'blob' }),
  // file: a File/Blob, already cropped+compressed client-side (see
  // AvatarEditor.jsx) - the backend still re-validates type and size.
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/profile-photo/me', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  remove: () => api.delete('/api/profile-photo/me'),
};

export const exportApi = {
  // Plain <a href> can't carry the Authorization header, so we fetch with the
  // token attached and trigger the download from the blob instead.
  downloadChecklistPdf: async () => {
    const res = await api.get('/api/export/checklist.pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'masar-checklist.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
