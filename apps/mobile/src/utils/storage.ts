import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Fallback para web usando localStorage
const webStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  async setItemAsync(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  async deleteItemAsync(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Usa SecureStore em dispositivos nativos e localStorage na web
export const storage = Platform.OS === 'web' ? webStorage : SecureStore;
