import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { VApp } from 'vuetify/components';
import ComponentsView from '@modules/showcase/views/ComponentsView.vue';
import { createAppVuetify } from '@app/providers/vuetify';
import type { ThemeName } from '@typings/theme';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const themes = createAppVuetify().theme.themes.value;

// O tema da página vem do <v-app>, como no App.vue.
function mountComponents(theme: ThemeName = 'light') {
  const Host = defineComponent({ render: () => h(VApp, { theme }, () => h(ComponentsView)) });
  return mountWithPlugins(Host);
}

/** Pares `cor → hexadecimal` exibidos na paleta. */
function swatches(wrapper: ReturnType<typeof mountComponents>) {
  return wrapper.findAll('#tema .v-sheet').map((sheet) => {
    const [name, hex] = sheet.findAll('span').map((span) => span.text());
    return { name: name ?? '', hex: hex ?? '' };
  });
}

describe('ComponentsView', () => {
  it.each<ThemeName>(['light', 'dark'])('mostra o hexadecimal de cada cor no tema %s', (theme) => {
    const shown = swatches(mountComponents(theme));

    expect(shown.map(({ name }) => name)).toEqual([
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'error',
      'surface',
    ]);
    for (const { name, hex } of shown) {
      const expected: unknown = themes[theme]?.colors[name];
      expect(typeof expected).toBe('string');
      expect(hex.toLowerCase()).toBe(String(expected).toLowerCase());
    }
  });

  it('exibe o erro da API pelo mesmo helper de produção, com o detail do problem+json', () => {
    const wrapper = mountComponents();
    const alert = wrapper.get('#erro-api .v-alert');

    expect(alert.text()).toContain('Saldo insuficiente');
    expect(alert.text()).toContain('A conta não possui saldo para concluir a transferência.');
  });

  it('mostra o corpo problem+json do exemplo como JSON válido', () => {
    const wrapper = mountComponents();
    const json = wrapper
      .findAll('#erro-api [data-cy=code-block]')
      .find((block) => block.text().includes('problem+json'))
      ?.get('pre')
      .text();

    expect(JSON.parse(json ?? '')).toMatchObject({ status: 422, title: 'Saldo insuficiente' });
  });

  it('acompanha cada exemplo vivo do código de uso', () => {
    const wrapper = mountComponents();

    expect(wrapper.findAll('#botoes [data-cy=showcase-preview] .v-btn')).toHaveLength(5);
    expect(wrapper.findAll('#chips [data-cy=showcase-preview] .v-chip')).toHaveLength(4);
    expect(wrapper.findAll('#alertas [data-cy=showcase-preview] .v-alert')).toHaveLength(3);
    expect(wrapper.get('#cartoes [data-cy=showcase-preview]').find('.v-card').exists()).toBe(true);
    for (const anchor of ['botoes', 'chips', 'alertas', 'cartoes']) {
      expect(wrapper.get(`#${anchor} [data-cy=code-block]`).text()).not.toBe('');
    }
  });

  it('dá nome acessível ao botão só de ícone', () => {
    const wrapper = mountComponents();
    const iconButton = wrapper.findAll('#botoes [data-cy=showcase-preview] .v-btn').at(-1);

    expect(iconButton?.attributes('aria-label')).toBe('Favoritar');
  });
});
