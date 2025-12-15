import api from '../lib/axios';

export const commentApi = {
  addComment: (postId, data) => api.post('/api/comments', { postId, ...data }),
  deleteComment: (commentId) => api.delete(`/api/comments/${commentId}`),
};
