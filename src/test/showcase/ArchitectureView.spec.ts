import { describe, expect, it } from 'vitest';
import ArchitectureView from '@modules/showcase/views/ArchitectureView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

// Pastas de primeiro nível de `src/` (cada camada tem o próprio README).
const srcLayers = Object.keys(import.meta.glob('/src/*/README.md')).map(
  (path) => path.split('/')[2]
);
// Stores Pinia existentes em `shared/stores`.
const storeFiles = Object.keys(import.meta.glob('/src/shared/stores/*.store.ts')).map((path) =>
  path.replace('/src/shared/stores/', '').replace('.ts', '')
);

describe('ArchitectureView', () => {
  it('apresenta um cartão por camada, incluindo todas as pastas de src/', () => {
    const wrapper = mountWithPlugins(ArchitectureView);
    const layers = wrapper
      .findAll('[data-cy=layer-card] .v-card-title')
      .map((title) => title.text());

    expect(layers).toEqual(['app', 'modules', 'shared', 'core', 'types', 'test', 'e2e']);
    expect(srcLayers.filter((layer) => !layers.includes(layer ?? ''))).toEqual([]);
  });

  it('mostra uma regra de dependência por camada de src/', () => {
    const wrapper = mountWithPlugins(ArchitectureView);
    const ruleLayers = wrapper
      .findAll('#dependencias tbody tr')
      .map((row) => row.find('td').text());

    expect([...ruleLayers].sort()).toEqual([...srcLayers].sort());
  });

  it('a árvore de pastas cita todas as camadas de src/', () => {
    const wrapper = mountWithPlugins(ArchitectureView);
    const tree = wrapper.get('#estrutura pre').text();

    expect(
      srcLayers.filter(
        (layer) => !tree.includes(`├── ${layer}/`) && !tree.includes(`└── ${layer}/`)
      )
    ).toEqual([]);
  });

  it('lista na tabela de estado todas as stores de shared/stores', () => {
    const wrapper = mountWithPlugins(ArchitectureView);
    const stores = wrapper.findAll('#estado tbody tr .v-chip').map((chip) => chip.text());

    expect(stores).toEqual(storeFiles);
  });

  it('documenta os aliases de import apontando para pastas existentes', () => {
    const wrapper = mountWithPlugins(ArchitectureView);
    const aliases = wrapper.findAll('#convencoes tbody tr').map((row) => {
      const [name, target] = row.findAll('td').map((cell) => cell.text());
      return { name, target };
    });

    expect(aliases.map(({ name }) => name)).toEqual([
      '@',
      '@app',
      '@core',
      '@modules',
      '@shared',
      '@typings',
      '@test',
    ]);
    const unknownTargets = aliases.filter(
      ({ target }) => target !== 'src/' && !srcLayers.some((layer) => target === `src/${layer}/`)
    );
    expect(unknownTargets).toEqual([]);
  });

  it('mostra os quatro passos da inicialização e os exemplos de rota e HTTP', () => {
    const wrapper = mountWithPlugins(ArchitectureView);

    expect(wrapper.findAll('#inicializacao .v-timeline-item')).toHaveLength(4);
    expect(wrapper.get('#rotas').text()).toContain("meta: { layout: 'empty' }");
    expect(wrapper.get('#http').findAll('[data-cy=code-block]')).toHaveLength(2);
    expect(wrapper.get('#http').text()).toContain('useQuery');
  });
});
