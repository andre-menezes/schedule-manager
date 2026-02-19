import {
  InvalidResetTokenError,
  ResetTokenExpiredError,
  UserNotFoundError,
} from '../../domain/errors/domain-error.js';
import type { PasswordResetRepository } from '../../domain/repositories/password-reset-repository.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { ResetPasswordInput, ResetPasswordOutput } from '../dtos/password-reset-dtos.js';
import type { HashService } from '../services/hash-service.js';

export class ResetPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly hashService: HashService
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Find the reset token
    const resetToken = await this.passwordResetRepository.findByToken(input.code);

    if (!resetToken || resetToken.userId !== user.id) {
      throw new InvalidResetTokenError();
    }

    if (resetToken.usedAt) {
      throw new InvalidResetTokenError();
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ResetTokenExpiredError();
    }

    // Hash the new password
    const passwordHash = await this.hashService.hash(input.newPassword);

    // Update the user's password
    await this.userRepository.updatePassword(user.id, passwordHash);

    // Mark the token as used
    await this.passwordResetRepository.markAsUsed(resetToken.id);

    return { message: 'Password reset successfully' };
  }
}
