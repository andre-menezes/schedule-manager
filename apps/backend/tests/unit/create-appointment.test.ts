import { describe, expect, it, mock } from 'bun:test';
import { CreateAppointment } from '../../src/application/use-cases/create-appointment.js';
import {
  AppointmentConflictError,
  PatientNotFoundError,
} from '../../src/domain/errors/domain-error.js';
import type { AppointmentRepository } from '../../src/domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../src/domain/repositories/patient-repository.js';
import type { Appointment } from '../../src/domain/entities/appointment.js';
import type { Patient } from '../../src/domain/entities/patient.js';

describe('CreateAppointment', () => {
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
      findById: mock(() => Promise.resolve(null)),
      findByIdAndUserId: mock(() => Promise.resolve(null)),
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

  it('should create an appointment successfully', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const createAppointment = new CreateAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await createAppointment.execute('user-123', {
      patientId: 'patient-123',
      startAt: '2026-02-01T09:00:00.000Z',
      endAt: '2026-02-01T10:00:00.000Z',
      notes: 'Consulta de retorno',
    });

    expect(result.id).toBe('appointment-123');
    expect(result.patientId).toBe('patient-123');
    expect(result.patientName).toBe('Maria Santos');
    expect(result.status).toBe('AGENDADO');
    expect(patientRepository.findByIdAndUserId).toHaveBeenCalledWith(
      'patient-123',
      'user-123'
    );
    expect(appointmentRepository.findConflicting).toHaveBeenCalled();
    expect(appointmentRepository.create).toHaveBeenCalled();
  });

  it('should throw PatientNotFoundError if patient does not exist', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    patientRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const createAppointment = new CreateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      createAppointment.execute('user-123', {
        patientId: 'nonexistent-patient',
        startAt: '2026-02-01T09:00:00.000Z',
        endAt: '2026-02-01T10:00:00.000Z',
      })
    ).rejects.toThrow(PatientNotFoundError);
  });

  it('should throw PatientNotFoundError if patient belongs to another user', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    patientRepository.findByIdAndUserId = mock(() => Promise.resolve(null));

    const createAppointment = new CreateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      createAppointment.execute('another-user', {
        patientId: 'patient-123',
        startAt: '2026-02-01T09:00:00.000Z',
        endAt: '2026-02-01T10:00:00.000Z',
      })
    ).rejects.toThrow(PatientNotFoundError);
  });

  it('should throw AppointmentConflictError if time slot overlaps', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findConflicting = mock(() =>
      Promise.resolve(mockAppointment)
    );

    const createAppointment = new CreateAppointment(
      appointmentRepository,
      patientRepository
    );

    await expect(
      createAppointment.execute('user-123', {
        patientId: 'patient-123',
        startAt: '2026-02-01T09:30:00.000Z',
        endAt: '2026-02-01T10:30:00.000Z',
      })
    ).rejects.toThrow(AppointmentConflictError);
  });

  it('should create appointment without notes', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const createAppointment = new CreateAppointment(
      appointmentRepository,
      patientRepository
    );

    const result = await createAppointment.execute('user-123', {
      patientId: 'patient-123',
      startAt: '2026-02-01T09:00:00.000Z',
      endAt: '2026-02-01T10:00:00.000Z',
    });

    expect(result.id).toBe('appointment-123');
    expect(appointmentRepository.create).toHaveBeenCalled();
  });
});
