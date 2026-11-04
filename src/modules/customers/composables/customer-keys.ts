import type { CustomerListParams } from '../types';

/**
 * Chaves de query dos clientes, do mais geral ao mais específico. Invalidar
 * `customerKeys.all` atinge listas e detalhes; `customerKeys.lists()` só as
 * listas. Centralizar as chaves evita divergência entre leitura e invalidação.
 */
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerListParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
};
