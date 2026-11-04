# ADR-0024: pnpm como gerenciador de pacotes

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0011 (Fluxo de contribuição), ADR-0016 (Portões de qualidade), ADR-0019 (Node 24 LTS)

## Contexto e problema

O template usava o npm, com `package-lock.json`, `npm ci` no CI e `npx` nos
hooks. O template vai ser a base dos projetos pessoais do Andre, que adota o
pnpm. Qual gerenciador de pacotes os projetos derivados devem herdar?

## Drivers da decisão

- Um único gerenciador e um único lockfile, sem convivência de `npm` e `pnpm`.
- Instalação reprodutível no CI (`--frozen-lockfile`).
- Bloquear dependências não declaradas (o `node_modules` não plano do pnpm só
  expõe ao código o que está no `package.json`).
- Manter as garantias atuais: versão exata nas dependências e `engine-strict`.

## Opções consideradas

- **Manter o npm** — sem custo de migração, mas diverge do padrão adotado.
- **pnpm** — escolhida.

## Decisão

- O lockfile passa a ser o `pnpm-lock.yaml`, gerado com `pnpm import` a partir
  do `package-lock.json` para manter as mesmas versões. O `package-lock.json`
  foi removido.
- `package.json` declara `"packageManager": "pnpm@10.28.0"` e
  `engines.pnpm: ">=10"`. O Corepack, que acompanha o Node, usa esse campo para
  ativar a versão certa (`corepack enable` uma vez por máquina).
- Scripts de instalação de dependências só rodam para os pacotes listados em
  `pnpm.onlyBuiltDependencies` (`esbuild` e `@parcel/watcher`), como exige o
  pnpm 10. O campo `allowScripts`, específico do npm, saiu.
- O `.npmrc` continua com `save-exact=true` e `engine-strict=true`, que o pnpm
  também lê.
- O CI usa `pnpm/action-setup`, cache `pnpm` e `pnpm install --frozen-lockfile`.
  O hook de pre-commit usa `pnpm exec lint-staged`, e o `webServer` do
  Playwright, `pnpm exec vite`.
- A documentação e as telas do template passam a mostrar `pnpm <script>` e
  `pnpm install`.

## Consequências

### Positivas

- Instalações mais rápidas e um store compartilhado entre os projetos.
- Import de pacote não declarado no `package.json` falha, em vez de funcionar
  por acaso.

### Negativas / trade-offs

- Cada máquina precisa do pnpm (`corepack enable`).
- Um `npm install` por engano cria um `package-lock.json` que não deve ser
  commitado.

### Neutras

- As ADRs anteriores citam `npm`; os comandos equivalentes são `pnpm install`,
  `pnpm install --frozen-lockfile` (no lugar de `npm ci`), `pnpm <script>` e
  `pnpm exec`.

## Referências

- `package.json` (`packageManager`, `engines`, `pnpm`), `pnpm-lock.yaml`,
  `.npmrc`, `.github/workflows/ci.yml`, `.husky/pre-commit`,
  `playwright.config.ts`, `CONTRIBUTING.md`.
- [pnpm](https://pnpm.io/) e [Corepack](https://nodejs.org/api/corepack.html).
