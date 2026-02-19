import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { CreateAppointment } from './application/use-cases/create-appointment.js';
import { CreatePatient } from './application/use-cases/create-patient.js';
import { DeletePatient } from './application/use-cases/delete-patient.js';
import { GetAppointment } from './application/use-cases/get-appointment.js';
import { GetPatient } from './application/use-cases/get-patient.js';
import { ListAppointments } from './application/use-cases/list-appointments.js';
import { ListPatients } from './application/use-cases/list-patients.js';
import { ListUsers } from './application/use-cases/list-users.js';
import { LoginUser } from './application/use-cases/login-user.js';
import { RegisterUser } from './application/use-cases/register-user.js';
import { UpdateAppointment } from './application/use-cases/update-appointment.js';
import { UpdateAppointmentStatus } from './application/use-cases/update-appointment-status.js';
import { UpdatePatient } from './application/use-cases/update-patient.js';
import { RequestPasswordReset } from './application/use-cases/request-password-reset.js';
import { ResetPassword } from './application/use-cases/reset-password.js';
import { BunHashService } from './infrastructure/auth/bun-hash-service.js';
import { JwtTokenService } from './infrastructure/auth/jwt-token-service.js';
import { prisma } from './infrastructure/database/prisma-client.js';
import { PrismaAppointmentRepository } from './infrastructure/database/prisma-appointment-repository.js';
import { PrismaPatientRepository } from './infrastructure/database/prisma-patient-repository.js';
import { PrismaUserRepository } from './infrastructure/database/prisma-user-repository.js';
import { PrismaPasswordResetRepository } from './infrastructure/database/prisma-password-reset-repository.js';
import { PrismaAuditService } from './infrastructure/database/prisma-audit-service.js';
import { ResendEmailService } from './infrastructure/email/resend-email-service.js';
import { AppointmentController } from './presentation/controllers/appointment-controller.js';
import { AuthController } from './presentation/controllers/auth-controller.js';
import { PasswordResetController } from './presentation/controllers/password-reset-controller.js';
import { PatientController } from './presentation/controllers/patient-controller.js';
import { UserController } from './presentation/controllers/user-controller.js';
import { appointmentRoutes } from './presentation/routes/appointment-routes.js';
import { authRoutes } from './presentation/routes/auth-routes.js';
import { patientRoutes } from './presentation/routes/patient-routes.js';
import { userRoutes } from './presentation/routes/user-routes.js';

const PORT = Number(process.env['PORT'] ?? 3000);
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production';
const RESEND_API_KEY = process.env['RESEND_API_KEY'] ?? '';
const EMAIL_FROM = process.env['EMAIL_FROM'] ?? 'onboarding@resend.dev';

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
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
        { name: 'Patients', description: 'Gerenciamento de pacientes' },
        { name: 'Appointments', description: 'Gerenciamento de agendamentos' },
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
  const patientRepository = new PrismaPatientRepository(prisma);
  const appointmentRepository = new PrismaAppointmentRepository(prisma);
  const passwordResetRepository = new PrismaPasswordResetRepository(prisma);
  const hashService = new BunHashService();
  const tokenService = new JwtTokenService(app);
  const auditService = new PrismaAuditService(prisma);
  const emailService = new ResendEmailService(RESEND_API_KEY, EMAIL_FROM);

  // Initialize use cases
  const registerUser = new RegisterUser(userRepository, hashService, tokenService);
  const loginUser = new LoginUser(userRepository, hashService, tokenService);
  const requestPasswordReset = new RequestPasswordReset(userRepository, passwordResetRepository, emailService);
  const resetPassword = new ResetPassword(userRepository, passwordResetRepository, hashService);
  const listUsers = new ListUsers(userRepository);
  const createPatient = new CreatePatient(patientRepository, auditService);
  const listPatients = new ListPatients(patientRepository);
  const getPatient = new GetPatient(patientRepository);
  const updatePatient = new UpdatePatient(patientRepository, auditService);
  const deletePatient = new DeletePatient(patientRepository, auditService);
  const createAppointment = new CreateAppointment(appointmentRepository, patientRepository);
  const listAppointments = new ListAppointments(appointmentRepository, patientRepository);
  const getAppointment = new GetAppointment(appointmentRepository, patientRepository);
  const updateAppointment = new UpdateAppointment(appointmentRepository, patientRepository);
  const updateAppointmentStatus = new UpdateAppointmentStatus(appointmentRepository, patientRepository);

  // Initialize controllers
  const authController = new AuthController(registerUser, loginUser);
  const passwordResetController = new PasswordResetController(requestPasswordReset, resetPassword);
  const userController = new UserController(listUsers);
  const patientController = new PatientController(
    createPatient,
    listPatients,
    getPatient,
    updatePatient,
    deletePatient
  );
  const appointmentController = new AppointmentController(
    createAppointment,
    listAppointments,
    getAppointment,
    updateAppointment,
    updateAppointmentStatus
  );

  // Register public routes (no auth required)
  app.register(
    async (instance) => {
      authRoutes(instance, authController, passwordResetController);
    },
    { prefix: '/api/v1' }
  );

  // Register protected routes (auth required)
  app.register(
    async (instance) => {
      patientRoutes(instance, patientController);
      appointmentRoutes(instance, appointmentController);
      userRoutes(instance, userController);
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
