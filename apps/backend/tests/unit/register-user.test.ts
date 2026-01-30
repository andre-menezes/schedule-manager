import { describe, expect, it, mock } from 'bun:test';
import { RegisterUser } from '../../src/application/use-cases/register-user.js';
import { EmailAlreadyExistsError } from '../../src/domain/errors/domain-error.js';
import type { UserRepository } from '../../src/domain/repositories/user-repository.js';
import type { HashService } from '../../src/application/services/hash-service.js';
import type { TokenService } from '../../src/application/services/token-service.js';

describe('RegisterUser', () => {
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
      findByEmail: mock(() => Promise.resolve(null)),
      findById: mock(() => Promise.resolve(null)),
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

  it('should register a new user and return a token', async () => {
    const { userRepository, hashService, tokenService } = createMocks();
    const registerUser = new RegisterUser(userRepository, hashService, tokenService);

    const result = await registerUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(result.token).toBe('jwt-token');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(hashService.hash).toHaveBeenCalledWith('password123');
    expect(userRepository.create).toHaveBeenCalled();
    expect(tokenService.generate).toHaveBeenCalledWith({ userId: 'user-123' });
  });

  it('should throw EmailAlreadyExistsError if email is taken', async () => {
    const { userRepository, hashService, tokenService } = createMocks();
    userRepository.findByEmail = mock(() => Promise.resolve(mockUser));

    const registerUser = new RegisterUser(userRepository, hashService, tokenService);

    await expect(
      registerUser.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(EmailAlreadyExistsError);
  });
});
