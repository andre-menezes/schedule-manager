import { describe, expect, it, mock } from 'bun:test';
import { UpdateAppointmentStatus } from '../../src/application/use-cases/update-appointment-status.js';
import {
  AppointmentNotEditableError,
  AppointmentNotFoundError,
} from '../../src/domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../src/domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../src/domain/repositories/patient-repository.js';
import type { Appointment } from '../../src/domain/entities/appointment.js';
import type { Patient } from '../../src/domain/entities/patient.js';

describe('UpdateAppointmentStatus', () => {
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

  it('should mark appointment as REALIZADO', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const completedAppointment = {
      ...mockAppointment,
      status: 'REALIZADO' as const,
    };
    appointmentRepository.updateStatus = mock(() =>
      Promise.resolve(completedAppointment)
    );

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointmentStatus.execute(
      'user-123',
      'appointment-123',
      'REALIZADO'
    );

    expect(result.status).toBe('REALIZADO');
    expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(
      'appointment-123',
      'REALIZADO'
    );
  });

  it('should mark appointment as CANCELADO', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const canceledAppointment = {
      ...mockAppointment,
      status: 'CANCELADO' as const,
    };
    appointmentRepository.updateStatus = mock(() =>
      Promise.resolve(canceledAppointment)
    );

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointmentStatus.execute(
      'user-123',
      'appointment-123',
      'CANCELADO'
    );

    expect(result.status).toBe('CANCELADO');
    expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(
      'appointment-123',
      'CANCELADO'
    );
  });

  it('should throw AppointmentNotFoundError if appointment does not exist', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointmentStatus.execute('user-123', 'nonexistent', 'REALIZADO')
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('should throw AppointmentNotFoundError if appointment belongs to another user', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointmentStatus.execute('another-user', 'appointment-123', 'REALIZADO')
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('should throw AppointmentNotEditableError if appointment is already REALIZADO', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() =>
      Promise.resolve({ ...mockAppointment, status: 'REALIZADO' as const })
    );

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointmentStatus.execute('user-123', 'appointment-123', 'CANCELADO')
    ).rejects.toThrow(AppointmentNotEditableError);
  });

  it('should allow canceling AGENDADO appointment', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const canceledAppointment = {
      ...mockAppointment,
      status: 'CANCELADO' as const,
    };
    appointmentRepository.updateStatus = mock(() =>
      Promise.resolve(canceledAppointment)
    );

    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointmentStatus.execute(
      'user-123',
      'appointment-123',
      'CANCELADO'
    );

    expect(result.status).toBe('CANCELADO');
  });

  it('should include patient name in result', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointmentStatus.execute(
      'user-123',
      'appointment-123',
      'REALIZADO'
    );

    expect(result.patientName).toBe('Maria Santos');
    expect(patientRepository.findById).toHaveBeenCalledWith('patient-123');
  });

  it('should return ISO date strings', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updateAppointmentStatus = new UpdateAppointmentStatus(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointmentStatus.execute(
      'user-123',
      'appointment-123',
      'REALIZADO'
    );

    expect(result.startAt).toBe('2026-02-01T09:00:00.000Z');
    expect(result.endAt).toBe('2026-02-01T10:00:00.000Z');
  });
});
