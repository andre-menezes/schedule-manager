import { describe, expect, it, mock } from 'bun:test';
import { GetAppointment } from '../../src/application/use-cases/get-appointment.js';
import { AppointmentNotFoundError } from '../../src/domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../src/domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../src/domain/repositories/patient-repository.js';
import type { Appointment } from '../../src/domain/entities/appointment.js';
import type { Patient } from '../../src/domain/entities/patient.js';

describe('GetAppointment', () => {
  const mockPatient: Patient = {
    id: 'patient-123',
    userId: 'user-123',
    name: 'Maria Santos',
    phone: '11999998888',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAppointment: Appointment = {
    id: 'appointment-123',
    userId: 'user-123',
    patientId: 'patient-123',
    startAt: new Date('2026-02-01T09:00:00.000Z'),
    endAt: new Date('2026-02-01T10:00:00.000Z'),
    status: 'AGENDADO',
    notes: 'Consulta de retorno',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createMocks = () => {
    const appointmentRepository: AppointmentRepository = {
      create: mock(() => Promise.resolve(mockAppointment)),
      findById: mock(() => Promise.resolve(mockAppointment)),
      findByIdAndUserId: mock(() => Promise.resolve(mockAppointment)),
      findAllByUserIdAndDateRange: mock(() => Promise.resolve([])),
      findConflicting: mock(() => Promise.resolve(null)),
      update: mock(() => Promise.resolve(mockAppointment)),
      updateStatus: mock(() => Promise.resolve(mockAppointment)),
    };

    const patientRepository: PatientRepository = {
      create: mock(() => Promise.resolve(mockPatient)),
      findById: mock(() => Promise.resolve(mockPatient)),
      findByIdAndUserId: mock(() => Promise.resolve(mockPatient)),
      findAllByUserId: mock(() => Promise.resolve([mockPatient])),
      update: mock(() => Promise.resolve(mockPatient)),
    };

    return { appointmentRepository, patientRepository };
  };

  it('should return appointment details', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const getAppointment = new GetAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await getAppointment.execute('user-123', 'appointment-123');

    expect(result.id).toBe('appointment-123');
    expect(result.patientId).toBe('patient-123');
    expect(result.patientName).toBe('Maria Santos');
    expect(result.status).toBe('AGENDADO');
    expect(result.notes).toBe('Consulta de retorno');
    expect(appointmentRepository.findByIdAndUserId).toHaveBeenCalledWith(
      'appointment-123',
      'user-123'
    );
  });

  it('should throw AppointmentNotFoundError if appointment does not exist', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const getAppointment = new GetAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      getAppointment.execute('user-123', 'nonexistent-appointment')
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('should throw AppointmentNotFoundError if appointment belongs to another user', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const getAppointment = new GetAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      getAppointment.execute('another-user', 'appointment-123')
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('should return appointment with null notes', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() =>
      Promise.resolve({ ...mockAppointment, notes: null })
    );

    const getAppointment = new GetAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await getAppointment.execute('user-123', 'appointment-123');

    expect(result.notes).toBeNull();
  });

  it('should handle appointment with REALIZADO status', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() =>
      Promise.resolve({ ...mockAppointment, status: 'REALIZADO' as const })
    );

    const getAppointment = new GetAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await getAppointment.execute('user-123', 'appointment-123');

    expect(result.status).toBe('REALIZADO');
  });
});
