export const setAuthData = (accessToken, refreshToken, expiresAt) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  // Store as ISO string — works whether .NET sends DateTime or string
  localStorage.setItem('expiresAt', new Date(expiresAt).toISOString());
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const getExpiresAt = () => localStorage.getItem('expiresAt');

export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresAt');
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  const expiresAt = getExpiresAt();
  if (!token) return false;
  if (expiresAt) {
    const expirationDate = new Date(expiresAt);
    // Guard against invalid date values
    if (!isNaN(expirationDate.getTime()) && new Date() >= expirationDate) {
      return false;
    }
  }
  return true;
};

export const isTokenExpiringSoon = () => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return false;
  const expirationDate = new Date(expiresAt);
  if (isNaN(expirationDate.getTime())) return false;
  const fiveMinutes = 5 * 60 * 1000;
  return (expirationDate.getTime() - new Date().getTime()) < fiveMinutes;
};