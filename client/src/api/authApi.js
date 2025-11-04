import api from '../lib/axios';

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
};
