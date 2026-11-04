# ADR-0022: GitHub como hospedagem e CI com GitHub Actions

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0011 (Fluxo de contribuição), ADR-0016 (Portões de qualidade), ADR-0020 (E2E com Playwright)

## Contexto e problema

O repositório está hospedado no GitHub, mas o pipeline (`.gitlab-ci.yml`), os
templates de merge request e issue e o esquema de labels eram do GitLab. Com
isso, nenhum portão de qualidade rodava nos pull requests. Como alinhar CI e
fluxo de contribuição à hospedagem real?

## Drivers da decisão

- Lint, typecheck, testes e E2E precisam reprovar o PR no lugar onde ele é
  aberto.
- Manter os mesmos jobs e critérios já documentados (ADR-0011, ADR-0016,
  ADR-0020).

## Opções consideradas

- **Manter o GitLab como canônico e o GitHub como espelho** — não reflete a
  hospedagem real do projeto.
- **Migrar para o GitHub (Actions + templates nativos)** — escolhida.

## Decisão

- O CI passa a ser `.github/workflows/ci.yml`, com os jobs `lint`, `build`,
  `test` (com cobertura) e `e2e`, executados em pull requests e em pushes para
  `main` e `develop`. A versão do Node vem do `.nvmrc`.
- Templates de issue em `.github/ISSUE_TEMPLATE/` e de PR em
  `.github/pull_request_template.md`.
- O esquema de labels vai para `.github/labels.md`, no formato `escopo: valor`
  (o GitHub não tem scoped labels; a exclusividade é por convenção).
- O fluxo de branches segue o mesmo: PRs para `develop`.
- O deploy automático no GitLab Pages é removido. Publicação (ex.: GitHub
  Pages) será decidida em outra ADR, junto com a configuração de `base` e o
  fallback de SPA.

## Consequências

### Positivas

- Os portões de qualidade passam a rodar em todo PR do GitHub.

### Negativas / trade-offs

- Não há mais deploy automático de demonstração.
- As labels precisam ser criadas manualmente no GitHub.

## Referências

- `.github/workflows/ci.yml`, `.github/pull_request_template.md`,
  `.github/ISSUE_TEMPLATE/`, `.github/labels.md`, `CONTRIBUTING.md`.
