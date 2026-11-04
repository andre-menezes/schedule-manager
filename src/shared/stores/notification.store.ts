import { defineStore } from 'pinia';
import type { Notification, NotificationInput, NotificationState } from '@typings/store';

/** Tempo padrão na tela: 5 s; erros ficam 8 s, para dar tempo de ler. */
export const NOTIFICATION_TIMEOUT_MS = 5_000;
export const ERROR_NOTIFICATION_TIMEOUT_MS = 8_000;

let nextId = 1;

/**
 * Fila de notificações do snackbar global (ADR-0040). As telas não usam a
 * store direto: notificam pelo `useNotify` (ou pelo helper de erro HTTP).
 */
export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    queue: [],
  }),

  getters: {
    current: (state): Notification | undefined => state.queue[0],
  },

  actions: {
    notify({ type, message, timeout }: NotificationInput): number {
      const id = nextId++;
      const fallback = type === 'error' ? ERROR_NOTIFICATION_TIMEOUT_MS : NOTIFICATION_TIMEOUT_MS;
      this.queue.push({ id, type, message, timeout: timeout ?? fallback });
      return id;
    },

    dismiss(id: number): void {
      this.queue = this.queue.filter((notification) => notification.id !== id);
    },
  },
});
