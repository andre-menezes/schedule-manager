// Validador de mensagem de commit (Conventional Commits em português).
// Referência: docs/COMMIT-CONVENTIONS.md
// Uso: node scripts/verify-commit-msg.mjs <caminho-do-arquivo-da-mensagem>
//
// A regra fica em `validateCommitMessage`, exportada para os testes
// (`scripts/verify-commit-msg.spec.mjs`); a execução pelo hook só lê o arquivo,
// imprime os erros e define o código de saída.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const TYPES = [
  'feat',
  'fix',
  'docs',
  'refactor',
  'test',
  'chore',
  'style',
  'perf',
  'ci',
  'revert',
  'build',
  'wip',
];

export const MAX_HEADER_LENGTH = 72;
export const MAX_BODY_LINE_LENGTH = 72;

// Formato: tipo(escopo opcional)!: descrição
// Ex.: feat(auth): implementar refresh de token
const PATTERN = new RegExp(`^(${TYPES.join('|')})(\\([a-z0-9-]+\\))?!?: .+`);

// Linha de corte do `git commit --verbose`: o que vem depois é o diff.
const SCISSORS = /^# -+ >8 -+$/;

// Trailer do Git (`Co-Authored-By: ...`, `Claude-Session: ...`).
const TRAILER = /^[A-Za-z][A-Za-z0-9]*(-[A-Za-z0-9]+)*: \S/;

// Marcador opcional antes de uma URL sozinha na linha: `-`, `*`, `1.` ou `[1]`.
const URL_ONLY_LINE = /^\s*(?:[-*]|\d+\.|\[\d+\]:?)?\s*\S*:\/\/\S+$/;

/**
 * Remove os comentários (linhas iniciadas por `#`), o diff do `--verbose` e as
 * linhas em branco das pontas, como o Git faz ao gravar a mensagem.
 *
 * @param {string} raw conteúdo do arquivo de mensagem
 * @returns {string[]} linhas da mensagem
 */
function cleanLines(raw) {
  const lines = [];
  for (const line of raw.replace(/\r\n/g, '\n').split('\n')) {
    if (SCISSORS.test(line)) break;
    if (line.startsWith('#')) continue;
    lines.push(line.replace(/\s+$/, ''));
  }
  while (lines.length > 0 && lines[0] === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Índice da primeira linha do último parágrafo, onde o Git procura trailers.
 *
 * @param {string[]} lines linhas da mensagem
 * @returns {number}
 */
function lastParagraphStart(lines) {
  const lastBlank = lines.lastIndexOf('');
  return lastBlank === -1 ? lines.length : lastBlank + 1;
}

/**
 * Valida uma mensagem de commit.
 *
 * @param {string} raw conteúdo do arquivo de mensagem (com comentários do Git)
 * @returns {string[]} erros encontrados; vazio quando a mensagem é válida
 */
export function validateCommitMessage(raw) {
  const lines = cleanLines(raw);
  const [header] = lines;

  if (!header) {
    return ['A mensagem de commit está vazia.'];
  }

  // Permite mensagens geradas por merge/revert automáticos do Git.
  if (/^(Merge|Revert)\b/.test(header)) {
    return [];
  }

  const errors = [];

  if (header.length > MAX_HEADER_LENGTH) {
    errors.push(
      `A primeira linha tem ${header.length} caracteres (máximo ${MAX_HEADER_LENGTH}).\n` +
        `Linha: "${header}"`
    );
  }

  if (!PATTERN.test(header)) {
    errors.push(`A mensagem não segue o padrão Conventional Commits.\nLinha: "${header}"`);
  }

  if (/\.\s*$/.test(header)) {
    errors.push('A descrição não deve terminar com ponto final.');
  }

  if (lines.length > 1 && lines[1] !== '') {
    errors.push('Deixe uma linha em branco entre o título e o corpo.');
  }

  const trailersStart = lastParagraphStart(lines);
  lines.forEach((line, index) => {
    if (index < 2 || line.length <= MAX_BODY_LINE_LENGTH) return;
    if (index >= trailersStart && TRAILER.test(line)) return;
    if (URL_ONLY_LINE.test(line)) return;
    errors.push(
      `A linha ${index + 1} do corpo tem ${line.length} caracteres ` +
        `(máximo ${MAX_BODY_LINE_LENGTH}).\nLinha: "${line}"`
    );
  });

  return errors;
}

function report(errors) {
  console.error('\n\x1b[31m✖ Commit rejeitado\x1b[0m');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nFormato esperado:');
  console.error('  tipo(escopo): descrição em português');
  console.error('  <linha em branco>');
  console.error(`  corpo opcional, quebrado em ${MAX_BODY_LINE_LENGTH} colunas`);
  console.error(`Tipos válidos: ${TYPES.join(', ')}`);
  console.error('Exemplos:');
  console.error('  feat(auth): implementar refresh automático de token');
  console.error('  fix(http): corrigir header ausente após refresh');
  console.error('  docs: atualizar guia de contribuição');
  console.error('\nDetalhes em docs/COMMIT-CONVENTIONS.md\n');
}

function main() {
  const messagePath = process.argv[2];

  if (!messagePath) {
    report(['Caminho do arquivo de mensagem não informado ao hook.']);
    process.exit(1);
  }

  const errors = validateCommitMessage(readFileSync(messagePath, 'utf8'));
  if (errors.length > 0) {
    report(errors);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
