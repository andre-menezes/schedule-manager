import type { PrismaClient } from '@prisma/client';
import type {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from '../../domain/entities/patient.js';
import type { PatientRepository } from '../../domain/repositories/patient-repository.js';

export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePatientInput): Promise<Patient> {
    return this.prisma.patient.create({
      data: {
        userId: data.userId,
        name: data.name,
        phone: data.phone ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: { id, userId },
    });
  }

  async findAllByUserId(userId: string): Promise<Patient[]> {
    return this.prisma.patient.findMany({
      where: { userId },
      orderBy: [{ deactivatedAt: 'asc' }, { name: 'asc' }],
    });
  }

  async update(id: string, data: UpdatePatientInput): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        notes: data.notes,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.delete({
      where: { id },
    });
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: { deactivatedAt: new Date() },
    });
  }

  async countAppointments(id: string): Promise<number> {
    return this.prisma.appointment.count({
      where: { patientId: id },
    });
  }
}
