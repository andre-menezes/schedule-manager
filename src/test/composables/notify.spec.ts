import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useNotify } from '@shared/composables/useNotify';
import { useNotificationStore } from '@shared/stores/notification.store';

describe('useNotify', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('notifica cada tom pela store, repassando o tempo', () => {
    const notify = useNotify();

    notify.success('ok');
    notify.info('info');
    notify.warning('atenção');
    notify.error('falhou', { timeout: 1000 });

    expect(
      useNotificationStore().queue.map(({ type, message, timeout }) => [type, message, timeout])
    ).toEqual([
      ['success', 'ok', 5000],
      ['info', 'info', 5000],
      ['warning', 'atenção', 5000],
      ['error', 'falhou', 1000],
    ]);
  });
});
