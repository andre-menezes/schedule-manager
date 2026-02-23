import { describe, expect, it, mock } from 'bun:test';
import { LoginUser } from '../../src/application/use-cases/login-user.js';
import { InvalidCredentialsError } from '../../src/domain/errors/domain-error.js';
import type { UserRepository } from '../../src/domain/repositories/user-repository.js';
import type { HashService } from '../../src/application/services/hash-service.js';
import type { TokenService } from '../../src/application/services/token-service.js';

describe('LoginUser', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createMocks = () => {
    const userRepository: UserRepository = {
      create: mock(() => Promise.resolve(mockUser)),
      findByEmail: mock(() => Promise.resolve(mockUser)),
      findById: mock(() => Promise.resolve(mockUser)),
      findAll: mock(() => Promise.resolve([mockUser])),
      updatePassword: mock(() => Promise.resolve()),
      deactivate: mock(() => Promise.resolve()),
      reactivate: mock(() => Promise.resolve()),
    };

    const hashService: HashService = {
      hash: mock(() => Promise.resolve('hashed-password')),
      compare: mock(() => Promise.resolve(true)),
    };

    const tokenService: TokenService = {
      generate: mock(() => 'jwt-token'),
      verify: mock(() => ({ userId: 'user-123' })),
    };

    return { userRepository, hashService, tokenService };
  };

  it('should login user with valid credentials and return a token', async () => {
    const { userRepository, hashService, tokenService } = createMocks();
    const loginUser = new LoginUser(userRepository, hashService, tokenService);

    const result = await loginUser.execute({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(result.token).toBe('jwt-token');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(hashService.compare).toHaveBeenCalledWith(
      'password123',
      'hashed-password'
    );
    expect(tokenService.generate).toHaveBeenCalledWith({ userId: 'user-123' });
  });

  it('should throw InvalidCredentialsError if user not found', async () => {
    const { userRepository, hashService, tokenService } = createMocks();
    userRepository.findByEmail = mock(() => Promise.resolve(null));

    const loginUser = new LoginUser(userRepository, hashService, tokenService);

    await expect(
      loginUser.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should throw InvalidCredentialsError if password is wrong', async () => {
    const { userRepository, hashService, tokenService } = createMocks();
    hashService.compare = mock(() => Promise.resolve(false));

    const loginUser = new LoginUser(userRepository, hashService, tokenService);

    await expect(
      loginUser.execute({
        email: 'john@example.com',
        password: 'wrong-password',
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
