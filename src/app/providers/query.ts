/**
 * TanStack Query (vue-query): cache, deduplicação e estados de requisições
 * assíncronas (ADR-0027).
 *
 * Padrões do template:
 * ─ `staleTime` de 30 s — evita refazer a mesma busca ao navegar entre telas.
 * ─ `retry: 1` — uma nova tentativa; erros 4xx não melhoram com repetição.
 * ─ `refetchOnWindowFocus: false` — sem buscas inesperadas ao trocar de aba.
 * ─ Erro de mutation vira notificação global, salvo `meta: { notifyError:
 *   false }` quando a tela já mostra o erro (ADR-0040). Erros de leitura
 *   ficam com a tela, no `BaseErrorState`.
 *
 * @see https://tanstack.com/query/latest/docs/framework/vue/overview
 */
import '@typings/query';
import { MutationCache, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { notifyHttpError } from '@shared/helpers/http-error-notification';
import i18n from './i18n';

/** Recebe o erro de uma mutation que não tratou o próprio erro na tela. */
export type MutationErrorHandler = (error: unknown) => void;

export function createQueryClient(onMutationError?: MutationErrorHandler): QueryClient {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _variables, _result, mutation) => {
        if (mutation.meta?.notifyError !== false) {
          onMutationError?.(error);
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/** Notifica com os textos de fallback no locale ativo. Exportada para teste. */
export const notifyMutationError: MutationErrorHandler = (error) =>
  notifyHttpError(error, {
    unexpected: i18n.global.t('errors.unexpected'),
    requestFailed: i18n.global.t('errors.requestFailed'),
  });

export const queryPluginOptions: VueQueryPluginOptions = {
  queryClient: createQueryClient(notifyMutationError),
};
