import apiClient from './api';

export const sendMessage = async (message, sessionId = null) => {
  try {
    const response = await apiClient.post('/api/Chat/message', { message, sessionId });
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Failed to send message. Please try again.';
    if (error.response?.data?.title) {
      errorMessage = error.response.data.title;
    } else if (error.request) {
      errorMessage = 'Cannot connect to server. Please check your connection.';
    }
    return { success: false, error: errorMessage };
  }
};