# ADR-0025: Colocalização do código de cada feature no próprio módulo

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0001 (Arquitetura em camadas), ADR-0009 (Estado e organização do `shared/`), ADR-0010 (Tipagem e aliases), ADR-0018 (Regras de camada)

## Contexto e problema

Até aqui, uma feature ficava espalhada em quatro lugares: views e componentes
em `modules/<x>`, services em `shared/api/services`, stores em `shared/stores`
e tipos em `src/types/<x>`. Os módulos eram independentes só na UI; a camada de
dados de todos eles crescia dentro de `shared` e `types`, que tendiam a virar
depósitos globais. Apagar ou mover uma feature exigia garimpar quatro pastas.
Havia ainda uma contradição: o `src/modules/README.md` permitia `types/` local,
mas o CONTRACT exigia tipos em `src/types/`.

## Drivers da decisão

- Uma feature deve caber numa pasta: criar, mover ou apagar é uma operação só.
- `shared` e `types` devem guardar só o que de fato é compartilhado.
- Manter a regra de que um módulo nunca importa de outro (ADR-0018).

## Opções consideradas

- **Manter tudo centralizado em `shared` e `types`** — sem custo, mas mantém o
  problema.
- **Colocalizar no módulo e promover com dois consumidores** — escolhida.

## Decisão

Cada módulo guarda o que é só dele:

```text
src/modules/<x>/
├── routes.ts
├── views/
├── components/
├── types.ts          # ou types/ quando crescer
├── api/              # services do módulo (usam o httpClient de @shared/api)
├── stores/           # stores Pinia usadas só por este módulo
└── composables/      # composables usados só por este módulo
```

- Código usado por **um** módulo fica nele, importado por caminho relativo.
- Quando um **segundo** módulo precisar, o código é promovido: tipos para
  `src/types/<contexto>`, services, stores e composables para `shared/`. Como
  um módulo não importa de outro, a promoção é o único caminho para
  compartilhar.
- `shared/` e `src/types/` continuam com o que já é transversal (cliente HTTP,
  tema, componentes de UI comuns, `ProblemDetails`, `RouteMeta`).
- Os tipos exclusivos das telas de documentação saíram de `src/types/` e foram
  para o módulo `showcase` (ADR-0026).

## Consequências

### Positivas

- Uma feature nova ou removida mexe numa pasta só.
- `shared` e `types` deixam de crescer com código de uma feature só.

### Negativas / trade-offs

- Promover código para `shared` exige mover arquivos e trocar imports quando o
  segundo consumidor aparece.

### Neutras

- As regras de camada do ESLint não mudam: elas já permitem import relativo
  dentro do módulo e proíbem import entre módulos.

## Referências

- `src/modules/README.md`, `src/types/README.md`, `docs/ONBOARDING.md`,
  `agent/core/CONTRACT.md`, `agent/workflows/create-feature.workflow.md`.
