import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { CreatePatientDto, PatientOutput } from '../dtos/patient-dtos.js';

export class CreatePatient {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(userId: string, input: CreatePatientDto): Promise<PatientOutput> {
    const patient = await this.patientRepository.create({
      userId,
      name: input.name,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    });

    return {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      notes: patient.notes,
    };
  }
}
