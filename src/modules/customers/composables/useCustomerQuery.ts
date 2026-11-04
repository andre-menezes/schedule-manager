import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getCustomerRequest } from '../api/customer.service';
import { customerKeys } from './customer-keys';

/**
 * Um cliente pelo id. Sem id (`null`, ex.: tela de cadastro), a query fica
 * desligada e não faz requisição.
 */
export function useCustomerQuery(id: MaybeRefOrGetter<number | null>) {
  const customerId = computed(() => toValue(id));

  return useQuery({
    queryKey: computed(() => customerKeys.detail(customerId.value ?? 0)),
    // Só roda com `enabled`, ou seja, com um id definido.
    queryFn: ({ signal }) => getCustomerRequest(Number(customerId.value), { signal }),
    enabled: computed(() => customerId.value !== null),
  });
}
