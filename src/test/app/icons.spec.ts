import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import type { IconProps } from 'vuetify';
import { VIcon } from 'vuetify/components';
import { ms } from '@app/providers/icons';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

/** Renderiza o componente do icon set diretamente, com as props do VIcon. */
function renderSet(props: IconProps & Record<string, unknown>) {
  const Probe = defineComponent({ render: () => h(ms.component, props) });
  return mount(Probe);
}

describe('icon set Material Symbols', () => {
  it('renderiza a ligatura do ícone no contorno padrão', () => {
    const wrapper = mountWithPlugins(VIcon, { props: { icon: 'settings' } });

    expect(wrapper.text()).toBe('settings');
    expect(wrapper.classes()).toContain('material-symbols-outlined');
    expect(wrapper.classes()).not.toContain('ms-fill');
  });

  it('o sufixo -fill ativa a variante preenchida e sai da ligatura', () => {
    const wrapper = mountWithPlugins(VIcon, { props: { icon: 'favorite-fill' } });

    expect(wrapper.text()).toBe('favorite');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['material-symbols-outlined', 'ms-fill'])
    );
  });

  it('preserva as classes e atributos repassados pelo VIcon', () => {
    const wrapper = mountWithPlugins(VIcon, {
      props: { icon: 'home', color: 'primary', size: 'small' },
      attrs: { 'aria-label': 'Início' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['material-symbols-outlined', 'v-icon', 'text-primary'])
    );
    expect(wrapper.attributes('aria-label')).toBe('Início');
  });

  it('renderiza vazio, sem o texto "undefined", quando não recebe ícone', () => {
    const wrapper = renderSet({ tag: 'i' });

    expect(wrapper.find('i.material-symbols-outlined').exists()).toBe(true);
    expect(wrapper.text()).toBe('');
  });
});
