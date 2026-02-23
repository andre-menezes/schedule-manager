import type { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../infrastructure/http/auth-middleware.js';
import type { AppointmentController } from '../controllers/appointment-controller.js';

const appointmentOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
    patientId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
    patientName: { type: 'string', example: 'Maria Santos' },
    startAt: { type: 'string', format: 'date-time', example: '2026-02-01T09:00:00.000Z' },
    endAt: { type: 'string', format: 'date-time', example: '2026-02-01T10:00:00.000Z' },
    status: { type: 'string', enum: ['AGENDADO', 'REALIZADO', 'CANCELADO'], example: 'AGENDADO' },
    notes: { type: 'string', nullable: true, example: 'Consulta de retorno' },
  },
};

const appointmentListOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
    patientId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
    patientName: { type: 'string', example: 'Maria Santos' },
    startAt: { type: 'string', format: 'date-time', example: '2026-02-01T09:00:00.000Z' },
    endAt: { type: 'string', format: 'date-time', example: '2026-02-01T10:00:00.000Z' },
    status: { type: 'string', enum: ['AGENDADO', 'REALIZADO', 'CANCELADO'], example: 'AGENDADO' },
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

const createAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Criar novo agendamento',
  description: 'Cria um novo agendamento para um paciente. Valida conflitos de horário.',
  security: securitySchema,
  body: {
    type: 'object',
    required: ['patientId', 'startAt', 'endAt'],
    properties: {
      patientId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
      startAt: { type: 'string', format: 'date-time', example: '2026-02-01T09:00:00.000Z' },
      endAt: { type: 'string', format: 'date-time', example: '2026-02-01T10:00:00.000Z' },
      notes: { type: 'string', nullable: true, example: 'Consulta de retorno' },
    },
  },
  response: {
    201: {
      description: 'Agendamento criado com sucesso',
      ...appointmentOutputSchema,
    },
    400: {
      description: 'Dados inválidos',
      ...errorSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Paciente não encontrado',
      ...errorSchema,
    },
    409: {
      description: 'Conflito de horário',
      ...errorSchema,
    },
  },
};

const listAppointmentsSchema = {
  tags: ['Appointments'],
  summary: 'Listar agendamentos por data',
  description: 'Lista todos os agendamentos do usuário para uma data específica',
  security: securitySchema,
  querystring: {
    type: 'object',
    required: ['date'],
    properties: {
      date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', example: '2026-02-01' },
    },
  },
  response: {
    200: {
      description: 'Lista de agendamentos',
      type: 'array',
      items: appointmentListOutputSchema,
    },
    400: {
      description: 'Data inválida',
      ...errorSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
  },
};

const getAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Buscar agendamento por ID',
  description: 'Retorna os detalhes de um agendamento específico',
  security: securitySchema,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  response: {
    200: {
      description: 'Detalhes do agendamento',
      ...appointmentOutputSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Agendamento não encontrado',
      ...errorSchema,
    },
  },
};

const updateAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Atualizar agendamento',
  description: 'Atualiza os dados de um agendamento. Não permite editar agendamentos realizados.',
  security: securitySchema,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    properties: {
      startAt: { type: 'string', format: 'date-time', example: '2026-02-01T10:00:00.000Z' },
      endAt: { type: 'string', format: 'date-time', example: '2026-02-01T11:00:00.000Z' },
      notes: { type: 'string', nullable: true, example: 'Remarcado pelo paciente' },
    },
  },
  response: {
    200: {
      description: 'Agendamento atualizado com sucesso',
      ...appointmentOutputSchema,
    },
    400: {
      description: 'Dados inválidos ou agendamento não editável',
      ...errorSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Agendamento não encontrado',
      ...errorSchema,
    },
    409: {
      description: 'Conflito de horário',
      ...errorSchema,
    },
  },
};

const updateAppointmentStatusSchema = {
  tags: ['Appointments'],
  summary: 'Atualizar status do agendamento',
  description: 'Marca o agendamento como realizado ou cancelado',
  security: securitySchema,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['REALIZADO', 'CANCELADO'],
        example: 'REALIZADO',
      },
    },
  },
  response: {
    200: {
      description: 'Status atualizado com sucesso',
      ...appointmentOutputSchema,
    },
    400: {
      description: 'Status inválido ou agendamento não editável',
      ...errorSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Agendamento não encontrado',
      ...errorSchema,
    },
  },
};

export function appointmentRoutes(
  app: FastifyInstance,
  controller: AppointmentController
): void {
  app.addHook('preHandler', authMiddleware);

  app.post('/appointments', { schema: createAppointmentSchema }, (request, reply) =>
    controller.create(request, reply)
  );

  app.get('/appointments', { schema: listAppointmentsSchema }, (request, reply) =>
    controller.list(request, reply)
  );

  app.get('/appointments/dates', {
    schema: {
      tags: ['Appointments'],
      summary: 'Listar datas com agendamentos',
      description: 'Retorna as datas que possuem agendamentos em um determinado mês',
      security: securitySchema,
      querystring: {
        type: 'object',
        required: ['month'],
        properties: {
          month: { type: 'string', pattern: '^\\d{4}-\\d{2}$', example: '2026-02' },
        },
      },
      response: {
        200: {
          description: 'Lista de datas com agendamentos',
          type: 'array',
          items: { type: 'string', example: '2026-02-01' },
        },
        400: {
          description: 'Mês inválido',
          ...errorSchema,
        },
        401: {
          description: 'Não autenticado',
          ...errorSchema,
        },
      },
    },
  }, (request, reply) => controller.listDates(request, reply));

  app.get('/appointments/:id', { schema: getAppointmentSchema }, (request, reply) =>
    controller.getById(request, reply)
  );

  app.put('/appointments/:id', { schema: updateAppointmentSchema }, (request, reply) =>
    controller.update(request, reply)
  );

  app.patch('/appointments/:id/status', { schema: updateAppointmentStatusSchema }, (request, reply) =>
    controller.updateStatus(request, reply)
  );
}
