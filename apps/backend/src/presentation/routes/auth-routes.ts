import type { FastifyInstance } from 'fastify';
import type { AuthController } from '../controllers/auth-controller.js';

const registerSchema = {
  tags: ['Auth'],
  summary: 'Registrar novo usuário',
  description: 'Cria uma nova conta de usuário e retorna um token JWT',
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'João Silva' },
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      password: { type: 'string', minLength: 6, example: 'senha123' },
    },
  },
  response: {
    201: {
      description: 'Usuário registrado com sucesso',
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
    400: {
      description: 'Dados inválidos',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string', example: 'Invalid email format' },
      },
    },
    409: {
      description: 'Email já cadastrado',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'EMAIL_ALREADY_EXISTS' },
        message: { type: 'string', example: 'Email already registered' },
      },
    },
  },
};

const loginSchema = {
  tags: ['Auth'],
  summary: 'Login de usuário',
  description: 'Autentica um usuário e retorna um token JWT',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      password: { type: 'string', minLength: 1, example: 'senha123' },
    },
  },
  response: {
    200: {
      description: 'Login realizado com sucesso',
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
    401: {
      description: 'Credenciais inválidas',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'INVALID_CREDENTIALS' },
        message: { type: 'string', example: 'Invalid email or password' },
      },
    },
  },
};

export function authRoutes(
  app: FastifyInstance,
  controller: AuthController
): void {
  app.post('/auth/register', { schema: registerSchema }, (request, reply) =>
    controller.register(request, reply)
  );

  app.post('/auth/login', { schema: loginSchema }, (request, reply) =>
    controller.login(request, reply)
  );
}
