import { beforeEach, describe, expect, it, vi } from 'vitest';
import { httpClient } from '@shared/api/instances';
import {
  createCustomerRequest,
  deleteCustomerRequest,
  getCustomerRequest,
  getCustomersRequest,
  updateCustomerRequest,
} from '@modules/customers/api/customer.service';
import { buildCustomer, buildPage } from './fixtures';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const params = { name: 'Maria Souza', email: 'maria@example.com', phone: null, active: true };

describe('customer service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista uma página repassando os parâmetros na query e o signal', async () => {
    const page = buildPage();
    const { signal } = new AbortController();
    vi.mocked(httpClient.get).mockResolvedValue(page);

    await expect(
      getCustomersRequest({ page: 2, pageSize: 25, search: 'ana' }, { signal })
    ).resolves.toBe(page);
    expect(httpClient.get).toHaveBeenCalledWith('/customers', {
      query: { page: 2, pageSize: 25, search: 'ana' },
      signal,
    });
  });

  it('busca um cliente pelo id', async () => {
    vi.mocked(httpClient.get).mockResolvedValue(buildCustomer());

    await getCustomerRequest(7);

    expect(httpClient.get).toHaveBeenCalledWith('/customers/7', { signal: undefined });
  });

  it('cadastra, atualiza e exclui pelos endpoints REST', async () => {
    await createCustomerRequest(params);
    await updateCustomerRequest(7, params);
    await deleteCustomerRequest(7);

    expect(httpClient.post).toHaveBeenCalledWith('/customers', { body: params });
    expect(httpClient.put).toHaveBeenCalledWith('/customers/7', { body: params });
    expect(httpClient.delete).toHaveBeenCalledWith('/customers/7');
  });
});
