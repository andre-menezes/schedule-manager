# Vue 3 Template - Arquitetura Frontend

Template frontend baseado em Vue 3 + TypeScript + Vite, com foco em:

- separação clara de responsabilidades por camada
- modularização por contexto de domínio
- rotas auto-descobertas por módulo
- padronização de stores, services e tipagem
- qualidade via lint, typecheck, testes unitários/integração e E2E

## Leitura recomendada

- Começar um projeto a partir do template: [docs/NEW-PROJECT.md](docs/NEW-PROJECT.md)
- Publicar em produção (Docker + Nginx): [docs/DEPLOY.md](docs/DEPLOY.md)
- Guia arquitetural completo: [docs/ARCHITECTURE-GUIDE.md](docs/ARCHITECTURE-GUIDE.md)
- Estrutura de código principal: [src/README.md](src/README.md)
- Convenções da camada app: [src/app/README.md](src/app/README.md)
- Convenções de módulos: [src/modules/README.md](src/modules/README.md)
- Convenções compartilhadas: [src/shared/README.md](src/shared/README.md)
- Tipagem e nomenclatura: [src/types/README.md](src/types/README.md)
- Estratégia de testes: [src/test/README.md](src/test/README.md)

## Padrão de documentação

- Todos os arquivos de documentação devem usar codificação UTF-8.
- Ao criar ou editar arquivos `.md`, manter UTF-8 como padrão.

## Stack

- Vue 3 (SFC com script setup)
- TypeScript
- Vite
- Vue Router
- Pinia
- Vuetify
- vue-i18n
- Vitest + Vue Test Utils
- Playwright (E2E)

## Como executar

```bash
pnpm install
pnpm dev
```

Nenhuma variável de ambiente é obrigatória: os valores padrão ficam em
`src/core/config/index.ts` e podem ser sobrescritos copiando `.env.example` para
`.env.development.local`. Todas as páginas são públicas: o template ainda não tem autenticação
(ADR-0021). A integração contínua roda no GitHub Actions
(`.github/workflows/ci.yml`).

## Começando um projeto a partir do template

As telas de documentação do template (hub em `/docs`, arquitetura, onboarding,
componentes, convenções e decisões) ficam no módulo `src/modules/showcase`. Ao
criar um projeto novo, remova-as com:

```bash
pnpm template:clean
```

O comando apaga o módulo e os testes dele e mantém a página inicial
(`src/modules/home`), a infraestrutura e a pasta `docs/` (ADR-0026).

## Qualidade e validação

```bash
# Lint
pnpm lint

# Typecheck + build
pnpm build

# Testes unitários/integração
pnpm test

# Cobertura
pnpm test:coverage

# E2E (headless)
pnpm test:e2e

# E2E (interativo)
pnpm test:e2e:open

# Tudo (unitários + E2E)
pnpm test:all
```

## Estrutura de alto nível

```text
src/
  app/      # bootstrap, providers, configurações globais, rotas base
  core/     # base sem UI: config/env e constantes
  modules/  # módulos de domínio (views, componentes e rotas por contexto)
  shared/   # blocos transversais (api, stores, ui, helpers, utils, composables)
  test/     # setup e suítes de teste (Vitest)
  types/    # contratos TypeScript centralizados por contexto
e2e/        # testes end-to-end (Playwright)
docs/       # documentação arquitetural e guias
```
