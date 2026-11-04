import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  createCustomerRequest,
  deleteCustomerRequest,
  updateCustomerRequest,
} from '../api/customer.service';
import type { CustomerParams } from '../types';
import { customerKeys } from './customer-keys';

/**
 * Gravações de clientes (ADR-0027). Cada uma invalida as queries que deixou
 * desatualizadas; a tela que as exibe busca de novo sozinha.
 *
 * O formulário e o diálogo de exclusão mostram o erro onde ele aconteceu,
 * então as três desligam a notificação global de erro (ADR-0040).
 */
const meta = { notifyError: false };

/** Cadastra um cliente; as listas passam a incluir o novo registro. */
export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CustomerParams) => createCustomerRequest(params),
    meta,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.lists() }),
  });
}

/** Atualiza um cliente; o detalhe recebe a resposta e as listas são refeitas. */
export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: CustomerParams }) =>
      updateCustomerRequest(id, params),
    meta,
    onSuccess: (customer) => {
      queryClient.setQueryData(customerKeys.detail(customer.id), customer);
      return queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

/** Exclui um cliente; o detalhe sai do cache e as listas são refeitas. */
export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomerRequest(id),
    meta,
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: customerKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
