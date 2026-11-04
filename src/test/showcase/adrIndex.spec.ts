import { describe, expect, it } from 'vitest';
import { adrIndex, buildAdrIndex, parseAdr } from '@modules/showcase/adr-index';

const sample = `# ADR-0002: Camada HTTP via factory \`createApiInstance\` + ofetch

- **Status:** Aceita
- **Data:** 2026-08-28
`;

describe('parseAdr', () => {
  it('extrai id, título (sem marcação de código) e status', () => {
    expect(parseAdr('ADR-0002-camada-http.md', sample)).toEqual({
      id: 'ADR-0002',
      title: 'Camada HTTP via factory createApiInstance + ofetch',
      status: 'Aceita',
      file: 'ADR-0002-camada-http.md',
    });
  });

  it('descarta arquivo fora do formato ou com status desconhecido', () => {
    expect(parseAdr('x.md', '# Sem cabeçalho de ADR')).toBeNull();
    expect(parseAdr('x.md', sample.replace('Aceita', 'Rascunho'))).toBeNull();
  });
});

describe('buildAdrIndex', () => {
  it('ignora o template e ordena por id', () => {
    const index = buildAdrIndex({
      '/docs/decisions/ADR-0002-b.md': sample,
      '/docs/decisions/ADR-0000-template.md': sample.replace('0002', '0000'),
      '/docs/decisions/ADR-0001-a.md': sample.replace('0002', '0001'),
    });

    expect(index.map((adr) => adr.id)).toEqual(['ADR-0001', 'ADR-0002']);
  });
});

describe('adrIndex (docs/decisions)', () => {
  it('lista todas as ADRs do repositório, exceto o template', () => {
    // Glob amplo (sem carregar conteúdo): detecta ADR descartada pelo parser.
    const files = Object.keys(import.meta.glob('/docs/decisions/*.md'))
      .map((path) => path.split('/').pop() as string)
      .filter((file) => file.startsWith('ADR-') && file !== 'ADR-0000-template.md');

    expect(adrIndex.map((adr) => adr.file).sort()).toEqual(files.sort());
  });
});
