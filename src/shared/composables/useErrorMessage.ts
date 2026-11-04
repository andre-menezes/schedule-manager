import { useI18n } from 'vue-i18n';
import { getErrorMessage } from '@shared/utils/http-error';
import type { ErrorMessageFallbacks } from '@typings/http';

/**
 * `getErrorMessage` com os fallbacks traduzidos no locale ativo
 * (`errors.*`). Um fallback pode ser trocado por chamada, para um texto mais
 * específico da tela.
 *
 * @example
 * const errorMessage = useErrorMessage();
 * alertMessage.value = errorMessage(error, { unexpected: t('transfer.failed') });
 */
export function useErrorMessage() {
  const { t } = useI18n();

  return (error: unknown, overrides: Partial<ErrorMessageFallbacks> = {}): string =>
    getErrorMessage(error, {
      unexpected: t('errors.unexpected'),
      requestFailed: t('errors.requestFailed'),
      ...overrides,
    });
}
