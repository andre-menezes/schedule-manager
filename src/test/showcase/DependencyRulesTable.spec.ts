import { describe, expect, it } from 'vitest';
import DependencyRulesTable from '@modules/showcase/components/DependencyRulesTable.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

describe('DependencyRulesTable', () => {
  it('renderiza uma linha por regra de dependência', () => {
    const rules = [
      { layer: 'app', canImport: 'shared, types', cannotImport: 'modules' },
      { layer: 'shared', canImport: 'types', cannotImport: 'app, modules' },
    ];

    const wrapper = mountWithPlugins(DependencyRulesTable, { props: { rules } });

    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    expect(wrapper.text()).toContain('app');
    expect(wrapper.text()).toContain('shared, types');
    expect(wrapper.text()).toContain('modules');
  });
});
