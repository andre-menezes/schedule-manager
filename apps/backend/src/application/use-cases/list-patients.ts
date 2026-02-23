import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { PatientListOutput } from '../dtos/patient-dtos.js';

export class ListPatients {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(userId: string): Promise<PatientListOutput[]> {
    const patients = await this.patientRepository.findAllByUserId(userId);

    return patients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      notes: patient.notes,
      isActive: !patient.deactivatedAt,
    }));
  }
}
