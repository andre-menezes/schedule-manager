import { describe, expect, it } from 'vitest';
import ConventionsView from '@modules/showcase/views/ConventionsView.vue';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const docs = import.meta.glob<string>(['/docs/COMMIT-CONVENTIONS.md', '/CONTRIBUTING.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Primeira coluna (entre crases) das linhas da tabela que segue `heading`. */
function tableColumn(file: string, heading: string, column = 0): string[] {
  const content = docs[file] ?? '';
  const section = content.slice(content.indexOf(heading));
  const table = section.slice(0, section.indexOf('\n\n', section.indexOf('|')));
  return table
    .split('\n')
    .filter((line) => line.startsWith('|') && line.includes('`'))
    .map((line) => line.split('|')[column + 1]?.trim().replace(/`/g, '') ?? '');
}

const docTypes = tableColumn('/docs/COMMIT-CONVENTIONS.md', '## Tipos');
const docScopes = tableColumn('/docs/COMMIT-CONVENTIONS.md', '## Escopos');
const docBranchExamples = tableColumn('/CONTRIBUTING.md', '## Convenção de branches', 2);

describe('ConventionsView', () => {
  it('os exemplos de branch são os mesmos do CONTRIBUTING.md', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const examples = wrapper
      .findAll('#branches tbody tr')
      .map((row) => row.findAll('code')[0]?.text());

    expect(docBranchExamples).not.toEqual([]);
    expect(examples).toEqual(docBranchExamples);
  });

  it('o mau exemplo de cada branch não segue o padrão prefixo/slug', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const rows = wrapper.findAll('#branches tbody tr').map((row) => {
      const [, bad] = row.findAll('code').map((code) => code.text());
      return { prefix: row.get('.v-chip').text(), bad: bad ?? '' };
    });

    const followPattern = rows.filter(({ prefix, bad }) =>
      new RegExp(`^${prefix}/[a-z0-9]+(-[a-z0-9]+)*$`, 'i').test(bad)
    );
    expect(followPattern).toEqual([]);
  });

  it('lista todos os tipos de commit documentados (os aceitos pelo hook commit-msg)', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const types = wrapper.findAll('#tipos tbody tr .v-chip').map((chip) => chip.text());

    expect(docTypes).toContain('wip');
    expect(types).toEqual(docTypes);
  });

  it('os escopos exibidos existem em docs/COMMIT-CONVENTIONS.md', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const scopes = wrapper.findAll('#escopos .v-chip .font-weight-bold').map((s) => s.text());

    expect(scopes.length).toBeGreaterThan(0);
    expect(scopes.filter((scope) => !docScopes.includes(scope))).toEqual([]);
  });

  it('os bons exemplos de commit seguem o formato tipo(escopo): descrição', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const good = wrapper.findAll('#exemplos [data-cy=code-block] pre')[0]?.text().split('\n');
    const header = new RegExp(`^(${docTypes.join('|')})(\\([a-z0-9-]+\\))?!?: .+[^.]$`);

    expect(good?.length).toBeGreaterThan(0);
    expect(good?.filter((line) => !header.test(line) || line.length > 72)).toEqual([]);
  });

  it('marca cada item do checklist de review como bloqueante ou sugestão', async () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const panels = wrapper.findAll('[data-cy=review-checklist] .v-expansion-panel');
    expect(panels).toHaveLength(6);

    // Arquitetura: quatro itens bloqueantes e uma sugestão.
    await panels[0]?.get('.v-expansion-panel-title').trigger('click');
    const icons = panels[0]?.findAll('.v-list-item .v-icon').map((icon) => icon.text());

    expect(icons).toEqual(['block', 'block', 'block', 'block', 'lightbulb']);
    expect(panels[0]?.findAll('.v-list-item .text-error')).toHaveLength(4);
    expect(panels[0]?.findAll('.v-list-item .text-info')).toHaveLength(1);
  });

  it('apresenta os princípios de referência', () => {
    const wrapper = mountWithPlugins(ConventionsView);
    const principles = wrapper.findAll('#principios .v-card-title').map((title) => title.text());

    expect(principles).toEqual(['SRP', 'DRY', 'KISS', 'Separation of Concerns', 'Fail Fast']);
  });
});
