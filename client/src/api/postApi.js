import api from '../lib/axios';

export const postApi = {
  getFeed: () => api.get('/api/posts'),
  getPostById: (postId) => api.get(`/api/posts/${postId}`),
  createPost: (data) => api.post('/api/posts', data),
  getUserPosts: (userId) => api.get(`/api/posts/u/${userId}`),
  updatePost: (id, data) => api.put(`/api/posts/${id}`, data),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  toggleLike: (postId) => api.post(`/api/posts/${postId}/like`),
};
