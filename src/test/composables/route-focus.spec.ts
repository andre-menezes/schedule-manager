import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import { MAIN_CONTENT_ID } from '@core/config';
import { useRouteFocus } from '@shared/composables';

const Page = defineComponent({ render: () => h('p', 'conteúdo') });

const Host = defineComponent({
  setup() {
    useRouteFocus();
    return () => h('main', { id: MAIN_CONTENT_ID, tabindex: -1 }, [h(RouterView)]);
  },
});

let wrapper: VueWrapper | undefined;

async function mountHost(path: string) {
  const history = createMemoryHistory();
  history.replace(path);
  const router = createRouter({
    history,
    routes: [
      { path: '/', component: Page },
      { path: '/sobre', component: Page },
    ],
  });
  // Como no app: o hook já está registrado quando a navegação inicial termina.
  wrapper = mount(Host, { global: { plugins: [router] }, attachTo: document.body });
  await router.isReady();
  await flushPromises();
  return router;
}

const main = () => document.getElementById(MAIN_CONTENT_ID);

describe('useRouteFocus', () => {
  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('não move o foco no carregamento inicial', async () => {
    // Fora de `/`, que é o path do START_LOCATION do router.
    await mountHost('/sobre');

    expect(document.activeElement).not.toBe(main());
  });

  it('move o foco para o conteúdo principal após navegar', async () => {
    const router = await mountHost('/');

    await router.push('/sobre');
    await flushPromises();

    expect(document.activeElement).toBe(main());
  });

  it('não move o foco quando muda só o hash da mesma página', async () => {
    const router = await mountHost('/sobre');

    await router.push('/sobre#secao');
    await flushPromises();

    expect(document.activeElement).not.toBe(main());
  });

  it('para de mover o foco depois que a raiz é desmontada', async () => {
    const router = await mountHost('/');
    wrapper?.unmount();
    wrapper = undefined;
    const target = document.createElement('main');
    target.id = MAIN_CONTENT_ID;
    target.tabIndex = -1;
    document.body.append(target);

    await router.push('/sobre');
    await flushPromises();

    expect(document.activeElement).not.toBe(target);
    target.remove();
  });
});
