import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';
import TheLocaleMenu from '@shared/ui/components/TheLocaleMenu.vue';

/** O conteúdo do v-menu é teleportado para o <body>. */
const option = (locale: string) =>
  document.body.querySelector<HTMLElement>(`[data-cy="locale-option-${locale}"]`);

let wrapper: VueWrapper | undefined;

async function openMenu(locale: 'pt-BR' | 'en-US') {
  wrapper = mountWithPlugins(TheLocaleMenu, { props: { locale }, attachTo: document.body });
  await wrapper.find('[data-cy="locale-menu-btn"]').trigger('click');
  await nextTick();
  return wrapper;
}

describe('TheLocaleMenu', () => {
  beforeEach(() => {
    // O posicionamento do v-menu escuta o `visualViewport`, que o happy-dom
    // não implementa.
    vi.stubGlobal('visualViewport', new EventTarget());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
  });

  it('o botão tem nome acessível traduzido e anuncia o menu', () => {
    wrapper = mountWithPlugins(TheLocaleMenu, { props: { locale: 'pt-BR' } });
    const button = wrapper.find('[data-cy="locale-menu-btn"]');

    expect(button.attributes('aria-label')).toBe('Alterar idioma');
    expect(button.attributes('aria-haspopup')).toBe('menu');
  });

  it('lista os idiomas pelo nome nativo, cada um com o próprio lang', async () => {
    await openMenu('pt-BR');

    expect(option('pt-BR')?.textContent).toContain('Português (Brasil)');
    expect(option('pt-BR')?.getAttribute('lang')).toBe('pt-BR');
    expect(option('en-US')?.textContent).toContain('English (US)');
    expect(option('en-US')?.getAttribute('lang')).toBe('en-US');
  });

  it('marca só o idioma ativo', async () => {
    await openMenu('en-US');

    expect(option('en-US')?.getAttribute('role')).toBe('menuitemradio');
    expect(option('en-US')?.getAttribute('aria-checked')).toBe('true');
    expect(option('en-US')?.querySelector('.v-icon')).not.toBeNull();
    expect(option('pt-BR')?.getAttribute('aria-checked')).toBe('false');
    expect(option('pt-BR')?.querySelector('.v-icon')).toBeNull();
  });

  it('emite changeLocale com o idioma escolhido', async () => {
    const menu = await openMenu('pt-BR');

    option('en-US')?.click();

    expect(menu.emitted('changeLocale')).toEqual([['en-US']]);
  });
});
