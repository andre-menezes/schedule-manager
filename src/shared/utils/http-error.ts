/**
 * Extração de mensagens de erro HTTP no padrão RFC 9457 (Problem Details).
 * Funções puras — não dependem de stores, services, instâncias HTTP nem do
 * i18n: os textos de fallback chegam por parâmetro (ver `useErrorMessage`).
 */
import type { ErrorMessageFallbacks, ProblemDetails } from '@typings/http';

interface FetchErrorLike {
  status?: number;
  statusText?: string;
  data?: unknown;
  message?: string;
}

/** Type guard: verifica se o valor tem o formato de um Problem Details. */
export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in value || 'detail' in value || 'status' in value || 'type' in value)
  );
}

/**
 * Deriva uma mensagem legível a partir de um erro de requisição.
 * Prioriza o `detail`/`title` do corpo Problem Details (RFC 9457) e,
 * na ausência, usa o status HTTP ou a mensagem do erro. Os textos para
 * quando o erro não traz nenhum vêm de `fallbacks`, já traduzidos.
 *
 * @example
 * getErrorMessage(fetchError, { unexpected: t('errors.unexpected'), requestFailed: t('errors.requestFailed') })
 * // 'O código de autorização expirou. (HTTP 400)'
 */
export function getErrorMessage(error: unknown, fallbacks: ErrorMessageFallbacks): string {
  const err = error as FetchErrorLike;
  const problem = err?.data;

  if (isProblemDetails(problem)) {
    const message = problem.detail || problem.title;
    if (message) {
      return problem.status ? `${message} (HTTP ${problem.status})` : message;
    }
  }

  if (err?.status) {
    return `${err.statusText || fallbacks.requestFailed} (HTTP ${err.status})`;
  }

  return err?.message || fallbacks.unexpected;
}

/**
 * Indica se o erro veio de uma requisição cancelada pelo chamador (`signal`).
 * O ofetch embrulha o `AbortError` num `FetchError` (em `cause`); as duas
 * formas são aceitas. Timeout não conta como cancelamento (`TimeoutError`).
 *
 * @example
 * catch (error) { if (isAbortError(error)) return; throw error; }
 */
export function isAbortError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  if (error.name === 'AbortError') {
    return true;
  }
  return error.cause instanceof Error && error.cause.name === 'AbortError';
}
