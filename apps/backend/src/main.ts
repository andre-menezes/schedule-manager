import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
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
  const app = fastify({
    logger: true,
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['example'],
      },
    },
  });

  // Register CORS
  await app.register(fastifyCors, {
    origin: true,
  });

  // Register Swagger
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Scheduler API',
        description: 'API para sistema de agendamento de consultas',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Autenticação e registro de usuários' },
        { name: 'Health', description: 'Health check' },
      ],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

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
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Verifica se a API está funcionando',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
            },
          },
        },
      },
    },
    async () => ({ status: 'ok' })
  );

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
