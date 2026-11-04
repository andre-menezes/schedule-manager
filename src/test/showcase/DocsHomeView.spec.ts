import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import DocsHomeView from '@modules/showcase/views/DocsHomeView.vue';
import showcaseRoutes from '@modules/showcase/routes';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

async function mountDocsHome() {
  const router = createRouter({ history: createMemoryHistory(), routes: showcaseRoutes });
  await router.push('/docs');
  const wrapper = mountWithPlugins(DocsHomeView, { global: { plugins: [router] } });
  await flushPromises();
  return wrapper;
}

describe('DocsHomeView', () => {
  it('mostra as contagens de dependências do package.json', async () => {
    const wrapper = await mountDocsHome();
    const { runtimeDependencies, toolingDependencies } = __APP_META__;

    const values = wrapper.findAll('.v-card strong').map((value) => value.text());

    expect(values).toEqual([
      String(runtimeDependencies + toolingDependencies),
      String(runtimeDependencies),
      String(toolingDependencies),
      'CI',
    ]);
  });

  it('tem um cartão de navegação para cada tela da documentação', async () => {
    const wrapper = await mountDocsHome();
    const cardRoutes = wrapper
      .findAll('[data-cy=nav-card]')
      .map((card) => card.attributes('data-cy-route'));
    const docsPages = showcaseRoutes
      .filter((route) => route.name !== 'DocsHome')
      .map((route) => route.path);

    expect(cardRoutes).toEqual(docsPages);
  });

  it('lista os comandos do fluxo de trabalho', async () => {
    const wrapper = await mountDocsHome();
    const commands = wrapper.findAll('.activity-row code').map((code) => code.text());

    expect(commands).toEqual([
      'pnpm install',
      'pnpm dev',
      'pnpm lint',
      'pnpm test',
      'pnpm test:e2e',
      'pnpm build',
    ]);
  });
});
