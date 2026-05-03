import axios from 'axios';

/**
 * Base URL: same origin in dev (Vite proxy) or VITE_API_URL in production.
 */
const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/** Attach JWT from localStorage */
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('fc_user');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      /* ignore */
    }
  }
  return config;
});

export async function registerUser(data) {
  const { data: res } = await api.post('/api/auth/register', data);
  return res;
}

export async function loginUser(data) {
  const { data: res } = await api.post('/api/auth/login', data);
  return res;
}

export async function fetchFeedbackList(params) {
  const { data } = await api.get('/api/feedback', { params });
  return data;
}

export async function fetchFeedbackById(id) {
  const { data } = await api.get(`/api/feedback/${id}`);
  return data;
}

export async function createFeedback(formData) {
  const { data } = await api.post('/api/feedback', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateFeedback(id, formData) {
  const { data } = await api.put(`/api/feedback/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteFeedback(id) {
  const { data } = await api.delete(`/api/feedback/${id}`);
  return data;
}

export async function fetchAdminStats() {
  const { data } = await api.get('/api/admin/stats');
  return data;
}

export async function updateAdminStatus(id, status) {
  const { data } = await api.put(`/api/admin/status/${id}`, { status });
  return data;
}
