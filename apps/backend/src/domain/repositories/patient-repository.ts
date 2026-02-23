import type {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from '../entities/patient.js';

export interface PatientRepository {
  create(data: CreatePatientInput): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Patient | null>;
  findAllByUserId(userId: string): Promise<Patient[]>;
  update(id: string, data: UpdatePatientInput): Promise<Patient>;
  delete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  countAppointments(id: string): Promise<number>;
}
