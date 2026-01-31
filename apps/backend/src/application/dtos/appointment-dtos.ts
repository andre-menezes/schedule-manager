import { z } from 'zod';
import type { AppointmentStatus } from '../../domain/entities/appointment.js';

export const createAppointmentSchema = z
  .object({
    patientId: z.string().uuid('Invalid patient ID'),
    startAt: z.string().datetime('Invalid start date format'),
    endAt: z.string().datetime('Invalid end date format'),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => new Date(data.startAt) < new Date(data.endAt),
    { message: 'Start time must be before end time', path: ['startAt'] }
  );

export const updateAppointmentSchema = z
  .object({
    startAt: z.string().datetime('Invalid start date format').optional(),
    endAt: z.string().datetime('Invalid end date format').optional(),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.startAt) < new Date(data.endAt);
      }
      return true;
    },
    { message: 'Start time must be before end time', path: ['startAt'] }
  );

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['REALIZADO', 'CANCELADO'], {
    message: 'Status must be REALIZADO or CANCELADO',
  }),
});

export const listAppointmentsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>;
export type UpdateAppointmentStatusDto = z.infer<typeof updateAppointmentStatusSchema>;
export type ListAppointmentsQueryDto = z.infer<typeof listAppointmentsQuerySchema>;

export interface AppointmentOutput {
  id: string;
  patientId: string;
  patientName: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes: string | null;
}

export interface AppointmentListOutput {
  id: string;
  patientId: string;
  patientName: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
}
