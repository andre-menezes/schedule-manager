import axios, { AxiosError, type AxiosInstance } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await storage.deleteItemAsync(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export async function setAuthToken(token: string): Promise<void> {
  await storage.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return storage.getItemAsync(TOKEN_KEY);
}

export async function removeAuthToken(): Promise<void> {
  await storage.deleteItemAsync(TOKEN_KEY);
}

export interface ApiError {
  error: string;
  message: string;
}

export function isApiError(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error);
}
