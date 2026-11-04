import { describe, expect, it } from 'vitest';
import FlowSteps from '@modules/showcase/components/FlowSteps.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('FlowSteps', () => {
  it('exibe título e descrição de cada passo do fluxo', () => {
    const steps = [
      { order: 1, title: 'Bootstrap', description: 'Cria a instância Vue.', icon: 'play_arrow' },
      { order: 2, title: 'Plugins', description: 'Registra os plugins.', icon: 'extension' },
    ];

    const wrapper = mountWithPlugins(FlowSteps, { props: { steps } });

    expect(wrapper.text()).toContain('Bootstrap');
    expect(wrapper.text()).toContain('Cria a instância Vue.');
    expect(wrapper.text()).toContain('Plugins');
  });
});
