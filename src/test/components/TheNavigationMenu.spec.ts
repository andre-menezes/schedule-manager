import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { VApp, VNavigationDrawer } from 'vuetify/components';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import TheNavigationMenu from '@shared/ui/components/TheNavigationMenu.vue';

const Empty = defineComponent({ render: () => null });

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/decisoes',
        component: Empty,
        // Chaves do locale base do app.
        meta: { nav: { titleKey: 'notFound.title', icon: 'gavel', order: 60 } },
      },
      {
        path: '/',
        component: Empty,
        meta: { nav: { titleKey: 'nav.home', icon: 'dashboard', order: 10 } },
      },
      { path: '/sem-menu', component: Empty },
    ],
  });
}

// O v-navigation-drawer depende do layout do <v-app>.
function hostWith(modelValue: boolean) {
  return defineComponent({
    render: () => h(VApp, () => h(TheNavigationMenu, { modelValue })),
  });
}
const Host = hostWith(true);

async function mountMenu(modelValue: boolean) {
  const router = createTestRouter();
  await router.push('/');
  return mountWithPlugins(hostWith(modelValue), { global: { plugins: [router] } });
}

describe('TheNavigationMenu', () => {
  it('lista só as rotas com meta.nav, na ordem de meta.nav.order', async () => {
    const router = createTestRouter();
    await router.push('/');
    const wrapper = mountWithPlugins(Host, { global: { plugins: [router] } });

    const titles = wrapper.findAll('.v-list-item-title').map((item) => item.text());

    expect(titles).toEqual(['Início', 'Página não encontrada']);
  });

  it('mostra a versão do app no rodapé do menu', async () => {
    const wrapper = await mountMenu(true);

    expect(wrapper.get('.navigation-status').text()).toContain(__APP_META__.version);
  });

  it('no desktop, recolhe para o modo rail em vez de esconder quando fechado', async () => {
    const open = await mountMenu(true);
    const closed = await mountMenu(false);

    expect(open.get('.v-navigation-drawer').classes()).not.toContain('v-navigation-drawer--rail');
    expect(closed.get('.v-navigation-drawer').classes()).toContain('v-navigation-drawer--rail');
  });

  it('repassa ao pai o pedido do drawer para abrir ou fechar (v-model)', async () => {
    const wrapper = await mountMenu(true);

    wrapper.findComponent(VNavigationDrawer).vm.$emit('update:modelValue', false);

    expect(wrapper.findComponent(TheNavigationMenu).emitted('update:modelValue')).toEqual([
      [false],
    ]);
  });
});
