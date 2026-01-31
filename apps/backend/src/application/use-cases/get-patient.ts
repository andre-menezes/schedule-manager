import { PatientNotFoundError } from '../../domain/errors/domain-error.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { PatientOutput } from '../dtos/patient-dtos.js';

export class GetPatient {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(userId: string, patientId: string): Promise<PatientOutput> {
    const patient = await this.patientRepository.findByIdAndUserId(
      patientId,
      userId
    );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    return {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      notes: patient.notes,
    };
  }
}
