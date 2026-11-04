import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { VApp, VSnackbar } from 'vuetify/components';
import { useNotificationStore } from '@shared/stores/notification.store';
import TheNotifications from '@shared/ui/components/TheNotifications.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

/** O conteúdo do v-snackbar é teleportado para o <body>. */
const inBody = (cy: string) => document.body.querySelector<HTMLElement>(`[data-cy="${cy}"]`);

let wrapper: VueWrapper | undefined;
let store: ReturnType<typeof useNotificationStore>;

async function mountNotifications() {
  const Host = defineComponent({
    setup() {
      store = useNotificationStore();
      return () => h(VApp, () => h(TheNotifications));
    },
  });
  wrapper = mountWithPlugins(Host, { attachTo: document.body });
  await nextTick();
  return wrapper;
}

describe('TheNotifications', () => {
  beforeEach(() => {
    vi.stubGlobal('visualViewport', new EventTarget());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
  });

  it('fica fechado sem notificações', async () => {
    const host = await mountNotifications();

    expect(host.findComponent(VSnackbar).props('modelValue')).toBe(false);
  });

  it('mostra a primeira da fila, com status para sucesso', async () => {
    const host = await mountNotifications();
    store.notify({ type: 'success', message: 'Maria foi cadastrada.' });
    await nextTick();
    await nextTick();

    const snackbar = host.findComponent(VSnackbar);
    expect(snackbar.props('modelValue')).toBe(true);
    expect(snackbar.props('timeout')).toBe(5000);
    expect(snackbar.findComponent({ name: 'VIcon' }).props('color')).toBe('success');
    expect(inBody('notification-message')?.textContent).toBe('Maria foi cadastrada.');
  });

  it('é anunciada ao leitor de tela', async () => {
    await mountNotifications();
    store.notify({ type: 'error', message: 'Falhou' });
    await nextTick();
    await nextTick();

    const content = document.body.querySelector('.v-snackbar__content');
    expect(content?.getAttribute('role')).toBe('status');
    expect(content?.textContent).toContain('Falhou');
  });

  it('fechar passa para a próxima notificação', async () => {
    await mountNotifications();
    store.notify({ type: 'success', message: 'Primeira' });
    store.notify({ type: 'info', message: 'Segunda' });
    await nextTick();
    await nextTick();

    inBody('notification-close')?.click();
    await nextTick();
    await nextTick();

    expect(store.queue.map(({ message }) => message)).toEqual(['Segunda']);
    expect(inBody('notification-message')?.textContent).toBe('Segunda');
  });

  it('ao expirar, tira a notificação da fila', async () => {
    const host = await mountNotifications();
    store.notify({ type: 'warning', message: 'Atenção' });
    await nextTick();

    host.findComponent(VSnackbar).vm.$emit('update:modelValue', false);

    expect(store.queue).toEqual([]);
  });

  it('ignora o fechamento sem notificação na tela', async () => {
    const host = await mountNotifications();

    host.findComponent(VSnackbar).vm.$emit('update:modelValue', false);

    expect(store.queue).toEqual([]);
  });
});
