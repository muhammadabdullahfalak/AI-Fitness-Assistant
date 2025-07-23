// Types for the Fitness AI Chat App

export interface UserProfile {
  age: string;
  sex: 'Male' | 'Female';
  weight: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamText: string;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FitnessApiResponse {
  text: string;
  success: boolean;
  error?: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// Redux store types
export interface RootState {
  auth: AuthState;
  chat: {
    currentThread: ChatThread | null;
    threads: ChatThread[];
    userProfile: UserProfile;
    isLoading: boolean;
  };
}