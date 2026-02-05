import type { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../infrastructure/http/auth-middleware.js';
import type { PatientController } from '../controllers/patient-controller.js';

const patientOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
    name: { type: 'string', example: 'Maria Santos' },
    phone: { type: 'string', nullable: true, example: '11999998888' },
    notes: { type: 'string', nullable: true, example: 'Paciente com alergia a dipirona' },
  },
};

const patientListOutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
    name: { type: 'string', example: 'Maria Santos' },
    phone: { type: 'string', nullable: true, example: '11999998888' },
    notes: { type: 'string', nullable: true, example: 'Paciente com alergia a dipirona' },
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

const createPatientSchema = {
  tags: ['Patients'],
  summary: 'Criar novo paciente',
  description: 'Cria um novo paciente vinculado ao usuário autenticado',
  security: securitySchema,
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'Maria Santos' },
      phone: { type: 'string', nullable: true, example: '11999998888' },
      notes: { type: 'string', nullable: true, example: 'Paciente com alergia a dipirona' },
    },
  },
  response: {
    201: {
      description: 'Paciente criado com sucesso',
      ...patientOutputSchema,
    },
    400: {
      description: 'Dados inválidos',
      ...errorSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
  },
};

const listPatientsSchema = {
  tags: ['Patients'],
  summary: 'Listar pacientes',
  description: 'Lista todos os pacientes do usuário autenticado',
  security: securitySchema,
  response: {
    200: {
      description: 'Lista de pacientes',
      type: 'array',
      items: patientListOutputSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
  },
};

const getPatientSchema = {
  tags: ['Patients'],
  summary: 'Buscar paciente por ID',
  description: 'Retorna os detalhes de um paciente específico',
  security: securitySchema,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  response: {
    200: {
      description: 'Detalhes do paciente',
      ...patientOutputSchema,
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Paciente não encontrado',
      ...errorSchema,
    },
  },
};

const updatePatientSchema = {
  tags: ['Patients'],
  summary: 'Atualizar paciente',
  description: 'Atualiza os dados de um paciente existente',
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
      name: { type: 'string', minLength: 2, example: 'Maria Santos Silva' },
      phone: { type: 'string', nullable: true, example: '11999997777' },
      notes: { type: 'string', nullable: true, example: 'Paciente com alergia a dipirona e penicilina' },
    },
  },
  response: {
    200: {
      description: 'Paciente atualizado com sucesso',
      ...patientOutputSchema,
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
  },
};

const deletePatientSchema = {
  tags: ['Patients'],
  summary: 'Excluir paciente',
  description: 'Exclui um paciente e todos os seus dados relacionados',
  security: securitySchema,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  response: {
    204: {
      description: 'Paciente excluído com sucesso',
      type: 'null',
    },
    401: {
      description: 'Não autenticado',
      ...errorSchema,
    },
    404: {
      description: 'Paciente não encontrado',
      ...errorSchema,
    },
  },
};

export function patientRoutes(
  app: FastifyInstance,
  controller: PatientController
): void {
  app.addHook('preHandler', authMiddleware);

  app.post('/patients', { schema: createPatientSchema }, (request, reply) =>
    controller.create(request, reply)
  );

  app.get('/patients', { schema: listPatientsSchema }, (request, reply) =>
    controller.list(request, reply)
  );

  app.get('/patients/:id', { schema: getPatientSchema }, (request, reply) =>
    controller.getById(request, reply)
  );

  app.put('/patients/:id', { schema: updatePatientSchema }, (request, reply) =>
    controller.update(request, reply)
  );

  app.delete('/patients/:id', { schema: deletePatientSchema }, (request, reply) =>
    controller.delete(request, reply)
  );
}
