import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';

// Use this hook instead of plain useDispatch in your components for type safety
export const useAppDispatch: () => AppDispatch = useDispatch; 