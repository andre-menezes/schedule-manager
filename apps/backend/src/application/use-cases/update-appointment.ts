import {
  AppointmentConflictError,
  AppointmentNotEditableError,
  AppointmentNotFoundError,
  InvalidAppointmentTimeError,
} from '../../domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AppointmentOutput, UpdateAppointmentDto } from '../dtos/appointment-dtos.js';

export class UpdateAppointment {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    userId: string,
    appointmentId: string,
    input: UpdateAppointmentDto
  ): Promise<AppointmentOutput> {
    const existing = await this.appointmentRepository.findByIdAndUserId(
      appointmentId,
      userId
    );

    if (!existing) {
      throw new AppointmentNotFoundError();
    }

    if (existing.status === 'REALIZADO') {
      throw new AppointmentNotEditableError();
    }

    const startAt = input.startAt ? new Date(input.startAt) : existing.startAt;
    const endAt = input.endAt ? new Date(input.endAt) : existing.endAt;

    if (startAt >= endAt) {
      throw new InvalidAppointmentTimeError();
    }

    if (input.startAt || input.endAt) {
      const conflicting = await this.appointmentRepository.findConflicting(
        userId,
        startAt,
        endAt,
        appointmentId
      );

      if (conflicting) {
        throw new AppointmentConflictError();
      }
    }

    const appointment = await this.appointmentRepository.update(appointmentId, {
      startAt: input.startAt ? startAt : undefined,
      endAt: input.endAt ? endAt : undefined,
      notes: input.notes,
    });

    const patient = await this.patientRepository.findById(appointment.patientId);

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: patient?.name ?? 'Unknown',
      startAt: appointment.startAt.toISOString(),
      endAt: appointment.endAt.toISOString(),
      status: appointment.status,
      notes: appointment.notes,
    };
  }
}
