import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VApp } from 'vuetify/components';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import { useAppStore } from '@shared/stores/app.store';
import TheAppHeader from '@shared/ui/components/TheAppHeader.vue';

/** Locale global do i18n dos testes, para voltar ao pt-BR depois de cada caso. */
let globalLocale: Ref<string> | undefined;

// O v-app-bar depende do layout do <v-app>.
const Host = defineComponent({
  emits: ['toggleNavigation'],
  setup(_, { emit }) {
    globalLocale = useI18n({ useScope: 'global' }).locale;
    return () =>
      h(VApp, () => h(TheAppHeader, { onToggleNavigation: () => emit('toggleNavigation') }));
  },
});

describe('TheAppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    // O posicionamento do v-menu escuta o `visualViewport`, que o happy-dom
    // não implementa.
    vi.stubGlobal('visualViewport', new EventTarget());
  });

  afterEach(() => {
    if (globalLocale) globalLocale.value = 'pt-BR';
    vi.unstubAllGlobals();
  });

  it('alterna o tema pelo botão do cabeçalho', async () => {
    const wrapper = mountWithPlugins(Host);
    const store = useAppStore();
    const button = () => wrapper.find('button[aria-label="Ativar tema escuro"]');
    expect(store.theme).toBe('light');

    await button().trigger('click');

    expect(store.theme).toBe('dark');
    expect(wrapper.find('button[aria-label="Ativar tema claro"]').exists()).toBe(true);
    expect(button().exists()).toBe(false);
  });

  it('emite toggleNavigation pelo ícone do menu', async () => {
    const wrapper = mountWithPlugins(Host);

    await wrapper.find('.v-app-bar-nav-icon').trigger('click');

    expect(wrapper.emitted('toggleNavigation')).toHaveLength(1);
  });

  it('troca o idioma pelo seletor e marca o idioma escolhido', async () => {
    const wrapper = mountWithPlugins(Host, { attachTo: document.body });
    const option = (locale: string) =>
      document.body.querySelector<HTMLElement>(`[data-cy="locale-option-${locale}"]`);

    await wrapper.find('[data-cy="locale-menu-btn"]').trigger('click');
    await nextTick();
    option('en-US')?.click();
    await nextTick();

    expect(globalLocale?.value).toBe('en-US');
    expect(wrapper.find('[data-cy="locale-menu-btn"]').attributes('aria-label')).toBe(
      'Change language'
    );
    expect(wrapper.find('button[aria-label="Switch to dark theme"]').exists()).toBe(true);
    expect(option('en-US')?.getAttribute('aria-checked')).toBe('true');
    expect(option('pt-BR')?.getAttribute('aria-checked')).toBe('false');

    wrapper.unmount();
  });
});
