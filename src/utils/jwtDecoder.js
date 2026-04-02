export const decodeJwtToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const decoded = decodeJwtToken(token);
  return decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

export const getUsername = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const decoded = decodeJwtToken(token);
  return decoded?.unique_name || decoded?.name || null;
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const decoded = decodeJwtToken(token);
  if (!decoded) return null;
  return {
    id: decoded.nameid || decoded.sub,
    username: decoded.unique_name || decoded.name,
    role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    exp: decoded.exp,
  };
};