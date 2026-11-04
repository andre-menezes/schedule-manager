# Agenda

Sistema de agenda pessoal e de atendimentos para profissionais autônomos:
compromissos pessoais e atendimentos a clientes na mesma agenda, com
controle de disponibilidade, prevenção de conflitos e lembretes automáticos.

Este repositório é o **frontend** (Vue 3 + TypeScript + Vite + Vuetify),
criado a partir do [vue-template](https://github.com/andre-menezes/vue-template).

## Produto

- Visão, personas e escopo: [docs/requirements/VISION.md](docs/requirements/VISION.md)
- Requisitos e regras de negócio: [docs/requirements/REQUIREMENTS.md](docs/requirements/REQUIREMENTS.md)
- Histórias de usuário: [docs/requirements/USER-STORIES.md](docs/requirements/USER-STORIES.md)
- Modelo de domínio: [docs/requirements/DOMAIN-MODEL.md](docs/requirements/DOMAIN-MODEL.md)
- Pendências de decisão: [docs/requirements/OPEN-QUESTIONS.md](docs/requirements/OPEN-QUESTIONS.md)
- Roadmap (MVP e evolução): [docs/ROADMAP.md](docs/ROADMAP.md)
- Decisões arquiteturais: [docs/decisions/README.md](docs/decisions/README.md)

## Leitura técnica

- Publicar em produção (Docker + Nginx): [docs/DEPLOY.md](docs/DEPLOY.md)
- Guia arquitetural completo: [docs/ARCHITECTURE-GUIDE.md](docs/ARCHITECTURE-GUIDE.md)
- Criar uma feature passo a passo: [docs/ONBOARDING.md](docs/ONBOARDING.md)
- Estrutura de código principal: [src/README.md](src/README.md)
- Convenções de módulos: [src/modules/README.md](src/modules/README.md)
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
`.env.development.local`. Todas as páginas ainda são públicas: a autenticação entra no R0
(ADR-0050). A integração contínua roda no GitHub Actions
(`.github/workflows/ci.yml`).

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
