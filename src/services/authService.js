import apiClient from './api';
import { setAuthData, clearAuthData } from '../utils/auth';

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/Auth/login', {
      username,
      password,
    });

    const accessToken = response.data.accessToken || response.data.AccessToken;
    const refreshToken = response.data.refreshToken || response.data.RefreshToken;
    const expiresAt = response.data.expiresAt || response.data.ExpiresAt;

    if (accessToken && refreshToken) {
      setAuthData(accessToken, refreshToken, expiresAt);
      return { success: true };
    }

    return { success: false, error: 'No tokens received from server' };
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    if (error.response?.status === 401) {
      errorMessage = 'Invalid username or password';
    } else if (error.response?.status === 400) {
      // ValidationProblemDetails returns errors as a dictionary
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        errorMessage = firstError || 'Invalid request';
      } else {
        errorMessage = error.response?.data?.title || 'Bad request';
      }
    } else if (error.response?.data?.title) {
      errorMessage = error.response.data.title;
    } else if (error.request) {
      errorMessage = 'Cannot connect to server. Please check your connection.';
    }
    return { success: false, error: errorMessage };
  }
};

export const logout = () => clearAuthData();