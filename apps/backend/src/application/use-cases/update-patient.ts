import { PatientNotFoundError } from '../../domain/errors/domain-error.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AuditService } from '../services/audit-service.js';
import type { PatientOutput, UpdatePatientDto } from '../dtos/patient-dtos.js';

export class UpdatePatient {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditService: AuditService
  ) {}

  async execute(
    userId: string,
    patientId: string,
    input: UpdatePatientDto
  ): Promise<PatientOutput> {
    const existingPatient = await this.patientRepository.findByIdAndUserId(
      patientId,
      userId
    );

    if (!existingPatient) {
      throw new PatientNotFoundError();
    }

    const patient = await this.patientRepository.update(patientId, {
      name: input.name,
      phone: input.phone,
      notes: input.notes,
    });

    await this.auditService.log({
      userId,
      action: 'UPDATE',
      entityType: 'PATIENT',
      entityId: patient.id,
      details: {
        previousPhone: existingPatient.phone,
        previousNotes: existingPatient.notes,
        newPhone: patient.phone,
        newNotes: patient.notes,
      },
    });

    return {
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      notes: patient.notes,
    };
  }
}
