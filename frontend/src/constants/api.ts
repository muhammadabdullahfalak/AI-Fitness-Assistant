// API constants for the Fitness AI Chat App

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  PROFILE: '/api/auth/profile',
  
  // Chat endpoints
  GEMINI: '/api/gemini',
  CHAT_HISTORY: '/api/chat/history',
  SAVE_CHAT: '/api/chat/save',
  DELETE_CHAT: '/api/chat', // not '/api/chat/delete'
  
  // User data
  USER_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;