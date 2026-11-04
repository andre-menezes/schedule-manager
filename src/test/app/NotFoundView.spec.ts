import { describe, expect, it, vi } from 'vitest';
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

  it('volta para a página anterior', async () => {
    const wrapper = await mountNotFound();
    const router = wrapper.vm.$router;
    const back = vi.spyOn(router, 'back').mockImplementation(() => undefined);

    await wrapper.get('[data-cy="not-found-back"]').trigger('click');

    expect(back).toHaveBeenCalled();
  });
});
