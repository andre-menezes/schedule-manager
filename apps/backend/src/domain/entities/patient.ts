export interface Patient {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientInput {
  userId: string;
  name: string;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdatePatientInput {
  name?: string;
  phone?: string | null;
  notes?: string | null;
}
