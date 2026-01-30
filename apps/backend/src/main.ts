import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { LoginUser } from './application/use-cases/login-user.js';
import { RegisterUser } from './application/use-cases/register-user.js';
import { BunHashService } from './infrastructure/auth/bun-hash-service.js';
import { JwtTokenService } from './infrastructure/auth/jwt-token-service.js';
import { prisma } from './infrastructure/database/prisma-client.js';
import { PrismaUserRepository } from './infrastructure/database/prisma-user-repository.js';
import { AuthController } from './presentation/controllers/auth-controller.js';
import { authRoutes } from './presentation/routes/auth-routes.js';

const PORT = Number(process.env['PORT'] ?? 3000);
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production';

async function bootstrap(): Promise<void> {
  const app = fastify({ logger: true });

  // Register JWT plugin
  await app.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: { expiresIn: '7d' },
  });

  // Initialize dependencies
  const userRepository = new PrismaUserRepository(prisma);
  const hashService = new BunHashService();
  const tokenService = new JwtTokenService(app);

  // Initialize use cases
  const registerUser = new RegisterUser(userRepository, hashService, tokenService);
  const loginUser = new LoginUser(userRepository, hashService, tokenService);

  // Initialize controllers
  const authController = new AuthController(registerUser, loginUser);

  // Register routes with /api/v1 prefix
  app.register(
    async (instance) => {
      authRoutes(instance, authController);
    },
    { prefix: '/api/v1' }
  );

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  // Start server
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
