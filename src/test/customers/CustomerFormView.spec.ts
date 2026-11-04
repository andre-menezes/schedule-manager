import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import * as service from '@modules/customers/api/customer.service';
import CustomerForm from '@modules/customers/components/CustomerForm.vue';
import CustomerFormView from '@modules/customers/views/CustomerFormView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { useNotificationStore } from '@shared/stores/notification.store';
import { buildCustomer, httpError } from './fixtures';
import { createCustomersRouter } from './router';

vi.mock('@modules/customers/api/customer.service', () => ({
  getCustomerRequest: vi.fn(),
  createCustomerRequest: vi.fn(),
  updateCustomerRequest: vi.fn(),
}));

const params = { name: 'Maria Souza', email: 'maria@example.com', phone: null, active: true };

async function mountForm(id?: number) {
  const router = await createCustomersRouter(id ? `/customers/${id}/edit` : '/customers/new');
  const wrapper = mountWithPlugins(CustomerFormView, {
    props: { id },
    global: { plugins: [router] },
  });
  await flushPromises();
  return { wrapper, router };
}

/** Simula o envio do formulário já validado. */
async function submit(wrapper: Awaited<ReturnType<typeof mountForm>>['wrapper']) {
  wrapper.findComponent(CustomerForm).vm.$emit('submit', params);
  await flushPromises();
}

describe('CustomerFormView — cadastro', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra o formulário vazio sem buscar cliente', async () => {
    const { wrapper } = await mountForm();

    expect(wrapper.find('[data-cy="customer-form-title"]').text()).toBe('Novo cliente');
    expect(wrapper.find('[data-cy="customer-form"]').exists()).toBe(true);
    expect(service.getCustomerRequest).not.toHaveBeenCalled();
  });

  it('cadastra e abre o detalhe do novo cliente', async () => {
    vi.mocked(service.createCustomerRequest).mockResolvedValue(buildCustomer({ id: 40 }));
    const { wrapper, router } = await mountForm();

    await submit(wrapper);

    expect(service.createCustomerRequest).toHaveBeenCalledWith(params);
    expect(useNotificationStore().current?.message).toBe('Cliente cadastrado: Maria Souza.');
    await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/customers/40'));
  });

  it('mostra o erro da gravação no formulário', async () => {
    vi.mocked(service.createCustomerRequest).mockRejectedValue(
      httpError(409, 'Já existe um cliente com este e-mail.')
    );
    const { wrapper, router } = await mountForm();

    await submit(wrapper);

    expect(wrapper.find('[data-cy="customer-form-error"]').text()).toContain('HTTP 409');
    // O formulário mostra o erro; a notificação global fica desligada.
    expect(useNotificationStore().queue).toEqual([]);
    expect(router.currentRoute.value.name).toBe('CustomerCreate');
  });

  it('cancelar volta para a lista', async () => {
    const { wrapper, router } = await mountForm();

    wrapper.findComponent(CustomerForm).vm.$emit('cancel');
    await flushPromises();

    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('Customers'));
  });
});

describe('CustomerFormView — edição', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(service.getCustomerRequest).mockResolvedValue(buildCustomer());
  });

  it('preenche o formulário com o cliente', async () => {
    const { wrapper } = await mountForm(7);

    expect(wrapper.find('[data-cy="customer-form-title"]').text()).toBe('Editar cliente');
    expect(
      wrapper.find<HTMLInputElement>('[data-cy="customer-name-input"] input').element.value
    ).toBe('Maria Souza');
  });

  it('atualiza e volta para o detalhe', async () => {
    vi.mocked(service.updateCustomerRequest).mockResolvedValue(buildCustomer());
    const { wrapper, router } = await mountForm(7);

    await submit(wrapper);

    expect(service.updateCustomerRequest).toHaveBeenCalledWith(7, params);
    expect(useNotificationStore().current?.message).toBe('Cliente atualizado: Maria Souza.');
    await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/customers/7'));
  });

  it('cancelar volta para o detalhe', async () => {
    const { wrapper, router } = await mountForm(7);

    wrapper.findComponent(CustomerForm).vm.$emit('cancel');
    await flushPromises();

    await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/customers/7'));
  });

  it('avisa quando o cliente não existe ou a busca falha', async () => {
    vi.mocked(service.getCustomerRequest).mockRejectedValueOnce(httpError(404));
    const notFound = await mountForm(7);
    vi.mocked(service.getCustomerRequest).mockRejectedValueOnce(httpError(500, 'Sem conexão'));
    const failed = await mountForm(7);

    expect(notFound.wrapper.find('[data-cy="customer-form-load-error"]').text()).toContain(
      'Cliente não encontrado'
    );
    expect(failed.wrapper.find('[data-cy="customer-form-load-error"]').text()).toContain(
      'Sem conexão'
    );
  });

  it('tenta buscar de novo pelo estado de erro', async () => {
    vi.mocked(service.getCustomerRequest).mockRejectedValueOnce(httpError(500, 'Falha'));
    const { wrapper } = await mountForm(7);

    await wrapper.get('[data-cy="error-state-retry"]').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-cy="customer-form"]').exists()).toBe(true);
  });
});
