import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useQueryClient, type QueryClient } from '@tanstack/vue-query';
import * as service from '@modules/customers/api/customer.service';
import { customerKeys } from '@modules/customers/composables/customer-keys';
import { useCustomersQuery } from '@modules/customers/composables/useCustomersQuery';
import { useCustomerQuery } from '@modules/customers/composables/useCustomerQuery';
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} from '@modules/customers/composables/useCustomerMutations';
import type { CustomerListParams } from '@modules/customers/types';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { buildCustomer, buildPage } from './fixtures';

vi.mock('@modules/customers/api/customer.service', () => ({
  getCustomersRequest: vi.fn(),
  getCustomerRequest: vi.fn(),
  createCustomerRequest: vi.fn(),
  updateCustomerRequest: vi.fn(),
  deleteCustomerRequest: vi.fn(),
}));

/** Roda `setup` num componente montado e devolve o retorno e o QueryClient. */
function runInComponent<T>(setup: () => T): { result: T; queryClient: QueryClient } {
  let result!: T;
  let queryClient!: QueryClient;
  mountWithPlugins(
    defineComponent({
      setup() {
        result = setup();
        queryClient = useQueryClient();
        return () => h('div');
      },
    })
  );
  return { result, queryClient };
}

const params = { name: 'Maria Souza', email: 'maria@example.com', phone: null, active: true };

describe('customerKeys', () => {
  it('aninha listas e detalhes sob a chave raiz', () => {
    expect(customerKeys.list({ page: 2, pageSize: 10 })).toEqual([
      'customers',
      'list',
      { page: 2, pageSize: 10 },
    ]);
    expect(customerKeys.detail(7)).toEqual(['customers', 'detail', 7]);
  });
});

describe('useCustomersQuery', () => {
  beforeEach(() => vi.clearAllMocks());

  it('busca de novo quando os parâmetros mudam, repassando o signal', async () => {
    vi.mocked(service.getCustomersRequest).mockResolvedValue(buildPage());
    const listParams = ref<CustomerListParams>({ page: 1, pageSize: 10 });
    const { result } = runInComponent(() => useCustomersQuery(listParams));

    await flushPromises();
    listParams.value = { page: 2, pageSize: 10 };
    await flushPromises();

    expect(service.getCustomersRequest).toHaveBeenNthCalledWith(
      1,
      { page: 1, pageSize: 10 },
      { signal: expect.any(AbortSignal) as AbortSignal }
    );
    expect(service.getCustomersRequest).toHaveBeenLastCalledWith(
      { page: 2, pageSize: 10 },
      { signal: expect.any(AbortSignal) as AbortSignal }
    );
    expect(result.data.value?.total).toBe(1);
  });
});

describe('useCustomerQuery', () => {
  beforeEach(() => vi.clearAllMocks());

  it('busca o cliente pelo id', async () => {
    vi.mocked(service.getCustomerRequest).mockResolvedValue(buildCustomer());
    const { result } = runInComponent(() => useCustomerQuery(7));

    await flushPromises();

    expect(service.getCustomerRequest).toHaveBeenCalledWith(7, {
      signal: expect.any(AbortSignal) as AbortSignal,
    });
    expect(result.data.value?.name).toBe('Maria Souza');
  });

  it('não faz requisição sem id', async () => {
    runInComponent(() => useCustomerQuery(null));

    await flushPromises();

    expect(service.getCustomerRequest).not.toHaveBeenCalled();
  });
});

describe('mutations de clientes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('cadastrar invalida as listas', async () => {
    vi.mocked(service.createCustomerRequest).mockResolvedValue(buildCustomer());
    const { result, queryClient } = runInComponent(() => useCreateCustomerMutation());
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    await result.mutateAsync(params);

    expect(service.createCustomerRequest).toHaveBeenCalledWith(params);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: customerKeys.lists() });
  });

  it('atualizar grava o detalhe no cache e invalida as listas', async () => {
    const updated = buildCustomer({ name: 'Maria Lima' });
    vi.mocked(service.updateCustomerRequest).mockResolvedValue(updated);
    const { result, queryClient } = runInComponent(() => useUpdateCustomerMutation());
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    await result.mutateAsync({ id: 7, params });

    expect(service.updateCustomerRequest).toHaveBeenCalledWith(7, params);
    expect(queryClient.getQueryData(customerKeys.detail(7))).toEqual(updated);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: customerKeys.lists() });
  });

  it('excluir tira o detalhe do cache e invalida as listas', async () => {
    vi.mocked(service.deleteCustomerRequest).mockResolvedValue(undefined);
    const { result, queryClient } = runInComponent(() => useDeleteCustomerMutation());
    queryClient.setQueryData(customerKeys.detail(7), buildCustomer());
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    await result.mutateAsync(7);

    expect(service.deleteCustomerRequest).toHaveBeenCalledWith(7);
    expect(queryClient.getQueryData(customerKeys.detail(7))).toBeUndefined();
    expect(invalidate).toHaveBeenCalledWith({ queryKey: customerKeys.lists() });
  });
});
