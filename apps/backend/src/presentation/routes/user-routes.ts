import type { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../infrastructure/http/auth-middleware.js';
import type { UserController } from '../controllers/user-controller.js';

const userListOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
};

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

const securitySchema = [{ bearerAuth: [] }];

const listUsersSchema = {
  tags: ['System'],
  summary: 'List system members',
  description: 'Returns list of registered members (admin only)',
  security: securitySchema,
  response: {
    200: {
      description: 'List of members',
      type: 'array',
      items: userListOutputSchema,
    },
    401: {
      description: 'Not authenticated',
      ...errorSchema,
    },
    403: {
      description: 'Access denied',
      ...errorSchema,
    },
  },
};

export function userRoutes(
  app: FastifyInstance,
  controller: UserController
): void {
  app.addHook('preHandler', authMiddleware);

  // Hidden route - not obvious like /admin or /users
  app.get('/s/members', { schema: listUsersSchema }, (request, reply) =>
    controller.list(request, reply)
  );

  app.delete(
    '/s/members/:id',
    {
      schema: {
        tags: ['System'],
        summary: 'Deactivate a member',
        description: 'Soft-deletes a user account (admin only)',
        security: securitySchema,
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          204: { description: 'User deactivated', type: 'null' },
          400: { description: 'Bad request', ...errorSchema },
          401: { description: 'Not authenticated', ...errorSchema },
          403: { description: 'Access denied', ...errorSchema },
          404: { description: 'User not found', ...errorSchema },
        },
      },
    },
    (request, reply) => controller.deactivate(request, reply)
  );
}
