#!/usr/bin/env node
/**
 * Remove a vitrine de documentação do template (módulo `showcase`, ADR-0026)
 * e o CRUD de exemplo (módulo `customers`, ADR-0039) para começar um projeto
 * novo.
 *
 * Apaga os módulos, os testes deles, os endpoints simulados de clientes e
 * este próprio script, e tira o `template:clean` do package.json. A página
 * inicial (`modules/home`), a API simulada sem rotas (`mock/`) e toda a
 * infraestrutura (app, core, shared, types) continuam.
 *
 * Uso: `pnpm template:clean`
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);

const targets = [
  'src/modules/showcase',
  'src/test/showcase',
  'e2e/showcase',
  'src/modules/customers',
  'src/test/customers',
  'e2e/customers.spec.ts',
  'mock/customers.ts',
  'mock/customers.spec.ts',
];

for (const target of targets) {
  const path = fileURLToPath(new URL(target, root));
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
    console.log(`removido: ${target}`);
  }
}

// A API simulada continua disponível para os módulos do projeto, sem rotas.
const handlersPath = fileURLToPath(new URL('mock/handlers.ts', root));
writeFileSync(
  handlersPath,
  `/**
 * Rotas da API simulada do \`pnpm dev\` (ADR-0039). Para simular um endpoint
 * novo, crie \`mock/<contexto>.ts\` com os handlers e some-os aqui.
 */
import type { MockHandler } from './api-mock.ts';

export const handlers: MockHandler[] = [];
`
);
console.log('esvaziado: mock/handlers.ts');

const packagePath = fileURLToPath(new URL('package.json', root));
const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
delete packageJson.scripts['template:clean'];
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log('removido: script template:clean do package.json');

rmSync(fileURLToPath(import.meta.url));
console.log('removido: scripts/template-clean.mjs');

console.log(`
Pronto. Próximos passos (detalhes em docs/NEW-PROJECT.md):
  1. Dê nome ao projeto: package.json, index.html, APP_NAME e welcome.* nos locales.
  2. Ajuste src/modules/home/views/HomeView.vue para a sua tela inicial.
  3. Revise README.md, CHANGELOG.md e docs/ para o novo projeto.
  4. Rode: pnpm lint && pnpm build && pnpm test`);
