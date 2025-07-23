// Image paths for the Fitness AI Chat App

export const IMAGES = {
  // Auth pages
  LOGIN_HERO: '/images/login-hero.jpg',
  SIGNUP_HERO: '/images/signup-hero.jpg',
  
  // Chat interface
  AI_AVATAR: '/images/ai-avatar.png',
  USER_AVATAR: '/images/user-avatar.png',
  
  // Fitness related
  FITNESS_BANNER: '/images/fitness-banner.jpg',
  BMI_CHART: '/images/bmi-chart.png',
  WORKOUT_ICON: '/images/workout-icon.svg',
  
  // App icons
  LOGO: '/images/logo.png',
  LOGO_SMALL: '/images/logo-small.png',
  
  // Empty states
  EMPTY_CHAT: '/images/empty-chat.svg',
  NO_HISTORY: '/images/no-history.svg',
} as const;

export type ImageKey = keyof typeof IMAGES;