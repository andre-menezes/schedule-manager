import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { VDataTableServer, VDialog } from 'vuetify/components';
import CustomerDeleteDialog from '@modules/customers/components/CustomerDeleteDialog.vue';
import CustomerDetails from '@modules/customers/components/CustomerDetails.vue';
import CustomerStatusChip from '@modules/customers/components/CustomerStatusChip.vue';
import CustomerTable from '@modules/customers/components/CustomerTable.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { buildCustomer } from './fixtures';
import { createCustomersRouter } from './router';

describe('CustomerStatusChip', () => {
  it('mostra a situação do cliente', () => {
    expect(mountWithPlugins(CustomerStatusChip, { props: { active: true } }).text()).toContain(
      'Ativo'
    );
    expect(mountWithPlugins(CustomerStatusChip, { props: { active: false } }).text()).toContain(
      'Inativo'
    );
  });
});

describe('CustomerDetails', () => {
  it('mostra e-mail, telefone e data de cadastro no formato do locale', () => {
    const wrapper = mountWithPlugins(CustomerDetails, { props: { customer: buildCustomer() } });

    expect(wrapper.find('[data-cy="customer-email"]').text()).toBe('maria@example.com');
    expect(wrapper.find('[data-cy="customer-phone"]').text()).toBe('(31) 99999-0000');
    expect(wrapper.text()).toContain('15/03/2026');
  });

  it('indica telefone não informado', () => {
    const wrapper = mountWithPlugins(CustomerDetails, {
      props: { customer: buildCustomer({ phone: null }) },
    });

    expect(wrapper.find('[data-cy="customer-phone"]').text()).toBe('Não informado');
  });
});

describe('CustomerTable', () => {
  async function mountTable(props: { page?: number; pageSize?: number } = {}) {
    const router = await createCustomersRouter();
    const wrapper = mountWithPlugins(CustomerTable, {
      props: {
        customers: [buildCustomer(), buildCustomer({ id: 8, name: 'João Lima', active: false })],
        total: 30,
        page: props.page ?? 1,
        pageSize: props.pageSize ?? 10,
        loading: false,
      },
      global: { plugins: [router] },
    });
    await flushPromises();
    return wrapper;
  }

  const emitOptions = (wrapper: VueWrapper, page: number, itemsPerPage: number) =>
    wrapper.findComponent(VDataTableServer).vm.$emit('update:options', { page, itemsPerPage });

  it('lista os clientes com link para o detalhe', async () => {
    const wrapper = await mountTable();
    const links = wrapper.findAll('[data-cy="customer-link"]');

    expect(links.map((link) => link.text())).toEqual(['Maria Souza', 'João Lima']);
    expect(links[0]?.attributes('href')).toBe('/customers/7');
    expect(wrapper.text()).toContain('15/03/2026');
    expect(wrapper.text()).toContain('Inativo');
  });

  it('mostra o estado vazio sem clientes', async () => {
    const router = await createCustomersRouter();
    const wrapper = mountWithPlugins(CustomerTable, {
      props: { customers: [], total: 0, page: 1, pageSize: 10, loading: false },
      global: { plugins: [router] },
    });
    await flushPromises();

    expect(wrapper.get('[data-cy="empty-state-title"]').text()).toBe('Nenhum cliente encontrado.');
  });

  it('não emite nada quando as opções não mudam (montagem)', async () => {
    const wrapper = await mountTable();

    emitOptions(wrapper, 1, 10);

    expect(wrapper.emitted('changePage')).toBeUndefined();
  });

  it('emite a nova página', async () => {
    const wrapper = await mountTable();

    emitOptions(wrapper, 3, 10);

    expect(wrapper.emitted('changePage')).toEqual([[{ page: 3, pageSize: 10 }]]);
  });

  it('volta à primeira página ao trocar o tamanho da página', async () => {
    const wrapper = await mountTable({ page: 2 });

    emitOptions(wrapper, 2, 25);

    expect(wrapper.emitted('changePage')).toEqual([[{ page: 1, pageSize: 25 }]]);
  });
});

describe('CustomerDeleteDialog', () => {
  let wrapper: VueWrapper | undefined;

  /** O conteúdo do v-dialog é teleportado para o <body>. */
  const inBody = (cy: string) => document.body.querySelector<HTMLElement>(`[data-cy="${cy}"]`);

  beforeEach(() => {
    vi.stubGlobal('visualViewport', new EventTarget());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
  });

  async function openDialog(errorMessage?: string) {
    wrapper = mountWithPlugins(CustomerDeleteDialog, {
      props: { modelValue: true, customerName: 'Maria Souza', deleting: false, errorMessage },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    return wrapper;
  }

  it('pede confirmação citando o cliente', async () => {
    await openDialog();

    expect(inBody('customer-delete-dialog')?.textContent).toContain('Excluir Maria Souza?');
    expect(inBody('customer-delete-error')).toBeNull();
  });

  it('confirma ou fecha pelos botões', async () => {
    const dialog = await openDialog();

    inBody('customer-delete-confirm-btn')?.click();
    inBody('customer-delete-cancel-btn')?.click();

    expect(dialog.emitted('confirm')).toHaveLength(1);
    expect(dialog.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('repassa o fechamento pelo próprio diálogo (Esc ou clique fora)', async () => {
    const dialog = await openDialog();

    dialog.findComponent(VDialog).vm.$emit('update:modelValue', false);

    expect(dialog.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('mostra o erro da exclusão', async () => {
    await openDialog('Falhou (HTTP 500)');

    expect(inBody('customer-delete-error')?.textContent).toContain('Falhou (HTTP 500)');
  });
});
