import axios from 'axios';
import config from '../config/env';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem('accessToken');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/Auth/refresh`,
            { refreshToken: storedRefreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          // Guard for both camelCase and PascalCase from ChatLoginResponse
          const accessToken = response.data.accessToken || response.data.AccessToken;
          const newRefreshToken = response.data.refreshToken || response.data.RefreshToken;
          const expiresAt = response.data.expiresAt || response.data.ExpiresAt;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('expiresAt', expiresAt);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;