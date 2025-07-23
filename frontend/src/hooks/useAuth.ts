// Custom hook for authentication

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { loginUser, signupUser, logoutUser, initializeAuth, clearError } from '@/store/slices/authSlice';
import { LoginCredentials, SignupCredentials } from '@/constants/types';
import type { AppDispatch } from '@/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  };

  const signup = async (credentials: SignupCredentials) => {
    return dispatch(signupUser(credentials));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearAuthError,
  };
};