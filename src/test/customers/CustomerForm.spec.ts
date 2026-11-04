import { describe, expect, it, vi } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import CustomerForm from '@modules/customers/components/CustomerForm.vue';
import type { CustomerParams } from '@modules/customers/types';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

function mountForm(initialValues?: CustomerParams, errorMessage?: string) {
  return mountWithPlugins(CustomerForm, { props: { initialValues, saving: false, errorMessage } });
}

const input = (wrapper: VueWrapper, cy: string) =>
  wrapper.find<HTMLInputElement>(`[data-cy="${cy}"] input`);

/**
 * Envia o formulário. A validação do VeeValidate é assíncrona e termina numa
 * tarefa seguinte; o `waitFor` espera o efeito (emit ou mensagem).
 */
async function submit(wrapper: VueWrapper) {
  await wrapper.find('form').trigger('submit');
}

describe('CustomerForm', () => {
  it('começa vazio e ativo no cadastro', () => {
    const wrapper = mountForm();

    expect(input(wrapper, 'customer-name-input').element.value).toBe('');
    expect(input(wrapper, 'customer-active-input').element.checked).toBe(true);
  });

  it('preenche com os valores iniciais na edição', () => {
    const wrapper = mountForm({ name: 'Maria', email: 'm@x.com', phone: null, active: false });

    expect(input(wrapper, 'customer-email-input').element.value).toBe('m@x.com');
    expect(input(wrapper, 'customer-phone-input').element.value).toBe('');
    expect(input(wrapper, 'customer-active-input').element.checked).toBe(false);
  });

  it('não envia com campos obrigatórios vazios e mostra as mensagens traduzidas', async () => {
    const wrapper = mountForm();

    await submit(wrapper);

    await vi.waitFor(() => expect(wrapper.text()).toContain('Campo obrigatório.'));
    expect(wrapper.emitted('submit')).toBeUndefined();
  });

  it('não envia com e-mail inválido', async () => {
    const wrapper = mountForm();
    await input(wrapper, 'customer-name-input').setValue('Maria');
    await input(wrapper, 'customer-email-input').setValue('maria@');

    await submit(wrapper);

    await vi.waitFor(() => expect(wrapper.text()).toContain('Informe um e-mail válido.'));
    expect(wrapper.emitted('submit')).toBeUndefined();
  });

  it('envia os campos limpos pelo schema, com telefone vazio como null', async () => {
    const wrapper = mountForm();
    await input(wrapper, 'customer-name-input').setValue('  Maria Souza ');
    await input(wrapper, 'customer-email-input').setValue(' maria@example.com ');
    await input(wrapper, 'customer-phone-input').setValue('   ');

    await submit(wrapper);

    await vi.waitFor(() =>
      expect(wrapper.emitted('submit')).toEqual([
        [{ name: 'Maria Souza', email: 'maria@example.com', phone: null, active: true }],
      ])
    );
  });

  it('mantém o telefone e a situação escolhidos', async () => {
    const wrapper = mountForm({ name: 'Maria', email: 'm@x.com', phone: null, active: true });
    await input(wrapper, 'customer-phone-input').setValue(' 3199 ');
    await input(wrapper, 'customer-active-input').setValue(false);

    await submit(wrapper);

    await vi.waitFor(() =>
      expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ phone: '3199', active: false })
    );
  });

  it('mostra o erro da gravação e emite o cancelamento', async () => {
    const wrapper = mountForm(undefined, 'E-mail já cadastrado (HTTP 409)');

    await wrapper.find('[data-cy="customer-cancel-btn"]').trigger('click');

    expect(wrapper.find('[data-cy="customer-form-error"]').text()).toContain('HTTP 409');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
