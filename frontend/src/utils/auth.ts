// Authentication utilities

export const TOKEN_KEY = 'fitness_ai_token';
export const USER_KEY = 'fitness_ai_user';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // Basic JWT validation - check if it has 3 parts
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    
    return payload.exp > now;
  } catch {
    return false;
  }
};

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setUserInStorage = (user: any) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};