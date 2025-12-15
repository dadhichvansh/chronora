import api from '../lib/axios';

export const postApi = {
  createPost: (data) => api.post('/api/posts', data),
  getPostById: (postId) => api.get(`/api/posts/${postId}`),
  getAllPosts: () => api.get('/api/posts'),
  getUserPosts: (userId) => api.get(`/api/posts/u/${userId}`),
  updatePost: (id, data) => api.put(`/api/posts/${id}`, data),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  toggleLike: (postId) => api.post(`/api/posts/${postId}/like`),
};
