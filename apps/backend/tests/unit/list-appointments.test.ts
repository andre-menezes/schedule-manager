import { describe, expect, it, mock } from 'bun:test';
import { ListAppointments } from '../../src/application/use-cases/list-appointments.js';
import type { AppointmentRepository } from '../../src/domain/repositories/appointment-repository.js';
import type { PatientRepository } from '../../src/domain/repositories/patient-repository.js';
import type { Appointment } from '../../src/domain/entities/appointment.js';
import type { Patient } from '../../src/domain/entities/patient.js';

describe('ListAppointments', () => {
  const mockPatient1: Patient = {
    id: 'patient-123',
    userId: 'user-123',
    name: 'Maria Santos',
    phone: '11999998888',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPatient2: Patient = {
    id: 'patient-456',
    userId: 'user-123',
    name: 'João Silva',
    phone: '11999997777',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAppointments: Appointment[] = [
    {
      id: 'appointment-123',
      userId: 'user-123',
      patientId: 'patient-123',
      startAt: new Date('2026-02-01T09:00:00.000Z'),
      endAt: new Date('2026-02-01T10:00:00.000Z'),
      status: 'AGENDADO',
      notes: 'Consulta',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'appointment-456',
      userId: 'user-123',
      patientId: 'patient-456',
      startAt: new Date('2026-02-01T14:00:00.000Z'),
      endAt: new Date('2026-02-01T15:00:00.000Z'),
      status: 'AGENDADO',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const createMocks = () => {
    const appointmentRepository: AppointmentRepository = {
      create: mock(() => Promise.resolve(mockAppointments[0])),
      findById: mock(() => Promise.resolve(null)),
      findByIdAndUserId: mock(() => Promise.resolve(null)),
      findAllByUserIdAndDateRange: mock(() => Promise.resolve(mockAppointments)),
      findConflicting: mock(() => Promise.resolve(null)),
      update: mock(() => Promise.resolve(mockAppointments[0])),
      updateStatus: mock(() => Promise.resolve(mockAppointments[0])),
    };

    const patientRepository: PatientRepository = {
      create: mock(() => Promise.resolve(mockPatient1)),
      findById: mock((id: string) => {
        if (id === 'patient-123') return Promise.resolve(mockPatient1);
        if (id === 'patient-456') return Promise.resolve(mockPatient2);
        return Promise.resolve(null);
      }),
      findByIdAndUserId: mock(() => Promise.resolve(mockPatient1)),
      findAllByUserId: mock(() => Promise.resolve([mockPatient1, mockPatient2])),
      update: mock(() => Promise.resolve(mockPatient1)),
    };

    return { appointmentRepository, patientRepository };
  };

  it('should list appointments for a given date', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const listAppointments = new ListAppointments(
      appointmentRepository,
      patientRepository
    );

    const result = await listAppointments.execute('user-123', '2026-02-01');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('appointment-123');
    expect(result[0].patientName).toBe('Maria Santos');
    expect(result[1].id).toBe('appointment-456');
    expect(result[1].patientName).toBe('João Silva');
    expect(appointmentRepository.findAllByUserIdAndDateRange).toHaveBeenCalled();
  });

  it('should return empty array when no appointments exist', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    appointmentRepository.findAllByUserIdAndDateRange = mock(() =>
      Promise.resolve([])
    );

    const listAppointments = new ListAppointments(
      appointmentRepository,
      patientRepository
    );

    const result = await listAppointments.execute('user-123', '2026-02-15');

    expect(result).toHaveLength(0);
    expect(appointmentRepository.findAllByUserIdAndDateRange).toHaveBeenCalled();
  });

  it('should handle appointments with different statuses', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const mixedStatusAppointments: Appointment[] = [
      {
        ...mockAppointments[0],
        status: 'REALIZADO',
      },
      {
        ...mockAppointments[1],
        status: 'CANCELADO',
      },
    ];
    appointmentRepository.findAllByUserIdAndDateRange = mock(() =>
      Promise.resolve(mixedStatusAppointments)
    );

    const listAppointments = new ListAppointments(
      appointmentRepository,
      patientRepository
    );

    const result = await listAppointments.execute('user-123', '2026-02-01');

    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('REALIZADO');
    expect(result[1].status).toBe('CANCELADO');
  });

  it('should call repository with correct date range', async () => {
    const { appointmentRepository, patientRepository } = createMocks();
    const listAppointments = new ListAppointments(
      appointmentRepository,
      patientRepository
    );

    await listAppointments.execute('user-123', '2026-02-01');

    expect(appointmentRepository.findAllByUserIdAndDateRange).toHaveBeenCalledWith(
      'user-123',
      new Date('2026-02-01T00:00:00.000Z'),
      new Date('2026-02-01T23:59:59.999Z')
    );
  });
});
