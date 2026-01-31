import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { CreateAppointment } from './application/use-cases/create-appointment.js';
import { CreatePatient } from './application/use-cases/create-patient.js';
import { GetAppointment } from './application/use-cases/get-appointment.js';
import { GetPatient } from './application/use-cases/get-patient.js';
import { ListAppointments } from './application/use-cases/list-appointments.js';
import { ListPatients } from './application/use-cases/list-patients.js';
import { LoginUser } from './application/use-cases/login-user.js';
import { RegisterUser } from './application/use-cases/register-user.js';
import { UpdateAppointment } from './application/use-cases/update-appointment.js';
import { UpdateAppointmentStatus } from './application/use-cases/update-appointment-status.js';
import { UpdatePatient } from './application/use-cases/update-patient.js';
import { BunHashService } from './infrastructure/auth/bun-hash-service.js';
import { JwtTokenService } from './infrastructure/auth/jwt-token-service.js';
import { prisma } from './infrastructure/database/prisma-client.js';
import { PrismaAppointmentRepository } from './infrastructure/database/prisma-appointment-repository.js';
import { PrismaPatientRepository } from './infrastructure/database/prisma-patient-repository.js';
import { PrismaUserRepository } from './infrastructure/database/prisma-user-repository.js';
import { AppointmentController } from './presentation/controllers/appointment-controller.js';
import { AuthController } from './presentation/controllers/auth-controller.js';
import { PatientController } from './presentation/controllers/patient-controller.js';
import { appointmentRoutes } from './presentation/routes/appointment-routes.js';
import { authRoutes } from './presentation/routes/auth-routes.js';
import { patientRoutes } from './presentation/routes/patient-routes.js';

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
  const hashService = new BunHashService();
  const tokenService = new JwtTokenService(app);

  // Initialize use cases
  const registerUser = new RegisterUser(userRepository, hashService, tokenService);
  const loginUser = new LoginUser(userRepository, hashService, tokenService);
  const createPatient = new CreatePatient(patientRepository);
  const listPatients = new ListPatients(patientRepository);
  const getPatient = new GetPatient(patientRepository);
  const updatePatient = new UpdatePatient(patientRepository);
  const createAppointment = new CreateAppointment(appointmentRepository, patientRepository);
  const listAppointments = new ListAppointments(appointmentRepository, patientRepository);
  const getAppointment = new GetAppointment(appointmentRepository, patientRepository);
  const updateAppointment = new UpdateAppointment(appointmentRepository, patientRepository);
  const updateAppointmentStatus = new UpdateAppointmentStatus(appointmentRepository, patientRepository);

  // Initialize controllers
  const authController = new AuthController(registerUser, loginUser);
  const patientController = new PatientController(
    createPatient,
    listPatients,
    getPatient,
    updatePatient
  );
  const appointmentController = new AppointmentController(
    createAppointment,
    listAppointments,
    getAppointment,
    updateAppointment,
    updateAppointmentStatus
  );

  // Register routes with /api/v1 prefix
  app.register(
    async (instance) => {
      authRoutes(instance, authController);
      patientRoutes(instance, patientController);
      appointmentRoutes(instance, appointmentController);
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
