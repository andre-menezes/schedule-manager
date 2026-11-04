import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { formatDocumentTitle, useRouteTitle } from '@shared/composables';

const Page = defineComponent({ render: () => null });

const Host = defineComponent({
  setup() {
    useRouteTitle('App Teste');
    return () => h(RouterView);
  },
});

async function mountHost(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Page, meta: { titleKey: 'pageTitle.home' } },
      { path: '/sobre', component: Page, meta: { titleKey: 'pageTitle.about' } },
      { path: '/sem-titulo', component: Page },
    ],
  });
  const i18n = createI18n({
    legacy: false,
    locale: 'pt-BR',
    messages: {
      'pt-BR': { pageTitle: { home: 'Início', about: 'Sobre' } },
      en: { pageTitle: { home: 'Home', about: 'About' } },
    },
  });
  await router.push(path);
  const wrapper = mount(Host, { global: { plugins: [router, i18n] } });
  await flushPromises();
  return { wrapper, router, i18n };
}

describe('formatDocumentTitle', () => {
  it('junta o título da página e o nome da aplicação', () => {
    expect(formatDocumentTitle('Início', 'Vue Template')).toBe('Início · Vue Template');
  });

  it('usa só o nome da aplicação quando não há título', () => {
    expect(formatDocumentTitle(undefined, 'Vue Template')).toBe('Vue Template');
    expect(formatDocumentTitle('', 'Vue Template')).toBe('Vue Template');
  });
});

describe('useRouteTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('aplica o título traduzido da rota atual', async () => {
    await mountHost('/');

    expect(document.title).toBe('Início · App Teste');
  });

  it('atualiza o título a cada navegação', async () => {
    const { router } = await mountHost('/');

    await router.push('/sobre');
    await flushPromises();

    expect(document.title).toBe('Sobre · App Teste');
  });

  it('usa só o nome da aplicação em rota sem titleKey', async () => {
    await mountHost('/sem-titulo');

    expect(document.title).toBe('App Teste');
  });

  it('traduz de novo o título quando o idioma muda', async () => {
    const { i18n } = await mountHost('/sobre');

    i18n.global.locale.value = 'en';
    await flushPromises();

    expect(document.title).toBe('About · App Teste');
  });
});
