import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ListUsers } from '../../application/use-cases/list-users.js';
import type { DeactivateUser } from '../../application/use-cases/deactivate-user.js';
import {
  AccessDeniedError,
  CannotDeactivateAdminError,
  DomainError,
  UserNotFoundError,
} from '../../domain/errors/domain-error.js';

interface AuthenticatedRequest extends FastifyRequest {
  user: { userId: string };
}

export class UserController {
  constructor(
    private readonly listUsers: ListUsers,
    private readonly deactivateUserUseCase: DeactivateUser,
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const result = await this.listUsers.execute(user.userId);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async deactivate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as { id: string };
      await this.deactivateUserUseCase.execute(user.userId, id);
      reply.status(204).send();
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  private handleError(error: unknown, reply: FastifyReply): void {
    if (error instanceof AccessDeniedError) {
      reply.status(403).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof CannotDeactivateAdminError) {
      reply.status(400).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof UserNotFoundError) {
      reply.status(404).send({
        error: error.code,
        message: error.message,
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
