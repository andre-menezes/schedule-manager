import { useAuthStore } from '../../src/stores/auth-store';
import { storage } from '../../src/utils/storage';

jest.mock('../../src/utils/storage', () => ({
  storage: {
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  },
}));

jest.mock('../../src/services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

const mockAdminUser = {
  id: '2',
  name: 'Admin User',
  email: 'andre_menezes@outlook.com',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      isAdmin: false,
    });
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAdmin).toBe(false);
  });

  it('should clear error', () => {
    useAuthStore.setState({ error: 'Some error' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should set authenticated to false when no token', async () => {
    (storage.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should set authenticated to true when token and user exist', async () => {
    (storage.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('valid-token')
      .mockResolvedValueOnce(JSON.stringify(mockUser));

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAdmin).toBe(false);
  });

  it('should set isAdmin to true for admin email', async () => {
    (storage.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('valid-token')
      .mockResolvedValueOnce(JSON.stringify(mockAdminUser));

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(mockAdminUser);
    expect(useAuthStore.getState().isAdmin).toBe(true);
  });

  it('should set authenticated to false when no user data', async () => {
    (storage.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('valid-token')
      .mockResolvedValueOnce(null);

    await useAuthStore.getState().checkAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
