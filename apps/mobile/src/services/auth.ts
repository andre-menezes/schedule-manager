import { api, setAuthToken, removeAuthToken } from './api';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', input);
  await setAuthToken(response.data.token);
  return response.data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', input);
  await setAuthToken(response.data.token);
  return response.data;
}

export async function logout(): Promise<void> {
  await removeAuthToken();
}

export async function listUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/s/members');
  return response.data;
}
