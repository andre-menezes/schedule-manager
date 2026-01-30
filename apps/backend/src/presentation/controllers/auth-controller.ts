import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { loginSchema, registerSchema } from '../../application/dtos/auth-dtos.js';
import type { LoginUser } from '../../application/use-cases/login-user.js';
import type { RegisterUser } from '../../application/use-cases/register-user.js';
import {
  DomainError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../../domain/errors/domain-error.js';

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser
  ) {}

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const input = registerSchema.parse(request.body);
      const result = await this.registerUser.execute(input);
      reply.status(201).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const input = loginSchema.parse(request.body);
      const result = await this.loginUser.execute(input);
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

    if (error instanceof EmailAlreadyExistsError) {
      reply.status(409).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof InvalidCredentialsError) {
      reply.status(401).send({
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
