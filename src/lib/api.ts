import axios from 'axios';

// In production, set VITE_API_URL to your backend URL e.g. https://api.yourdomain.com
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/** Resolve an image URL — handles Cloudinary URLs (already absolute) and local /uploads/ paths */
export function getImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  // Already an absolute URL (Cloudinary, http, https)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path — prepend backend base URL
  return `${API_BASE_URL}${url}`;
}

export default api;
