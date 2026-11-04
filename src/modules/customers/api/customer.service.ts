/**
 * Service de clientes: uma função por endpoint, com nome de negócio e sufixo
 * `Request`. As leituras aceitam `signal` para o TanStack Query cancelar a
 * requisição (ADR-0027).
 */
import { httpClient } from '@shared/api/instances';
import type { PaginatedResponse } from '@typings/services';
import type { Customer, CustomerListParams, CustomerParams } from '../types';

interface ReadOptions {
  signal?: AbortSignal;
}

/** Lista uma página de clientes, filtrada por `search` quando informado. */
export function getCustomersRequest(
  params: CustomerListParams,
  { signal }: ReadOptions = {}
): Promise<PaginatedResponse<Customer>> {
  return httpClient.get<PaginatedResponse<Customer>, CustomerListParams>('/customers', {
    query: params,
    signal,
  });
}

/** Busca um cliente pelo id. */
export function getCustomerRequest(id: number, { signal }: ReadOptions = {}): Promise<Customer> {
  return httpClient.get<Customer>(`/customers/${id}`, { signal });
}

/** Cadastra um cliente e devolve o registro criado (com `id`). */
export function createCustomerRequest(params: CustomerParams): Promise<Customer> {
  return httpClient.post<Customer, object, CustomerParams>('/customers', { body: params });
}

/** Substitui os campos editáveis de um cliente. */
export function updateCustomerRequest(id: number, params: CustomerParams): Promise<Customer> {
  return httpClient.put<Customer, object, CustomerParams>(`/customers/${id}`, { body: params });
}

/** Exclui um cliente. A API responde 204, sem corpo. */
export function deleteCustomerRequest(id: number): Promise<void> {
  return httpClient.delete<void>(`/customers/${id}`);
}
