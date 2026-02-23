import type { PatientRepository } from '../../domain/repositories/patient-repository.js';
import { PatientNotFoundError } from '../../domain/errors/domain-error.js';
import type { AuditService } from '../services/audit-service.js';

export type DeletePatientResult = { action: 'deleted' | 'deactivated' };

export class DeletePatient {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly auditService: AuditService
  ) {}

  async execute(userId: string, patientId: string): Promise<DeletePatientResult> {
    const patient = await this.patientRepository.findByIdAndUserId(
      patientId,
      userId
    );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    const appointmentCount = await this.patientRepository.countAppointments(patientId);

    if (appointmentCount > 0) {
      await this.patientRepository.deactivate(patientId);
      await this.auditService.log({
        userId,
        action: 'UPDATE',
        entityType: 'PATIENT',
        entityId: patientId,
        details: { patientName: patient.name },
      });
      return { action: 'deactivated' };
    }

    await this.patientRepository.delete(patientId);
    await this.auditService.log({
      userId,
      action: 'DELETE',
      entityType: 'PATIENT',
      entityId: patientId,
      details: {
        patientName: patient.name,
        patientPhone: patient.phone,
        patientNotes: patient.notes,
      },
    });
    return { action: 'deleted' };
  }
}
