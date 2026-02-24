import { randomInt } from 'crypto';
import type { PasswordResetRepository } from '../../domain/repositories/password-reset-repository.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { RequestPasswordResetInput, RequestPasswordResetOutput } from '../dtos/password-reset-dtos.js';
import type { EmailService } from '../services/email-service.js';

export class RequestPasswordReset {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(input: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    // Always return success message to prevent email enumeration
    if (!user) {
      return { message: 'If this email exists, a reset code will be sent' };
    }

    // Delete any existing reset tokens for this user
    await this.passwordResetRepository.deleteByUserId(user.id);

    // Generate 6-digit code using cryptographically secure random
    const code = randomInt(100000, 1000000).toString();

    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetRepository.create({
      userId: user.id,
      token: code,
      expiresAt,
    });

    try {
      await this.emailService.sendPasswordResetEmail({
        to: user.email,
        code,
      });
    } catch (error) {
      console.error('[RequestPasswordReset] Failed to send reset email:', error);
    }

    return { message: 'If this email exists, a reset code will be sent' };
  }
}
