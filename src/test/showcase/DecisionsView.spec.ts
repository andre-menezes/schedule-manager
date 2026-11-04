import { describe, expect, it } from 'vitest';
import DecisionsView from '@modules/showcase/views/DecisionsView.vue';
import { adrIndex } from '@modules/showcase/adr-index';
import type { AdrStatus } from '@modules/showcase/types';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const statusColors: Record<AdrStatus, string> = {
  Aceita: 'success',
  Proposta: 'info',
  Substituída: 'warning',
  Descontinuada: 'error',
};

describe('DecisionsView', () => {
  it('lista uma linha por ADR do repositório, com id e título', () => {
    const wrapper = mountWithPlugins(DecisionsView);
    const rows = wrapper.findAll('[data-cy=adr-table] tbody tr');

    expect(rows).toHaveLength(adrIndex.length);
    rows.forEach((row, index) => {
      expect(row.text()).toContain(adrIndex[index]?.id);
      expect(row.text()).toContain(adrIndex[index]?.title);
    });
  });

  it('pinta o status de cada ADR com a cor da legenda', () => {
    const wrapper = mountWithPlugins(DecisionsView);
    const statusChips = wrapper.findAll('[data-cy=adr-table] tbody tr td:last-child .v-chip');

    statusChips.forEach((chip, index) => {
      const adr = adrIndex[index];
      if (!adr) throw new Error(`ADR ausente na posição ${index}`);
      expect(chip.text()).toBe(adr.status);
      expect(chip.classes()).toContain(`text-${statusColors[adr.status]}`);
    });
  });

  it('explica cada status do ciclo de vida na legenda', () => {
    const wrapper = mountWithPlugins(DecisionsView);
    const legend = wrapper.get('#status');

    for (const [status, color] of Object.entries(statusColors)) {
      const chip = legend.findAll('.v-chip').find((candidate) => candidate.text() === status);
      expect(chip?.classes()).toContain(`text-${color}`);
    }
  });

  it('apresenta as quatro partes do formato MADR', () => {
    const wrapper = mountWithPlugins(DecisionsView);

    expect(wrapper.get('#formato').findAll('.v-card')).toHaveLength(4);
  });

  it('interpola o caminho das ADRs na descrição e no rodapé da tabela', () => {
    const wrapper = mountWithPlugins(DecisionsView);
    const paths = wrapper.findAll('code').map((code) => code.text());

    expect(paths.filter((path) => path === 'docs/decisions/')).toHaveLength(2);
    expect(paths).toContain('ADR-0014-...');
  });
});
