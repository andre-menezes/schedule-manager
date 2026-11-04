import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import {
  ERROR_NOTIFICATION_TIMEOUT_MS,
  NOTIFICATION_TIMEOUT_MS,
  useNotificationStore,
} from '@shared/stores/notification.store';

describe('notificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('enfileira em ordem de chegada e expõe a primeira como atual', () => {
    const store = useNotificationStore();

    store.notify({ type: 'success', message: 'Salvo' });
    store.notify({ type: 'info', message: 'Depois' });

    expect(store.queue.map(({ message }) => message)).toEqual(['Salvo', 'Depois']);
    expect(store.current?.message).toBe('Salvo');
  });

  it('usa um tempo maior para erros e aceita um tempo próprio', () => {
    const store = useNotificationStore();

    store.notify({ type: 'success', message: 'a' });
    store.notify({ type: 'error', message: 'b' });
    store.notify({ type: 'info', message: 'c', timeout: -1 });

    expect(store.queue.map(({ timeout }) => timeout)).toEqual([
      NOTIFICATION_TIMEOUT_MS,
      ERROR_NOTIFICATION_TIMEOUT_MS,
      -1,
    ]);
  });

  it('remove pelo id devolvido e passa para a próxima', () => {
    const store = useNotificationStore();
    const first = store.notify({ type: 'success', message: 'a' });
    const second = store.notify({ type: 'success', message: 'b' });

    store.dismiss(first);

    expect(second).not.toBe(first);
    expect(store.current?.message).toBe('b');
    store.dismiss(second);
    expect(store.current).toBeUndefined();
  });
});
