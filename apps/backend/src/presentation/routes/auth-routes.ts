import type { FastifyInstance } from 'fastify';
import type { AuthController } from '../controllers/auth-controller.js';

export function authRoutes(
  app: FastifyInstance,
  controller: AuthController
): void {
  app.post('/auth/register', (request, reply) =>
    controller.register(request, reply)
  );

  app.post('/auth/login', (request, reply) => controller.login(request, reply));
}
