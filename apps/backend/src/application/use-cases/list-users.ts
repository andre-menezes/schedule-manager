import { AccessDeniedError } from '../../domain/errors/domain-error.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { UserOutput } from '../dtos/auth-dtos.js';

const ADMIN_EMAIL = 'dehhmenezes87@gmail.com';

export class ListUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(requesterId: string): Promise<UserOutput[]> {
    const requester = await this.userRepository.findById(requesterId);

    if (!requester || requester.email !== ADMIN_EMAIL) {
      throw new AccessDeniedError();
    }

    const users = await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      deactivatedAt: user.deactivatedAt?.toISOString() ?? null,
    }));
  }
}
