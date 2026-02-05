import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import type { AuditService } from '../services/audit-service.js';
import type { CreatePatientDto, PatientOutput } from '../dtos/patient-dtos.js';

export class CreatePatient {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditService: AuditService
  ) {}

  async execute(userId: string, input: CreatePatientDto): Promise<PatientOutput> {
    const patient = await this.patientRepository.create({
      userId,
      name: input.name,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entityType: 'PATIENT',
      entityId: patient.id,
      details: {
        patientName: patient.name,
        patientPhone: patient.phone,
        patientNotes: patient.notes,
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
