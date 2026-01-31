import { AppointmentNotFoundError } from '../../domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AppointmentOutput } from '../dtos/appointment-dtos.js';

export class GetAppointment {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(userId: string, appointmentId: string): Promise<AppointmentOutput> {
    const appointment = await this.appointmentRepository.findByIdAndUserId(
      appointmentId,
      userId
    );

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

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
