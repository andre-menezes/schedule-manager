import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import * as service from '@modules/customers/api/customer.service';
import CustomerDetailView from '@modules/customers/views/CustomerDetailView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { useNotificationStore } from '@shared/stores/notification.store';
import { buildCustomer, httpError } from './fixtures';
import { createCustomersRouter } from './router';

vi.mock('@modules/customers/api/customer.service', () => ({
  getCustomerRequest: vi.fn(),
  deleteCustomerRequest: vi.fn(),
}));

let wrapper: VueWrapper | undefined;

async function mountDetail() {
  const router = await createCustomersRouter('/customers/7');
  wrapper = mountWithPlugins(CustomerDetailView, {
    props: { id: 7 },
    global: { plugins: [router] },
    attachTo: document.body,
  });
  await flushPromises();
  return { wrapper, router };
}

/** O conteúdo do v-dialog é teleportado para o <body>. */
const inBody = (cy: string) => document.body.querySelector<HTMLElement>(`[data-cy="${cy}"]`);

describe('CustomerDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('visualViewport', new EventTarget());
    vi.mocked(service.getCustomerRequest).mockResolvedValue(buildCustomer());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
  });

  it('mostra o cliente com link para editar', async () => {
    const { wrapper } = await mountDetail();

    expect(service.getCustomerRequest).toHaveBeenCalledWith(7, expect.anything());
    expect(wrapper.find('[data-cy="customer-detail-title"]').text()).toBe('Maria Souza');
    expect(wrapper.find('[data-cy="customer-edit-btn"]').attributes('href')).toBe(
      '/customers/7/edit'
    );
  });

  it('avisa quando o cliente não existe', async () => {
    vi.mocked(service.getCustomerRequest).mockRejectedValue(httpError(404));
    const { wrapper } = await mountDetail();

    expect(wrapper.find('[data-cy="customer-detail-error"]').text()).toContain(
      'Cliente não encontrado'
    );
  });

  it('mostra outros erros da API', async () => {
    vi.mocked(service.getCustomerRequest).mockRejectedValue(httpError(500, 'Falha no servidor'));
    const { wrapper } = await mountDetail();

    expect(wrapper.find('[data-cy="customer-detail-error"]').text()).toContain('Falha no servidor');
  });

  it('tenta buscar de novo pelo estado de erro', async () => {
    vi.mocked(service.getCustomerRequest).mockRejectedValueOnce(httpError(500, 'Falha'));
    const { wrapper } = await mountDetail();

    await wrapper.get('[data-cy="error-state-retry"]').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-cy="customer-detail-title"]').text()).toBe('Maria Souza');
  });

  it('exclui após confirmar e volta para a lista', async () => {
    vi.mocked(service.deleteCustomerRequest).mockResolvedValue(undefined);
    const { wrapper, router } = await mountDetail();

    await wrapper.find('[data-cy="customer-delete-btn"]').trigger('click');
    await flushPromises();
    inBody('customer-delete-confirm-btn')?.click();
    await flushPromises();

    expect(service.deleteCustomerRequest).toHaveBeenCalledWith(7);
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('Customers'));
    expect(useNotificationStore().current).toMatchObject({
      type: 'success',
      message: 'Cliente excluído: Maria Souza.',
    });
  });

  it('mostra o erro da exclusão no diálogo e o limpa ao reabrir', async () => {
    vi.mocked(service.deleteCustomerRequest).mockRejectedValue(httpError(500, 'Não excluiu'));
    const { wrapper, router } = await mountDetail();

    await wrapper.find('[data-cy="customer-delete-btn"]').trigger('click');
    await flushPromises();
    inBody('customer-delete-confirm-btn')?.click();
    await flushPromises();

    expect(inBody('customer-delete-error')?.textContent).toContain('Não excluiu');
    expect(router.currentRoute.value.name).toBe('CustomerDetail');

    inBody('customer-delete-cancel-btn')?.click();
    await wrapper.find('[data-cy="customer-delete-btn"]').trigger('click');
    await flushPromises();

    expect(inBody('customer-delete-error')).toBeNull();
  });
});
