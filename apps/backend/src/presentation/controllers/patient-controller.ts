import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import {
  createPatientSchema,
  updatePatientSchema,
} from '../../application/dtos/patient-dtos.js';
import type { CreatePatient } from '../../application/use-cases/create-patient.js';
import type { GetPatient } from '../../application/use-cases/get-patient.js';
import type { ListPatients } from '../../application/use-cases/list-patients.js';
import type { UpdatePatient } from '../../application/use-cases/update-patient.js';
import {
  DomainError,
  PatientNotFoundError,
} from '../../domain/errors/domain-error.js';

interface AuthenticatedRequest extends FastifyRequest {
  user: { id: string };
}

interface PatientParams {
  id: string;
}

export class PatientController {
  constructor(
    private readonly createPatient: CreatePatient,
    private readonly listPatients: ListPatients,
    private readonly getPatient: GetPatient,
    private readonly updatePatient: UpdatePatient
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const input = createPatientSchema.parse(request.body);
      const result = await this.createPatient.execute(user.id, input);
      reply.status(201).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const result = await this.listPatients.execute(user.id);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as PatientParams;
      const result = await this.getPatient.execute(user.id, id);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as PatientParams;
      const input = updatePatientSchema.parse(request.body);
      const result = await this.updatePatient.execute(user.id, id, input);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  private handleError(error: unknown, reply: FastifyReply): void {
    if (error instanceof ZodError) {
      reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: error.issues[0]?.message ?? 'Invalid input',
      });
      return;
    }

    if (error instanceof PatientNotFoundError) {
      reply.status(404).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof DomainError) {
      reply.status(400).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    console.error('Unexpected error:', error);
    reply.status(500).send({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}
