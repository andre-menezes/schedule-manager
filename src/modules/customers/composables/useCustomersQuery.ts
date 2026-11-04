import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { getCustomersRequest } from '../api/customer.service';
import type { CustomerListParams } from '../types';
import { customerKeys } from './customer-keys';

/**
 * Página de clientes. Os parâmetros entram na chave: trocar de página ou de
 * busca dispara uma nova requisição e cancela a anterior. `keepPreviousData`
 * mantém a página atual na tela enquanto a próxima carrega.
 */
export function useCustomersQuery(params: MaybeRefOrGetter<CustomerListParams>) {
  return useQuery({
    queryKey: computed(() => customerKeys.list(toValue(params))),
    queryFn: ({ signal }) => getCustomersRequest(toValue(params), { signal }),
    placeholderData: keepPreviousData,
  });
}
