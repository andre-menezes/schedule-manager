/**
 * Paginação na URL (`?page=2&pageSize=25`): recarregar a página, voltar no
 * histórico ou compartilhar o link mantém a mesma página. Funções puras: leem
 * e montam a query, sem acessar o router.
 */
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@core/config';
import type { PageParams } from '@typings/services';

/** Valor de um parâmetro de query como o vue-router entrega (`LocationQuery`). */
export type QueryValue = string | null | (string | null)[] | undefined;

/** Query string da rota, compatível com `LocationQuery` do vue-router. */
export type RouteQuery = Record<string, QueryValue>;

/** Primeiro valor de um parâmetro, sem espaços nas pontas (`?a=1&a=2` vira `'1'`). */
export function firstQueryValue(value: QueryValue): string {
  return ((Array.isArray(value) ? value[0] : value) ?? '').trim();
}

/** Inteiro positivo do parâmetro, ou `fallback` quando ausente ou inválido. */
function positiveInt(value: QueryValue, fallback: number): number {
  const parsed = Number(firstQueryValue(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Lê `page` e `pageSize` da query, com a primeira página e
 * `DEFAULT_PAGE_SIZE` como padrão e o tamanho limitado a `MAX_PAGE_SIZE`.
 *
 * @example
 * parsePageParams({ page: '2', pageSize: '500' }) // { page: 2, pageSize: 100 }
 */
export function parsePageParams(query: RouteQuery): PageParams {
  return {
    page: positiveInt(query.page, 1),
    pageSize: Math.min(positiveInt(query.pageSize, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
  };
}

/**
 * Monta `page` e `pageSize` da query sem os valores padrão (a URL fica curta).
 *
 * @example
 * toPageQuery({ page: 1, pageSize: 25 }) // { pageSize: '25' }
 */
export function toPageQuery({ page, pageSize }: PageParams): Record<string, string> {
  return {
    ...(page > 1 ? { page: String(page) } : {}),
    ...(pageSize !== DEFAULT_PAGE_SIZE ? { pageSize: String(pageSize) } : {}),
  };
}
