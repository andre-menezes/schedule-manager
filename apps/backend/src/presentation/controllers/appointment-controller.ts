import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import {
  appointmentDatesQuerySchema,
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../../application/dtos/appointment-dtos.js';
import type { CreateAppointment } from '../../application/use-cases/create-appointment.js';
import type { GetAppointmentDates } from '../../application/use-cases/get-appointment-dates.js';
import type { GetAppointment } from '../../application/use-cases/get-appointment.js';
import type { ListAppointments } from '../../application/use-cases/list-appointments.js';
import type { UpdateAppointment } from '../../application/use-cases/update-appointment.js';
import type { UpdateAppointmentStatus } from '../../application/use-cases/update-appointment-status.js';
import type { AppointmentStatus } from '../../domain/entities/appointment.js';
import {
  AppointmentConflictError,
  AppointmentNotEditableError,
  AppointmentNotFoundError,
  DomainError,
  InvalidAppointmentTimeError,
  PatientNotFoundError,
} from '../../domain/errors/domain-error.js';

interface AuthenticatedRequest extends FastifyRequest {
  user: { userId: string };
}

interface AppointmentParams {
  id: string;
}

export class AppointmentController {
  constructor(
    private readonly createAppointment: CreateAppointment,
    private readonly listAppointments: ListAppointments,
    private readonly getAppointment: GetAppointment,
    private readonly updateAppointment: UpdateAppointment,
    private readonly updateAppointmentStatus: UpdateAppointmentStatus,
    private readonly getAppointmentDates: GetAppointmentDates
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const input = createAppointmentSchema.parse(request.body);
      const result = await this.createAppointment.execute(user.userId, input);
      reply.status(201).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { date } = listAppointmentsQuerySchema.parse(request.query);
      const result = await this.listAppointments.execute(user.userId, date);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as AppointmentParams;
      const result = await this.getAppointment.execute(user.userId, id);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as AppointmentParams;
      const input = updateAppointmentSchema.parse(request.body);
      const result = await this.updateAppointment.execute(user.userId, id, input);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async listDates(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { month } = appointmentDatesQuerySchema.parse(request.query);
      const result = await this.getAppointmentDates.execute(user.userId, month);
      reply.status(200).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { user } = request as AuthenticatedRequest;
      const { id } = request.params as AppointmentParams;
      const { status } = updateAppointmentStatusSchema.parse(request.body);
      const result = await this.updateAppointmentStatus.execute(
        user.userId,
        id,
        status as AppointmentStatus
      );
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

    if (error instanceof AppointmentNotFoundError) {
      reply.status(404).send({
        error: error.code,
        message: error.message,
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

    if (error instanceof AppointmentConflictError) {
      reply.status(409).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof InvalidAppointmentTimeError ||
      error instanceof AppointmentNotEditableError
    ) {
      reply.status(400).send({
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
