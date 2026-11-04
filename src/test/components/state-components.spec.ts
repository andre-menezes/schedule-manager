import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import BaseEmptyState from '@shared/ui/components/BaseEmptyState.vue';
import BaseErrorState from '@shared/ui/components/BaseErrorState.vue';
import BaseLoadingState from '@shared/ui/components/BaseLoadingState.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('BaseLoadingState', () => {
  it('anuncia o carregamento com o texto padrão', () => {
    const wrapper = mountWithPlugins(BaseLoadingState);
    const root = wrapper.get('[data-cy=loading-state]');

    expect(root.attributes('role')).toBe('status');
    expect(root.text()).toBe('Carregando…');
  });

  it('aceita um texto próprio', () => {
    const wrapper = mountWithPlugins(BaseLoadingState, { props: { label: 'Buscando clientes' } });

    expect(wrapper.text()).toBe('Buscando clientes');
  });
});

describe('BaseEmptyState', () => {
  it('mostra título e ícone padrão, sem descrição nem ações', () => {
    const wrapper = mountWithPlugins(BaseEmptyState);

    expect(wrapper.get('[data-cy=empty-state-title]').text()).toBe('Nada por aqui');
    expect(wrapper.text()).toContain('inbox');
    expect(wrapper.findAll('p')).toHaveLength(1);
  });

  it('mostra título, descrição, ícone e as ações do slot', () => {
    const wrapper = mountWithPlugins(BaseEmptyState, {
      props: { title: 'Sem clientes', description: 'Cadastre o primeiro.', icon: 'group' },
      slots: { actions: () => h('button', { 'data-cy': 'action' }, 'Cadastrar') },
    });

    expect(wrapper.get('[data-cy=empty-state-title]').text()).toBe('Sem clientes');
    expect(wrapper.text()).toContain('Cadastre o primeiro.');
    expect(wrapper.text()).toContain('group');
    expect(wrapper.find('[data-cy=action]').exists()).toBe(true);
  });
});

describe('BaseErrorState', () => {
  it('mostra o título padrão e a mensagem, sem botão por padrão', () => {
    const wrapper = mountWithPlugins(BaseErrorState, { props: { message: 'Falha (HTTP 500)' } });

    expect(wrapper.text()).toContain('Não foi possível carregar');
    expect(wrapper.text()).toContain('Falha (HTTP 500)');
    expect(wrapper.find('[data-cy=error-state-retry]').exists()).toBe(false);
  });

  it('emite retry pelo botão quando retryable', async () => {
    const wrapper = mountWithPlugins(BaseErrorState, {
      props: { message: 'Falha', title: 'Erro ao buscar', retryable: true },
    });

    await wrapper.get('[data-cy=error-state-retry]').trigger('click');

    expect(wrapper.text()).toContain('Erro ao buscar');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });
});
