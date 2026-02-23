import { create } from 'zustand';
import { storage } from '../utils/storage';
import * as authService from '../services/auth';
import type { User } from '../services/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ADMIN_EMAIL = 'andre_menezes@outlook.com';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  isAdmin: boolean;
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
  user: null,
  isAdmin: false,

  checkAuth: async () => {
    try {
      const token = await storage.getItemAsync(TOKEN_KEY);
      const userJson = await storage.getItemAsync(USER_KEY);
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          isAuthenticated: true,
          isLoading: false,
          user,
          isAdmin: user.email === ADMIN_EMAIL,
        });
      } else {
        set({ isAuthenticated: false, isLoading: false, user: null, isAdmin: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false, user: null, isAdmin: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      await storage.setItemAsync(USER_KEY, JSON.stringify(response.user));
      set({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        isAdmin: response.user.email === ADMIN_EMAIL,
      });
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
      const response = await authService.register({ name, email, password });
      await storage.setItemAsync(USER_KEY, JSON.stringify(response.user));
      set({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        isAdmin: response.user.email === ADMIN_EMAIL,
      });
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
      await storage.deleteItemAsync(USER_KEY);
      set({ isAuthenticated: false, isLoading: false, user: null, isAdmin: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false, user: null, isAdmin: false });
    }
  },

  clearError: () => set({ error: null }),
}));
