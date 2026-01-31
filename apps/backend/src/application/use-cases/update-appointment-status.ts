import {
  AppointmentNotEditableError,
  AppointmentNotFoundError,
} from '../../domain/errors/domain-error.js';
import type { AppointmentStatus } from '../../domain/entities/appointment.js';
import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AppointmentOutput } from '../dtos/appointment-dtos.js';

export class UpdateAppointmentStatus {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    userId: string,
    appointmentId: string,
    status: AppointmentStatus
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

    const appointment = await this.appointmentRepository.updateStatus(
      appointmentId,
      status
    );

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
