import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as authService from '../services/auth';

const TOKEN_KEY = 'auth_token';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ isAuthenticated: !!token, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login({ email, password });
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register({ name, email, password });
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ isAuthenticated: false, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
