import { useNotificationStore } from '@shared/stores/notification.store';
import type { NotificationInput } from '@typings/store';

type Options = Pick<NotificationInput, 'timeout'>;

/**
 * Mostra uma notificação no snackbar global (ADR-0040). O texto chega
 * traduzido, de quem notifica.
 *
 * @example
 * const notify = useNotify();
 * notify.success(t('customers.notify.saved'));
 */
export function useNotify() {
  const store = useNotificationStore();
  const show =
    (type: NotificationInput['type']) =>
    (message: string, options: Options = {}): number =>
      store.notify({ type, message, ...options });

  return {
    success: show('success'),
    info: show('info'),
    warning: show('warning'),
    error: show('error'),
  };
}
