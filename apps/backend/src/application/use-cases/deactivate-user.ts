import {
  AccessDeniedError,
  CannotDeactivateAdminError,
  UserNotFoundError,
} from '../../domain/errors/domain-error.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';

const ADMIN_EMAIL = 'andre_menezes@outlook.com';

export class DeactivateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(requesterId: string, targetUserId: string): Promise<void> {
    const requester = await this.userRepository.findById(requesterId);

    if (!requester || requester.email !== ADMIN_EMAIL) {
      throw new AccessDeniedError();
    }

    if (requesterId === targetUserId) {
      throw new CannotDeactivateAdminError();
    }

    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new UserNotFoundError();
    }

    await this.userRepository.deactivate(targetUserId);
  }
}
