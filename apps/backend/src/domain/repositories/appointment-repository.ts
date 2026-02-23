import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../entities/appointment.js';

export interface AppointmentRepository {
  create(data: CreateAppointmentInput): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Appointment | null>;
  findAllByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]>;
  findConflicting(
    userId: string,
    startAt: Date,
    endAt: Date,
    excludeId?: string
  ): Promise<Appointment | null>;
  update(id: string, data: UpdateAppointmentInput): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
}
