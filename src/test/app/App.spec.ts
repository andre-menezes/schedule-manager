import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { useAppStore } from '@shared/stores/app.store';
import App from '@app/App.vue';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';

const Page = defineComponent({ render: () => h('p', { 'data-cy': 'page' }, 'conteúdo') });

async function mountAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: Page },
      { path: '/vazia', name: 'Empty', component: Page, meta: { layout: 'empty' } },
    ],
  });
  await router.push(path);

  const wrapper = mountWithPlugins(App, {
    global: {
      plugins: [router],
      // Os layouts são testados à parte; aqui importa qual deles o App escolhe.
      stubs: {
        DefaultLayout: { template: '<div data-cy="default-layout"><slot /></div>' },
        EmptyLayout: { template: '<div data-cy="empty-layout"><slot /></div>' },
      },
    },
  });
  await flushPromises();
  return wrapper;
}

describe('App', () => {
  it('usa o DefaultLayout quando a rota não define layout', async () => {
    const wrapper = await mountAt('/');

    expect(wrapper.findComponent(DefaultLayout).exists()).toBe(true);
    expect(wrapper.findComponent(EmptyLayout).exists()).toBe(false);
    expect(wrapper.find('[data-cy="page"]').exists()).toBe(true);
  });

  it("usa o EmptyLayout quando a rota define meta.layout = 'empty'", async () => {
    const wrapper = await mountAt('/vazia');

    expect(wrapper.findComponent(EmptyLayout).exists()).toBe(true);
    expect(wrapper.findComponent(DefaultLayout).exists()).toBe(false);
  });

  it('aplica o tema da store ao v-app', async () => {
    const wrapper = await mountAt('/');
    const store = useAppStore();

    store.switchTheme();
    await flushPromises();

    expect(wrapper.find('.v-application').classes()).toContain(`v-theme--${store.theme}`);
  });
});
