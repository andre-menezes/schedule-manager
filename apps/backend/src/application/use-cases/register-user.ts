import { EmailAlreadyExistsError } from '../../domain/errors/domain-error.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { AuthOutput, RegisterInput } from '../dtos/auth-dtos.js';
import type { HashService } from '../services/hash-service.js';
import type { TokenService } from '../services/token-service.js';

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: RegisterInput): Promise<AuthOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await this.hashService.hash(input.password);

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = this.tokenService.generate({ userId: user.id });

    return { token };
  }
}
