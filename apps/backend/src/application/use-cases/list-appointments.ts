import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AppointmentListOutput } from '../dtos/appointment-dtos.js';

export class ListAppointments {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(userId: string, date: string): Promise<AppointmentListOutput[]> {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const appointments = await this.appointmentRepository.findAllByUserIdAndDateRange(
      userId,
      startOfDay,
      endOfDay
    );

    const patientIds = [...new Set(appointments.map((a) => a.patientId))];
    const patients = await Promise.all(
      patientIds.map((id) => this.patientRepository.findById(id))
    );

    const patientMap = new Map(
      patients.filter(Boolean).map((p) => [p!.id, p!.name])
    );

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: patientMap.get(appointment.patientId) ?? 'Unknown',
      startAt: appointment.startAt.toISOString(),
      endAt: appointment.endAt.toISOString(),
      status: appointment.status,
    }));
  }
}
