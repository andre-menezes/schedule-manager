import { create } from 'zustand';
import * as patientsService from '../services/patients';
import type {
  Patient,
  PatientListItem,
  CreatePatientInput,
  UpdatePatientInput,
} from '../services/patients';

interface PatientsState {
  patients: PatientListItem[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  fetchPatient: (id: string) => Promise<void>;
  createPatient: (input: CreatePatientInput) => Promise<Patient>;
  updatePatient: (id: string, input: UpdatePatientInput) => Promise<Patient>;
  clearError: () => void;
  clearSelectedPatient: () => void;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const patients = await patientsService.listPatients();
      set({ patients, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch patients';
      set({ error: message, isLoading: false });
    }
  },

  fetchPatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientsService.getPatient(id);
      set({ selectedPatient: patient, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch patient';
      set({ error: message, isLoading: false });
    }
  },

  createPatient: async (input: CreatePatientInput) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientsService.createPatient(input);
      await get().fetchPatients();
      set({ isLoading: false });
      return patient;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create patient';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updatePatient: async (id: string, input: UpdatePatientInput) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientsService.updatePatient(id, input);
      await get().fetchPatients();
      set({ selectedPatient: patient, isLoading: false });
      return patient;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update patient';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearSelectedPatient: () => set({ selectedPatient: null }),
}));
