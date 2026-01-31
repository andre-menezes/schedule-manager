import { create } from 'zustand';
import * as appointmentsService from '../services/appointments';
import type {
  AppointmentListItem,
  Appointment,
  CreateAppointmentInput,
} from '../services/appointments';

interface AppointmentsState {
  appointments: AppointmentListItem[];
  selectedAppointment: Appointment | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  setSelectedDate: (date: string) => void;
  fetchAppointments: (date?: string) => Promise<void>;
  fetchAppointment: (id: string) => Promise<void>;
  createAppointment: (input: CreateAppointmentInput) => Promise<Appointment>;
  markAsCompleted: (id: string) => Promise<void>;
  markAsCanceled: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedAppointment: () => void;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  selectedDate: getTodayDate(),
  isLoading: false,
  error: null,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  fetchAppointments: async (date?: string) => {
    const targetDate = date || get().selectedDate;
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentsService.listAppointments(targetDate);
      set({ appointments, isLoading: false, selectedDate: targetDate });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch appointments';
      set({ error: message, isLoading: false });
    }
  },

  fetchAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const appointment = await appointmentsService.getAppointment(id);
      set({ selectedAppointment: appointment, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch appointment';
      set({ error: message, isLoading: false });
    }
  },

  createAppointment: async (input: CreateAppointmentInput) => {
    set({ isLoading: true, error: null });
    try {
      const appointment = await appointmentsService.createAppointment(input);
      await get().fetchAppointments();
      set({ isLoading: false });
      return appointment;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create appointment';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  markAsCompleted: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentsService.updateAppointmentStatus(id, 'REALIZADO');
      await get().fetchAppointments();
      set({ isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update appointment';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  markAsCanceled: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentsService.updateAppointmentStatus(id, 'CANCELADO');
      await get().fetchAppointments();
      set({ isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to cancel appointment';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearSelectedAppointment: () => set({ selectedAppointment: null }),
}));
