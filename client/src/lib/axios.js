import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Update with your backend URL in .env
  withCredentials: true,
});

export const setupInterceptors = (logoutUser) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Optionally trigger logout or token refresh
        logoutUser();
      }
      return Promise.reject(error);
    }
  );
};

export default api;
