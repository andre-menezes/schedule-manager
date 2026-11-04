# ADR-0026: Vitrine de documentação num módulo removível

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0004 (Roteamento por auto-discovery), ADR-0025 (Colocalização por módulo)

## Contexto e problema

Seis dos sete módulos eram telas de documentação do próprio template (hub,
arquitetura, onboarding, componentes, convenções e decisões). Os componentes
dessas telas (`CodeBlock`, `DocSection`, `FlowSteps`, `ShowcaseCard`) moravam
em `shared/ui`, os tipos em `src/types/docs` e os textos ocupavam quase todo o
`pt-BR.json`. Quem criava um projeto a partir do template precisava garimpar o
que apagar, e o menu e a Home dependiam dessas telas.

## Drivers da decisão

- Um projeto novo deve começar com app, core, shared, types e uma página
  inicial, e nada mais.
- A documentação continua navegável no próprio app enquanto o template é
  estudado.
- Sem dependência nova.

## Opções consideradas

- **Pasta removível no template, com `template:clean`** — escolhida.
- **Site separado (ex.: VitePress)** — exigiria dependência e build próprios.
- **Manter como estava** — mantém o problema.

## Decisão

- Todas as telas de documentação formam o módulo `src/modules/showcase`, com
  rotas, views, componentes, tipos, `adr-index.ts`, `steps.ts` e locale
  próprios (`showcase/locales/pt-BR.json`). O hub da documentação passa de `/`
  para `/docs`; as demais rotas não mudam.
- Os locales de módulo (`src/modules/*/locales/pt-BR.json`) são descobertos por
  glob em `@app/providers/messages` e mesclados ao locale base.
- `src/modules/home` vira a página inicial do projeto (`/`). O link para a
  documentação só aparece se a rota `DocsHome` existir
  (`router.hasRoute`), sem importar o módulo `showcase`.
- Os testes da vitrine ficam em `src/test/showcase` e `e2e/showcase`.
- `pnpm template:clean` (`scripts/template-clean.mjs`) apaga
  `src/modules/showcase`, `src/test/showcase` e `e2e/showcase`, tira o script
  do `package.json` e se apaga.

## Consequências

### Positivas

- Começar um projeto é um comando. Depois dele, lint, build, testes e E2E
  continuam passando, e o menu mostra só a página inicial.
- `shared/ui`, `src/types` e o locale base ficam só com o que é da aplicação.

### Negativas / trade-offs

- O hub da documentação mudou de `/` para `/docs`.
- Telas novas de documentação precisam entrar no módulo `showcase` para serem
  removidas pelo `template:clean`.

### Neutras

- `docs/` (guias e ADRs) não é removido: continua valendo como referência para
  o projeto derivado.

## Referências

- `src/modules/showcase/`, `src/modules/home/`, `src/app/providers/messages.ts`,
  `scripts/template-clean.mjs`.
