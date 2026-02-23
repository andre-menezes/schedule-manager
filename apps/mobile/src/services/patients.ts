import { api } from './api';

export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
}

export interface PatientListItem {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
}

export interface CreatePatientInput {
  name: string;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdatePatientInput {
  name?: string;
  phone?: string | null;
  notes?: string | null;
}

export async function listPatients(): Promise<PatientListItem[]> {
  const response = await api.get<PatientListItem[]>('/patients');
  return response.data;
}

export async function getPatient(id: string): Promise<Patient> {
  const response = await api.get<Patient>(`/patients/${id}`);
  return response.data;
}

export async function createPatient(
  input: CreatePatientInput
): Promise<Patient> {
  const response = await api.post<Patient>('/patients', input);
  return response.data;
}

export async function updatePatient(
  id: string,
  input: UpdatePatientInput
): Promise<Patient> {
  const response = await api.put<Patient>(`/patients/${id}`, input);
  return response.data;
}

export async function deletePatient(id: string): Promise<{ action: string }> {
  const response = await api.delete<{ action: string }>(`/patients/${id}`);
  return response.data;
}
