import { describe, expect, it, mock } from 'bun:test';
import { UpdateAppointment } from '../../src/application/use-cases/update-appointment.js';
import {
  AppointmentConflictError,
  AppointmentNotEditableError,
  AppointmentNotFoundError,
  InvalidAppointmentTimeError,
} from '../../src/domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../src/domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../src/domain/repositories/patient-repository.js';
import type { Appointment } from '../../src/domain/entities/appointment.js';
import type { Patient } from '../../src/domain/entities/patient.js';

describe('UpdateAppointment', () => {
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

  it('should update appointment time successfully', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updatedAppointment = {
      ...mockAppointment,
      startAt: new Date('2026-02-01T14:00:00.000Z'),
      endAt: new Date('2026-02-01T15:00:00.000Z'),
    };
    appointmentRepository.update = mock(() => Promise.resolve(updatedAppointment));

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointment.execute('user-123', 'appointment-123', {
      startAt: '2026-02-01T14:00:00.000Z',
      endAt: '2026-02-01T15:00:00.000Z',
    });

    expect(result.startAt).toBe('2026-02-01T14:00:00.000Z');
    expect(result.endAt).toBe('2026-02-01T15:00:00.000Z');
    expect(appointmentRepository.findConflicting).toHaveBeenCalled();
    expect(appointmentRepository.update).toHaveBeenCalled();
  });

  it('should update appointment notes only', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updatedAppointment = {
      ...mockAppointment,
      notes: 'Updated notes',
    };
    appointmentRepository.update = mock(() => Promise.resolve(updatedAppointment));

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointment.execute('user-123', 'appointment-123', {
      notes: 'Updated notes',
    });

    expect(result.notes).toBe('Updated notes');
    expect(appointmentRepository.update).toHaveBeenCalled();
  });

  it('should throw AppointmentNotFoundError if appointment does not exist', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointment.execute('user-123', 'nonexistent', {
        notes: 'New notes',
      })
    ).rejects.toThrow(AppointmentNotFoundError);
  });

  it('should throw AppointmentNotEditableError if appointment is REALIZADO', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findByIdAndUserId = mock(() =>
      Promise.resolve({ ...mockAppointment, status: 'REALIZADO' as const })
    );

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointment.execute('user-123', 'appointment-123', {
        notes: 'Cannot update',
      })
    ).rejects.toThrow(AppointmentNotEditableError);
  });

  it('should allow updating CANCELADO appointment', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const canceledAppointment = {
      ...mockAppointment,
      status: 'CANCELADO' as const,
    };
    appointmentRepository.findByIdAndUserId = mock(() =>
      Promise.resolve(canceledAppointment)
    );
    appointmentRepository.update = mock(() => Promise.resolve(canceledAppointment));

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await updateAppointment.execute('user-123', 'appointment-123', {
      notes: 'Updated canceled',
    });

    expect(result.status).toBe('CANCELADO');
  });

  it('should throw InvalidAppointmentTimeError if start >= end', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointment.execute('user-123', 'appointment-123', {
        startAt: '2026-02-01T15:00:00.000Z',
        endAt: '2026-02-01T14:00:00.000Z',
      })
    ).rejects.toThrow(InvalidAppointmentTimeError);
  });

  it('should throw InvalidAppointmentTimeError if start equals end', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointment.execute('user-123', 'appointment-123', {
        startAt: '2026-02-01T14:00:00.000Z',
        endAt: '2026-02-01T14:00:00.000Z',
      })
    ).rejects.toThrow(InvalidAppointmentTimeError);
  });

  it('should throw AppointmentConflictError if new time overlaps', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const conflictingAppointment = {
      ...mockAppointment,
      id: 'other-appointment',
    };
    appointmentRepository.findConflicting = mock(() =>
      Promise.resolve(conflictingAppointment)
    );

    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      updateAppointment.execute('user-123', 'appointment-123', {
        startAt: '2026-02-01T14:00:00.000Z',
        endAt: '2026-02-01T15:00:00.000Z',
      })
    ).rejects.toThrow(AppointmentConflictError);
  });

  it('should check conflicts excluding current appointment', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const updateAppointment = new UpdateAppointment(
      appointmentRepository,
      patientRepository
    );

    await updateAppointment.execute('user-123', 'appointment-123', {
      startAt: '2026-02-01T14:00:00.000Z',
      endAt: '2026-02-01T15:00:00.000Z',
    });

    expect(appointmentRepository.findConflicting).toHaveBeenCalledWith(
      'user-123',
      expect.any(Date),
      expect.any(Date),
      'appointment-123'
    );
  });
});
