import type { FastifyReply, FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import type { RequestPasswordReset } from '../../application/use-cases/request-password-reset.js';
import type { ResetPassword } from '../../application/use-cases/reset-password.js';
import {
  DomainError,
  InvalidResetTokenError,
  ResetTokenExpiredError,
  UserNotFoundError,
} from '../../domain/errors/domain-error.js';

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});

export class PasswordResetController {
  constructor(
    private readonly requestPasswordReset: RequestPasswordReset,
    private readonly resetPassword: ResetPassword
  ) {}

  async forgotPassword(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const input = requestPasswordResetSchema.parse(request.body);
      const result = await this.requestPasswordReset.execute(input);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async resetPasswordHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const input = resetPasswordSchema.parse(request.body);
      const result = await this.resetPassword.execute(input);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  private handleError(error: unknown, reply: FastifyReply): void {
    if (error instanceof ZodError) {
      reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: error.issues[0]?.message ?? 'Invalid input',
      });
      return;
    }

    if (error instanceof InvalidResetTokenError || error instanceof ResetTokenExpiredError) {
      reply.status(400).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof UserNotFoundError) {
      // Return generic message to prevent email enumeration
      reply.status(400).send({
        error: 'INVALID_RESET_TOKEN',
        message: 'Invalid reset token',
      });
      return;
    }

    if (error instanceof DomainError) {
      reply.status(400).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    console.error('Unexpected error:', error);
    reply.status(500).send({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}
