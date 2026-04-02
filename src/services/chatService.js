import apiClient from './api';

export const sendMessage = async (message) => {
  try {
    const response = await apiClient.post('/api/chat/message', { message });
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Failed to send message. Please try again.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = 'Cannot connect to server. Please check your connection.';
    }
    return { success: false, error: errorMessage };
  }
};