import type { ThemeName } from '@typings/theme';

export interface AppState {
  theme: ThemeName;
}

/** Tom de uma notificação; define a cor e o ícone do snackbar. */
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

/** Uma notificação na fila do snackbar global. */
export interface Notification {
  id: number;
  type: NotificationType;
  /** Texto já traduzido. */
  message: string;
  /** Tempo na tela em ms; `-1` fica até ser fechada. */
  timeout: number;
}

/** O que quem notifica informa; `id` e `timeout` têm padrão. */
export type NotificationInput = Pick<Notification, 'type' | 'message'> &
  Partial<Pick<Notification, 'timeout'>>;

export interface NotificationState {
  /** Fila em ordem de chegada; o snackbar mostra a primeira. */
  queue: Notification[];
}
