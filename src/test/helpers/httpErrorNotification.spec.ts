import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { notifyHttpError } from '@shared/helpers/http-error-notification';
import { useNotificationStore } from '@shared/stores/notification.store';

const fallbacks = { unexpected: 'Erro inesperado.', requestFailed: 'Erro na requisição' };

describe('notifyHttpError', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('notifica a mensagem do Problem Details como erro', () => {
    notifyHttpError({ status: 409, data: { detail: 'E-mail repetido.', status: 409 } }, fallbacks);

    expect(useNotificationStore().current).toMatchObject({
      type: 'error',
      message: 'E-mail repetido. (HTTP 409)',
    });
  });

  it('usa o fallback quando o erro não traz mensagem', () => {
    notifyHttpError(null, fallbacks);

    expect(useNotificationStore().current?.message).toBe('Erro inesperado.');
  });

  it('ignora requisições canceladas', () => {
    notifyHttpError(new DOMException('Abortado', 'AbortError'), fallbacks);

    expect(useNotificationStore().queue).toEqual([]);
  });
});
