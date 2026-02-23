import {
  AppointmentConflictError,
  PastAppointmentError,
  PatientNotFoundError,
} from '../../domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AppointmentOutput, CreateAppointmentDto } from '../dtos/appointment-dtos.js';

export class CreateAppointment {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    userId: string,
    input: CreateAppointmentDto
  ): Promise<AppointmentOutput> {
    const patient = await this.patientRepository.findByIdAndUserId(
      input.patientId,
      userId
    );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    if (startAt < new Date()) {
      throw new PastAppointmentError();
    }

    const conflicting = await this.appointmentRepository.findConflicting(
      userId,
      startAt,
      endAt
    );

    if (conflicting) {
      throw new AppointmentConflictError();
    }

    const appointment = await this.appointmentRepository.create({
      userId,
      patientId: input.patientId,
      startAt,
      endAt,
      notes: input.notes ?? null,
    });

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: patient.name,
      startAt: appointment.startAt.toISOString(),
      endAt: appointment.endAt.toISOString(),
      status: appointment.status,
      notes: appointment.notes,
    };
  }
}
