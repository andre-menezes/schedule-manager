import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import * as service from '@modules/customers/api/customer.service';
import { VTextField } from 'vuetify/components';
import CustomerTable from '@modules/customers/components/CustomerTable.vue';
import CustomersView from '@modules/customers/views/CustomersView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { buildCustomer, buildPage, httpError } from './fixtures';
import { createCustomersRouter } from './router';

vi.mock('@modules/customers/api/customer.service', () => ({ getCustomersRequest: vi.fn() }));

async function mountList(path = '/customers') {
  const router = await createCustomersRouter(path);
  const wrapper = mountWithPlugins(CustomersView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

const lastParams = () => vi.mocked(service.getCustomersRequest).mock.lastCall?.[0];

describe('CustomersView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(service.getCustomersRequest).mockResolvedValue(
      buildPage([buildCustomer()], { total: 100 })
    );
  });

  it('lista a página da URL com link para cadastrar', async () => {
    const { wrapper } = await mountList('/customers?page=2&search=maria');

    expect(lastParams()).toEqual({ page: 2, pageSize: 10, search: 'maria' });
    expect(wrapper.find('[data-cy="customer-link"]').text()).toBe('Maria Souza');
    expect(wrapper.find('[data-cy="customer-create-btn"]').attributes('href')).toBe(
      '/customers/new'
    );
    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-search-input"] input').element.value
    ).toBe('maria');
  });

  it('a troca de página vai para a URL e refaz a busca', async () => {
    const { wrapper, router } = await mountList('/customers?search=maria');

    wrapper.findComponent(CustomerTable).vm.$emit('changePage', {
      page: 3,
      pageSize: 10,
    });
    await flushPromises();

    // A navegação termina numa tarefa seguinte, depois das microtarefas.
    await vi.waitFor(() =>
      expect(router.currentRoute.value.fullPath).toBe('/customers?page=3&search=maria')
    );
    await flushPromises();
    expect(lastParams()).toEqual({ page: 3, pageSize: 10, search: 'maria' });
  });

  it('buscar volta à primeira página', async () => {
    const { wrapper, router } = await mountList('/customers?page=3&pageSize=25');

    await wrapper.find('[data-cy="customer-search-input"] input').setValue(' ana ');
    await wrapper.find('[data-cy="customer-search"]').trigger('submit');
    await flushPromises();

    await vi.waitFor(() =>
      expect(router.currentRoute.value.fullPath).toBe('/customers?pageSize=25&search=ana')
    );
  });

  it('limpar a busca remove o filtro', async () => {
    const { wrapper, router } = await mountList('/customers?search=ana');

    wrapper.findComponent(VTextField).vm.$emit('click:clear', new MouseEvent('click'));
    await flushPromises();

    await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/customers'));
  });

  it('o campo de busca acompanha a URL ao voltar no histórico', async () => {
    const { wrapper, router } = await mountList('/customers?search=ana');

    await router.replace('/customers');
    await flushPromises();

    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-search-input"] input').element.value
    ).toBe('');
  });

  it('mostra o erro da API no lugar da tabela', async () => {
    vi.mocked(service.getCustomersRequest).mockRejectedValue(httpError(500, 'Banco fora do ar'));
    const { wrapper } = await mountList();

    expect(wrapper.find('[data-cy="customers-error"]').text()).toContain('Banco fora do ar');
    expect(wrapper.find('[data-cy="customer-table"]').exists()).toBe(false);
  });

  it('tenta de novo pelo estado de erro', async () => {
    vi.mocked(service.getCustomersRequest).mockRejectedValueOnce(httpError(500, 'Fora do ar'));
    const { wrapper } = await mountList();

    await wrapper.get('[data-cy="error-state-retry"]').trigger('click');
    await flushPromises();

    expect(service.getCustomersRequest).toHaveBeenCalledTimes(2);
    expect(wrapper.find('[data-cy="customer-link"]').exists()).toBe(true);
  });
});
