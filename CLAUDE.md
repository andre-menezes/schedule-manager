# Claude Code — Instruções do Projeto

Projeto frontend Vue 3 + TypeScript + Vite com arquitetura em camadas.

Este arquivo é apenas um ponteiro (adapter do Claude — ADR-0006). As regras e
convenções **não** são repetidas aqui, para não divergirem da fonte de verdade.
Leia antes de agir:

- `agent/core/CONTRACT.md` — princípios, política anti-achismo e critério de pronto
- `agent/core/PROCEDURE.md` — fases do workflow (entrada → entrega)
- `agent/skills/vue-vuetify-dev/SKILL.md` — padrões Vue 3 + Vuetify + TS
- `agent/skills/testing/SKILL.md` — estratégia de testes (Vitest + Playwright)
- `agent/workflows/` — create-feature, fix-bug e validate-code
- `docs/ARCHITECTURE-GUIDE.md` — camadas e regras de dependência (verificadas pelo ESLint)
- `docs/COMMIT-CONVENTIONS.md` e `CONTRIBUTING.md` — commits atômicos, branches e PR
- `docs/decisions/README.md` — decisões arquiteturais (ADR)
- `docs/specs/` — specs de feature (template em `agent/templates/feature-spec.md`)
- `src/*/README.md` — regras locais por camada

## Comandos

```bash
pnpm dev              # servidor de desenvolvimento (porta 9081)
pnpm lint             # lint (com informação de tipos)
pnpm lint:fix         # corrige o lint automaticamente
pnpm build            # typecheck + build de produção
pnpm test             # testes unitários
pnpm test:coverage    # testes unitários com cobertura
pnpm test:e2e         # testes E2E (Playwright headless, inclui acessibilidade)
pnpm test:e2e:open    # testes E2E (Playwright UI)
```
