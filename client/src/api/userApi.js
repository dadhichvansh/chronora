import api from '../lib/axios';

export const userApi = {
  getCurrentUser: () => api.get('/api/users/me'),
  updateDisplayName: (displayName) =>
    api.put('/api/users/me/displayname', { displayName }),
  uploadProfileImage: (data) => api.post('/api/users/me/avatar', data),
  removeProfileImage: () => api.delete('/api/users/me/avatar'),
};
