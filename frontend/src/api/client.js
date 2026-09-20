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
  localStorage.setItem('masar_user_city', data.targetCity || '');
  localStorage.setItem('masar_user_university', data.university || '');
}

export const auth = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    saveSession(res.data);
    return res;
  },
  register: async (email, password, displayName, targetCity, university, programType) => {
    const res = await api.post('/api/auth/register', {
      email, password, displayName, targetCity, university, programType,
    });
    saveSession(res.data);
    return res;
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('masar_refresh_token');
    try {
      if (refreshToken) await api.post('/api/auth/logout', { refreshToken });
    } finally {
      ['masar_access_token', 'masar_refresh_token', 'masar_user_email',
       'masar_user_name', 'masar_user_city', 'masar_user_university']
        .forEach((k) => localStorage.removeItem(k));
    }
  },
  isLoggedIn: () => !!localStorage.getItem('masar_access_token'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.get('/api/auth/verify-email', { params: { token } }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
};

export const sections = {
  all: (country) => api.get('/api/sections', { params: country ? { country } : {} }),
  bySlug: (slug, country) => api.get(`/api/sections/${slug}`, { params: country ? { country } : {} }),
};

export const sponsors = {
  forSection: (slug) => api.get(`/api/sponsors/${slug}`),
};

export const checklist = {
  mine: () => api.get('/api/checklist'),
  toggle: (itemId, done) => api.put(`/api/checklist/${itemId}`, { done }),
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
