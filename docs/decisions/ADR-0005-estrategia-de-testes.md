# ADR-0005: Estratégia de testes (Vitest + Vue Test Utils + Cypress)

- **Status:** Substituída
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0011; substituída pela ADR-0020 (E2E com Playwright)

## Contexto e problema

O projeto precisa de uma estratégia de testes que cubra desde lógica isolada até
fluxos completos do usuário, com uma porta de qualidade no CI. Quais ferramentas
e que nível de cobertura adotar?

## Drivers da decisão

- Cobrir unidades (regras de negócio, stores, services) e fluxos ponta a ponta.
- Testes rápidos e isolados para o dia a dia.
- Porta de qualidade objetiva no pipeline.

## Opções consideradas

- **Vitest + Vue Test Utils + happy-dom** para unit/integração e **Cypress**
  para E2E.

> A documentação não registra uma migração de outra ferramenta de E2E para o
> Cypress; portanto esta ADR registra apenas a escolha atual, sem afirmar
> substituição de ferramenta anterior.

## Decisão

Adotamos **Vitest + Vue Test Utils + happy-dom** para testes unitários e de
integração (`src/test/**/*.spec.ts`) e **Cypress** para E2E
(`cypress/e2e/**/*.cy.ts`). Convenções: usar Pinia real e mockar apenas o
service/HTTP; seletores E2E via `data-cy`. O CI reprova se a cobertura cair
abaixo dos limites: linhas 95%, funções 100%, ramos 90%, statements 95%.

## Consequências

### Positivas

- Feedback rápido nos testes unitários e validação real nos E2E.
- Cobertura mínima garantida automaticamente no pipeline.
- Mock isolado (Pinia real) evita esconder breaking changes.

### Negativas / trade-offs

- Thresholds altos (funções 100%) exigem disciplina de teste em todo código novo.
- Duas ferramentas de teste para manter e configurar.

### Neutras

- Necessidade de `data-cy` nos componentes para seletores E2E estáveis.

## Referências

- `src/test/README.md` — estratégia e exemplos.
- `docs/ARCHITECTURE-GUIDE.md` — Testes.
- `vite.config.ts` — bloco `test` e `coverage.thresholds`.
- `package.json` — `vitest`, `@vue/test-utils`, `happy-dom`, `cypress`.
