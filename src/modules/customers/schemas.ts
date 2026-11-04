/**
 * Validação do formulário de clientes (ADR-0042). As mensagens são chaves de
 * i18n, traduzidas pelo componente: as genéricas em `validation.*` (app) e as
 * do módulo em `customers.validation.*`. A saída do schema é o corpo do POST/PUT
 * (`CustomerParams`): textos sem espaços nas pontas e telefone vazio como
 * `null`.
 */
import { z } from 'zod';
import type { CustomerParams } from './types';

export const NAME_MAX_LENGTH = 120;

const required = { error: 'validation.required' };

export const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, required)
    .max(NAME_MAX_LENGTH, { error: 'customers.validation.nameTooLong' }),
  email: z
    .string()
    .trim()
    .min(1, required)
    .pipe(z.email({ error: 'validation.email' })),
  phone: z
    .string()
    .trim()
    .transform((phone) => (phone === '' ? null : phone)),
  active: z.boolean(),
}) satisfies z.ZodType<CustomerParams, CustomerFormValues>;

/** Valores do formulário antes da validação (o que os campos guardam). */
export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

/** Valores iniciais: cadastro em branco ou o cliente em edição. */
export function toFormValues(customer?: CustomerParams): CustomerFormValues {
  return {
    name: customer?.name ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    active: customer?.active ?? true,
  };
}
