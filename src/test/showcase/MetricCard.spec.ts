import { describe, expect, it } from 'vitest';
import MetricCard from '@modules/showcase/components/MetricCard.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('MetricCard', () => {
  it('exibe rótulo, valor e detalhe da métrica, com o ícone na cor informada', () => {
    const wrapper = mountWithPlugins(MetricCard, {
      props: {
        metric: {
          label: 'Dependências',
          value: 42,
          detail: 'no package.json',
          icon: 'build',
          color: 'info',
        },
      },
    });

    expect(wrapper.text()).toContain('Dependências');
    expect(wrapper.get('strong').text()).toBe('42');
    expect(wrapper.text()).toContain('no package.json');
    expect(wrapper.get('.v-avatar').classes()).toContain('text-info');
  });
});
