/**
 * Estado da listagem de clientes na URL (`?page=2&pageSize=25&search=ana`).
 * A paginação vem do util compartilhado; aqui entra só a busca.
 */
import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import { firstQueryValue, parsePageParams, toPageQuery } from '@shared/utils/pagination';
import type { CustomerListParams } from './types';

/** Lê os parâmetros da listagem da query da rota, com valores padrão. */
export function parseListQuery(query: LocationQuery): CustomerListParams {
  const search = firstQueryValue(query.search);
  return { ...parsePageParams(query), ...(search ? { search } : {}) };
}

/** Monta a query da rota, sem os valores padrão (a URL fica curta). */
export function toListQuery({ search, ...page }: CustomerListParams): LocationQueryRaw {
  return { ...toPageQuery(page), ...(search ? { search } : {}) };
}
