import { InvalidCredentialsError } from '../../domain/errors/domain-error.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { AuthOutput, LoginInput } from '../dtos/auth-dtos.js';
import type { HashService } from '../services/hash-service.js';
import type { TokenService } from '../services/token-service.js';

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await this.hashService.compare(
      input.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.generate({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
