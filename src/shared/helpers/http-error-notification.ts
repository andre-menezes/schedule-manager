/**
 * Erro HTTP → notificação global (ADR-0040). Usa a store de notificações,
 * por isso fica em `helpers/`: é chamado fora de componentes, pelo
 * `MutationCache` do TanStack Query (`@app/providers/query`).
 */
import { useNotificationStore } from '@shared/stores/notification.store';
import { getErrorMessage, isAbortError } from '@shared/utils/http-error';
import type { ErrorMessageFallbacks } from '@typings/http';

/**
 * Mostra o erro como notificação, com a mensagem do Problem Details
 * (RFC 9457) quando houver. Uma requisição cancelada não é erro para o
 * usuário e é ignorada.
 */
export function notifyHttpError(error: unknown, fallbacks: ErrorMessageFallbacks): void {
  if (isAbortError(error)) return;
  useNotificationStore().notify({ type: 'error', message: getErrorMessage(error, fallbacks) });
}
