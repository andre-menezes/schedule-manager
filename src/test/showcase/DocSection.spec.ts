import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import DocSection from '@modules/showcase/components/DocSection.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('DocSection', () => {
  it('exibe título, descrição, ícone e o conteúdo do slot, com a âncora no id', () => {
    const wrapper = mountWithPlugins(DocSection, {
      props: {
        title: 'Camadas',
        description: 'Como o código se organiza',
        icon: 'layers',
        anchor: 'camadas',
      },
      slots: { default: () => h('p', { 'data-cy': 'conteudo' }, 'conteúdo da seção') },
    });

    const section = wrapper.get('[data-cy=doc-section]');
    expect(section.attributes('id')).toBe('camadas');
    expect(wrapper.get('[data-cy=doc-section-title]').text()).toBe('Camadas');
    expect(wrapper.text()).toContain('Como o código se organiza');
    expect(wrapper.find('.v-avatar .v-icon').exists()).toBe(true);
    expect(wrapper.get('[data-cy=conteudo]').text()).toBe('conteúdo da seção');
  });

  it('omite ícone, descrição e id quando não informados', () => {
    const wrapper = mountWithPlugins(DocSection, { props: { title: 'Só o título' } });

    expect(wrapper.get('[data-cy=doc-section]').attributes('id')).toBeUndefined();
    expect(wrapper.find('.v-avatar').exists()).toBe(false);
    expect(wrapper.find('p').exists()).toBe(false);
  });
});
