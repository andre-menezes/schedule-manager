/**
 * Indica se a API respondeu 404. O `FetchError` do ofetch traz o status em
 * `status`; usado para mostrar "não encontrado" em vez de um erro genérico.
 */
export function isNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && Reflect.get(error, 'status') === 404;
}
