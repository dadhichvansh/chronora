import api from '../lib/axios';

export const aiApi = {
  generateBlog: async (topic) => api.post('/ai/generate-blog', { topic }),
  generateTitles: async (content) =>
    api.post('/ai/generate-titles', { content }),
  fixGrammar: async (content) => api.post('/ai/fix-grammar', { content }),
  improveContent: async (content) =>
    api.post('/ai/improve-content', { content }),
};
