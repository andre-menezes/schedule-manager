import type { PrismaClient } from '@prisma/client';
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../../domain/entities/appointment.js';
import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';

export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAppointmentInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data: {
        userId: data.userId,
        patientId: data.patientId,
        startAt: data.startAt,
        endAt: data.endAt,
        notes: data.notes ?? null,
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Appointment | null> {
    return this.prisma.appointment.findFirst({
      where: { id, userId },
    });
  }

  async findAllByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: {
        userId,
        startAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  async findConflicting(
    userId: string,
    startAt: Date,
    endAt: Date,
    excludeId?: string
  ): Promise<Appointment | null> {
    return this.prisma.appointment.findFirst({
      where: {
        userId,
        status: { not: 'CANCELADO' },
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          {
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
        ],
      },
    });
  }

  async update(id: string, data: UpdateAppointmentInput): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        startAt: data.startAt,
        endAt: data.endAt,
        notes: data.notes,
      },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
