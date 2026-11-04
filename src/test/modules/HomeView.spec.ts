import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import HomeView from '@modules/home/views/HomeView.vue';

const Empty = defineComponent({ render: () => h('div') });

async function mountHome(withDocs: boolean) {
  const routes: RouteRecordRaw[] = [{ path: '/', name: 'Home', component: HomeView }];
  // A rota DocsHome vem do módulo showcase, que o `template:clean` remove.
  if (withDocs) routes.push({ path: '/docs', name: 'DocsHome', component: Empty });

  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push('/');
  const wrapper = mountWithPlugins(HomeView, { global: { plugins: [router] } });
  await flushPromises();
  return wrapper;
}

describe('HomeView', () => {
  it('mostra o título de boas-vindas', async () => {
    const wrapper = await mountHome(false);

    expect(wrapper.find('[data-cy="home-title"]').text()).toBe('Bem-vindo ao Vue Template');
  });

  it('mostra o link para a documentação quando a rota DocsHome existe', async () => {
    const wrapper = await mountHome(true);
    const link = wrapper.find('[data-cy="home-docs-link"]');

    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/docs');
  });

  it('esconde o link para a documentação sem a rota DocsHome', async () => {
    const wrapper = await mountHome(false);

    expect(wrapper.find('[data-cy="home-docs-link"]').exists()).toBe(false);
  });
});
