import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import NotFoundView from '@app/views/NotFoundView.vue';

const Empty = defineComponent({ render: () => h('div') });

async function mountNotFound() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: Empty },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
    ],
  });
  await router.push('/rota-inexistente');
  const wrapper = mountWithPlugins(NotFoundView, { global: { plugins: [router] } });
  await flushPromises();
  return wrapper;
}

describe('NotFoundView', () => {
  it('mostra o título e a descrição da página 404', async () => {
    const wrapper = await mountNotFound();

    expect(wrapper.find('h1').text()).toBe('Página não encontrada');
    expect(wrapper.text()).toContain('Erro 404');
    expect(wrapper.text()).toContain('O endereço informado não aponta para uma página disponível.');
  });

  it('oferece um link de volta para o início', async () => {
    const wrapper = await mountNotFound();
    const backLink = wrapper.find('a[href="/"]');

    expect(backLink.exists()).toBe(true);
    expect(backLink.text()).toContain('Voltar para o início');
  });

  it('dá crédito à ilustração em link externo seguro', async () => {
    const wrapper = await mountNotFound();
    const credit = wrapper.find('a[href="https://storyset.com/web"]');

    expect(credit.attributes('target')).toBe('_blank');
    expect(credit.attributes('rel')).toContain('noopener');
  });
});
