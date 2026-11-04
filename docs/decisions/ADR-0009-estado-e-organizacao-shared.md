# ADR-0009: Padrões de estado e organização do `shared/`

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0001

> Nota (ADR-0025): services e stores usados por um módulo só ficam no próprio módulo
> (`modules/<x>/api`, `modules/<x>/stores`). `shared/` recebe o código quando
> um segundo módulo precisar dele.

## Contexto e problema

Dentro da camada `shared/` convivem estado global, lógica reutilizável e
componentes de UI. Sem critérios claros, é fácil misturar responsabilidades
(ex.: uma função "utilitária" que acessa store, ou um componente que busca
dados). Como organizar estado e lógica compartilhada de forma previsível?

## Drivers da decisão

- Previsibilidade sobre onde cada tipo de código deve morar.
- Testabilidade (funções puras isoladas, componentes apresentacionais).
- Responsabilidade única por store/módulo.

## Opções consideradas

- **Conjunto de padrões**: Pinia (Options API) para estado global; matriz
  utils/helpers/composables por dependência e reatividade; separação
  container (view) vs apresentacional na UI.

> Não há alternativas formalmente avaliadas na documentação (por exemplo, Setup
> Stores do Pinia ou Vuex). A decisão foi herdada da concepção do template.

## Decisão

Consolidamos os seguintes padrões na camada `shared/`:

- **Estado global**: stores Pinia com **Options API** (`state`/`getters`/
  `actions`), em `shared/stores/`, com responsabilidade única por store. Estado
  local de tela fica em `ref`/`reactive`. Mutação só via actions.
- **Lógica compartilhada** (matriz de decisão): função pura sem store/service →
  `utils/`; com store/service e não reativa → `helpers/`; reativa → `composables/`.
- **UI**: views são containers (orquestram dados); componentes filhos são
  apresentacionais (props + emits); eventos customizados em camelCase.

## Consequências

### Positivas

- Critério objetivo para posicionar cada peça de lógica.
- Componentes apresentacionais e utils puros são fáceis de testar.

### Negativas / trade-offs

- Exige atenção no review para não vazar responsabilidades entre as categorias.

### Neutras

- Acoplamento ao Pinia como solução de estado.

## Referências

- `docs/ARCHITECTURE-GUIDE.md` — Estado global; Utils, Helpers e Composables; UI e Layouts.
- `src/shared/README.md`, `src/shared/stores/README.md`, `src/shared/ui/README.md`.
- `agent/skills/vue-vuetify-dev/SKILL.md`.
