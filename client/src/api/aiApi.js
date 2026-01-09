import api from '../lib/axios';

export const aiApi = {
  generateBlog: async (topic) => api.post('/api/ai/generate-blog', { topic }),
  generateTitles: async (content) =>
    api.post('/api/ai/generate-titles', { content }),
  fixGrammar: async (content) => api.post('/api/ai/fix-grammar', { content }),
  improveContent: async (content) =>
    api.post('/api/ai/improve-content', { content }),
};
