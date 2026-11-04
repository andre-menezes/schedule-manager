import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { VApp } from 'vuetify/components';
import WorkFlow from '@modules/showcase/components/WorkFlow.vue';
import type { ThemeName } from '@typings/theme';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const Empty = defineComponent({ render: () => h('div') });

const activity = [
  { title: 'Instalação', detail: 'pnpm install', icon: 'deployed_code', color: 'success' },
  { title: 'Build', detail: 'pnpm build', icon: 'build', color: 'accent' },
];

async function mountWorkFlow(theme: ThemeName = 'light') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Empty },
      { path: '/onboarding', component: Empty },
    ],
  });
  await router.push('/');
  // O tema vem do <v-app>, como no App.vue.
  const Host = defineComponent({
    render: () => h(VApp, { theme }, () => h(WorkFlow, { activity })),
  });
  return mountWithPlugins(Host, { global: { plugins: [router] } });
}

describe('WorkFlow', () => {
  it('lista cada atividade com título e comando', async () => {
    const wrapper = await mountWorkFlow();
    const rows = wrapper.findAll('.activity-row');

    expect(rows).toHaveLength(2);
    expect(rows[0]?.text()).toContain('Instalação');
    expect(rows[0]?.get('code').text()).toBe('pnpm install');
    expect(rows[1]?.get('code').text()).toBe('pnpm build');
  });

  it('leva ao onboarding pelo botão de chamada', async () => {
    const wrapper = await mountWorkFlow();
    const cta = wrapper.get('a.v-btn');

    expect(cta.text()).toContain('Ver onboarding');
    expect(cta.attributes('href')).toBe('/onboarding');
  });

  it('usa o gradiente do tema ativo', async () => {
    const light = await mountWorkFlow('light');
    const dark = await mountWorkFlow('dark');

    expect(light.get('.v-card').classes()).toContain('gradient-light');
    expect(dark.get('.v-card').classes()).toContain('gradient-dark');
  });
});
