import api from '../lib/axios';

export const commentApi = {
  addComment: (postId, content) =>
    api.post('/api/comments', { postId, content }),
  deleteComment: (commentId) => api.delete(`/api/comments/${commentId}`),
};
