/**
 * Rotas da API simulada do `pnpm dev` (ADR-0039). Para simular um endpoint
 * novo, crie `mock/<contexto>.ts` com os handlers e some-os aqui.
 */
import type { MockHandler } from './api-mock.ts';
import { createCustomerHandlers } from './customers.ts';

export const handlers: MockHandler[] = [...createCustomerHandlers()];
