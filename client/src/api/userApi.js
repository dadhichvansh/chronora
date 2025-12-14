import api from '../lib/axios';

export const userApi = {
  getCurrentUser: () => api.get('/api/users/me'),
  updateProfile: (data) => api.put('/api/users/me', data),
};
