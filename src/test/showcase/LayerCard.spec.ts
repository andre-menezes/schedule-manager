import { describe, expect, it } from 'vitest';
import LayerCard from '@modules/showcase/components/LayerCard.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('LayerCard', () => {
  it('exibe o nome e a descrição da camada', () => {
    const wrapper = mountWithPlugins(LayerCard, {
      props: {
        layer: {
          name: 'shared',
          description: 'Infraestrutura transversal reutilizável.',
          icon: 'hub',
          color: 'accent',
        },
      },
    });

    expect(wrapper.text()).toContain('shared');
    expect(wrapper.text()).toContain('Infraestrutura transversal reutilizável.');
  });
});
