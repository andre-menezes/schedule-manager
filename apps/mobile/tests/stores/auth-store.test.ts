import { useAuthStore } from '../../src/stores/auth-store';
import * as SecureStore from 'expo-secure-store';

jest.mock('../../src/services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should clear error', () => {
    useAuthStore.setState({ error: 'Some error' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should set authenticated to false when no token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should set authenticated to true when token exists', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('valid-token');

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
