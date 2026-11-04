import type { Customer } from '@modules/customers/types';
import type { PaginatedResponse } from '@typings/services';

/** Cliente de exemplo dos testes do módulo `customers`. */
export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    id: 7,
    name: 'Maria Souza',
    email: 'maria@example.com',
    phone: '(31) 99999-0000',
    active: true,
    createdAt: '2026-03-15T12:00:00.000Z',
    ...overrides,
  };
}

/** Página de resultados com os clientes informados. */
export function buildPage(
  items: Customer[] = [buildCustomer()],
  overrides: Partial<PaginatedResponse<Customer>> = {}
): PaginatedResponse<Customer> {
  return { items, total: items.length, page: 1, pageSize: 10, ...overrides };
}

/** Erro como o ofetch lança para uma resposta HTTP (status + corpo). */
export function httpError(status: number, detail?: string): Error {
  return Object.assign(new Error(`HTTP ${status}`), {
    status,
    data: detail ? { title: 'Erro', status, detail } : undefined,
  });
}
