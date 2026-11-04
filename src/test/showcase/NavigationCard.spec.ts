import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import NavigationCard from '@modules/showcase/components/NavigationCard.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const Empty = defineComponent({ render: () => h('div') });

async function mountCard() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Empty },
      { path: '/arquitetura', component: Empty },
    ],
  });
  await router.push('/');
  const wrapper = mountWithPlugins(NavigationCard, {
    props: {
      card: {
        title: 'Arquitetura',
        description: 'Camadas e regras de dependência',
        icon: 'account_tree',
        color: 'primary',
        route: '/arquitetura',
      },
    },
    global: { plugins: [router] },
  });
  return { wrapper, router };
}

describe('NavigationCard', () => {
  it('exibe título, descrição e a chamada traduzida', async () => {
    const { wrapper } = await mountCard();

    expect(wrapper.text()).toContain('Arquitetura');
    expect(wrapper.text()).toContain('Camadas e regras de dependência');
    expect(wrapper.text()).toContain('Acessar');
  });

  it('é um link para a rota do cartão', async () => {
    const { wrapper } = await mountCard();
    const card = wrapper.get('[data-cy=nav-card]');

    expect(card.element.tagName).toBe('A');
    expect(card.attributes('href')).toBe('/arquitetura');
    expect(card.attributes('data-cy-route')).toBe('/arquitetura');
  });

  it('navega para a rota ao ser clicado', async () => {
    const { wrapper, router } = await mountCard();

    await wrapper.get('[data-cy=nav-card]').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.path).toBe('/arquitetura');
  });
});
