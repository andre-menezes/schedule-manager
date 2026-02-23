export type AppointmentStatus = 'AGENDADO' | 'REALIZADO' | 'CANCELADO';

export interface Appointment {
  id: string;
  userId: string;
  patientId: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentInput {
  userId: string;
  patientId: string;
  startAt: Date;
  endAt: Date;
  notes?: string | null;
}

export interface UpdateAppointmentInput {
  startAt?: Date;
  endAt?: Date;
  notes?: string | null;
}
