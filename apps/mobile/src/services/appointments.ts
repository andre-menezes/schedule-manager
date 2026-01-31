import { api } from './api';

export type AppointmentStatus = 'AGENDADO' | 'REALIZADO' | 'CANCELADO';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes: string | null;
}

export interface AppointmentListItem {
  id: string;
  patientId: string;
  patientName: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
}

export interface CreateAppointmentInput {
  patientId: string;
  startAt: string;
  endAt: string;
  notes?: string | null;
}

export interface UpdateAppointmentInput {
  startAt?: string;
  endAt?: string;
  notes?: string | null;
}

export async function listAppointments(date: string): Promise<AppointmentListItem[]> {
  const response = await api.get<AppointmentListItem[]>('/appointments', {
    params: { date },
  });
  return response.data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const response = await api.post<Appointment>('/appointments', input);
  return response.data;
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const response = await api.put<Appointment>(`/appointments/${id}`, input);
  return response.data;
}

export async function updateAppointmentStatus(
  id: string,
  status: 'REALIZADO' | 'CANCELADO'
): Promise<Appointment> {
  const response = await api.patch<Appointment>(`/appointments/${id}/status`, {
    status,
  });
  return response.data;
}
