import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import ShowcaseCard from '@modules/showcase/components/ShowcaseCard.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('ShowcaseCard', () => {
  it('exibe título, descrição e o código de uso', () => {
    const wrapper = mountWithPlugins(ShowcaseCard, {
      props: {
        title: 'Botão primário',
        description: 'Exemplo de botão do tema',
        code: '<v-btn color="primary">Ação</v-btn>',
        language: 'vue',
      },
    });

    expect(wrapper.text()).toContain('Botão primário');
    expect(wrapper.text()).toContain('Exemplo de botão do tema');
    expect(wrapper.text()).toContain('<v-btn color="primary">Ação</v-btn>');
  });

  it('renderiza o conteúdo do slot de preview', () => {
    const wrapper = mountWithPlugins(ShowcaseCard, {
      props: { title: 'Exemplo', code: 'x' },
      slots: { preview: () => h('span', { 'data-cy': 'demo' }, 'conteúdo vivo') },
    });

    const preview = wrapper.get('[data-cy=showcase-preview]');
    expect(preview.text()).toContain('conteúdo vivo');
  });
});
