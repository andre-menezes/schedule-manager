import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updatePatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CreatePatientDto = z.infer<typeof createPatientSchema>;
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>;

export interface PatientOutput {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
}

export interface PatientListOutput {
  id: string;
  name: string;
}
