import type { FastifyInstance } from 'fastify';
import type { AuthController } from '../controllers/auth-controller.js';
import type { PasswordResetController } from '../controllers/password-reset-controller.js';

const userOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
    name: { type: 'string', example: 'João Silva' },
    email: { type: 'string', format: 'email', example: 'joao@example.com' },
  },
};

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
        user: userOutputSchema,
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
        user: userOutputSchema,
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

const forgotPasswordSchema = {
  tags: ['Auth'],
  summary: 'Solicitar recuperação de senha',
  description: 'Envia um código de recuperação para o e-mail informado',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
    },
  },
  response: {
    200: {
      description: 'Solicitação processada',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'If this email exists, a reset code will be sent' },
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
  },
};

const resetPasswordSchema = {
  tags: ['Auth'],
  summary: 'Redefinir senha',
  description: 'Redefine a senha usando o código de recuperação',
  body: {
    type: 'object',
    required: ['email', 'code', 'newPassword'],
    properties: {
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      code: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
      newPassword: { type: 'string', minLength: 6, example: 'novaSenha123' },
    },
  },
  response: {
    200: {
      description: 'Senha redefinida com sucesso',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successfully' },
      },
    },
    400: {
      description: 'Código inválido ou expirado',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'INVALID_RESET_TOKEN' },
        message: { type: 'string', example: 'Invalid reset token' },
      },
    },
  },
};

export function authRoutes(
  app: FastifyInstance,
  controller: AuthController,
  passwordResetController: PasswordResetController
): void {
  app.post('/auth/register', { schema: registerSchema }, (request, reply) =>
    controller.register(request, reply)
  );

  app.post('/auth/login', { schema: loginSchema }, (request, reply) =>
    controller.login(request, reply)
  );

  app.post('/auth/forgot-password', { schema: forgotPasswordSchema }, (request, reply) =>
    passwordResetController.forgotPassword(request, reply)
  );

  app.post('/auth/reset-password', { schema: resetPasswordSchema }, (request, reply) =>
    passwordResetController.resetPasswordHandler(request, reply)
  );
}
