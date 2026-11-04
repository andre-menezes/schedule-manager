/**
 * Contratos do módulo de clientes (exemplo canônico de CRUD).
 *
 * O payload da API e o modelo da UI têm o mesmo formato aqui, então um tipo
 * só serve aos dois. Quando divergirem, separe `CustomerResponse` (API) de
 * `Customer` (UI) e mapeie no service.
 *
 * A paginação usa os tipos compartilhados de `@typings/services`.
 */
import type { PageParams } from '@typings/services';

/** Cliente como a API devolve e a UI exibe. */
export interface Customer {
  id: number;
  name: string;
  email: string;
  /** Telefone livre, sem máscara; `null` quando não informado. */
  phone: string | null;
  active: boolean;
  /** Data e hora de cadastro em ISO 8601. */
  createdAt: string;
}

/** Campos editáveis de um cliente: corpo do POST e do PUT. */
export interface CustomerParams {
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
}

/** Página e filtro da listagem de clientes. */
export interface CustomerListParams extends PageParams {
  /** Filtro por nome ou e-mail; vazio lista todos. */
  search?: string;
}
