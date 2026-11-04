import { describe, expect, it } from 'vitest';
import { validateCommitMessage } from './verify-commit-msg.mjs';

const TRAILERS = [
  'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
  'Claude-Session: https://claude.ai/code/session_01Pd52P9mSSfQqviEz6hmzFf',
].join('\n');

function message(...lines) {
  return `${lines.join('\n')}\n`;
}

describe('validateCommitMessage', () => {
  it('aceita só o título', () => {
    expect(validateCommitMessage(message('feat(auth): implementar refresh de token'))).toEqual([]);
  });

  it('aceita título, corpo em 72 colunas e trailers', () => {
    const raw = message(
      'docs(agent): restaurar os adapters do Kiro',
      '',
      'O corpo explica o porquê da mudança e respeita o limite de 72 colunas.',
      '',
      TRAILERS
    );

    expect(validateCommitMessage(raw)).toEqual([]);
  });

  it('rejeita mensagem vazia ou só com comentários', () => {
    expect(validateCommitMessage(message('# comentário do git', ''))).toEqual([
      'A mensagem de commit está vazia.',
    ]);
  });

  it('aceita merge e revert automáticos sem validar o formato', () => {
    expect(validateCommitMessage(message("Merge branch 'develop' into feat/x"))).toEqual([]);
    expect(validateCommitMessage(message('Revert "feat: algo"', 'sem linha em branco'))).toEqual(
      []
    );
  });

  it('rejeita título fora do padrão, longo demais ou com ponto final', () => {
    expect(validateCommitMessage(message('corrigir bug no login'))).toHaveLength(1);
    expect(validateCommitMessage(message(`feat: ${'a'.repeat(70)}`))[0]).toContain('76 caracteres');
    expect(validateCommitMessage(message('fix(router): corrigir redirecionamento.'))).toEqual([
      'A descrição não deve terminar com ponto final.',
    ]);
  });

  it('exige linha em branco entre o título e o corpo', () => {
    const raw = message('fix(http): corrigir header', 'Corpo colado no título.');

    expect(validateCommitMessage(raw)).toEqual([
      'Deixe uma linha em branco entre o título e o corpo.',
    ]);
  });

  it('rejeita linha do corpo com mais de 72 colunas e informa qual é', () => {
    const longLine = 'x '.repeat(37).trim(); // 73 caracteres
    const raw = message('fix: corrigir algo', '', 'linha curta', longLine);

    const errors = validateCommitMessage(raw);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('linha 4 do corpo tem 73 caracteres');
  });

  it('ignora comentários do git e o diff após a linha de corte', () => {
    const raw = message(
      'fix: corrigir algo',
      '',
      '# Please enter the commit message for your changes. Lines starting with # are ignored.',
      'Corpo curto.',
      '# ------------------------ >8 ------------------------',
      `+ ${'código do diff '.repeat(10)}`
    );

    expect(validateCommitMessage(raw)).toEqual([]);
  });

  it('isenta trailers longos só no último parágrafo', () => {
    const longTrailer = `Claude-Session: https://claude.ai/code/${'a'.repeat(60)}`;

    expect(validateCommitMessage(message('fix: corrigir algo', '', longTrailer))).toEqual([]);

    const notTrailer = `Nota: ${'texto comum que deveria ter sido quebrado '.repeat(2)}`;
    expect(
      validateCommitMessage(message('fix: corrigir algo', '', notTrailer, '', TRAILERS))
    ).toHaveLength(1);
  });

  it('isenta URL longa sozinha na linha, com ou sem marcador', () => {
    const url = `https://example.com/${'caminho/'.repeat(10)}`;
    const raw = message('docs: citar referência', '', 'Veja:', url, `- ${url}`, `[1]: ${url}`);

    expect(validateCommitMessage(raw)).toEqual([]);
  });

  it('não isenta linha longa que tem texto além da URL', () => {
    const raw = message(
      'docs: citar referência',
      '',
      `Veja a documentação em https://example.com/${'caminho/'.repeat(8)} para detalhes`
    );

    expect(validateCommitMessage(raw)).toHaveLength(1);
  });

  it('aceita quebras de linha CRLF e espaços no fim da linha', () => {
    const raw = 'fix: corrigir algo   \r\n\r\nCorpo curto.\r\n';

    expect(validateCommitMessage(raw)).toEqual([]);
  });
});
