# ADR-0033: `noUncheckedIndexedAccess` ativo no TypeScript

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0010 (Tipagem e aliases), ADR-0016 (Portões de qualidade)

## Contexto e problema

Sem `noUncheckedIndexedAccess`, `lista[0]`, `match[1]` e `registro[chave]`
têm o tipo do elemento, como se ele sempre existisse. O erro só aparece em
runtime (`undefined` onde se esperava valor). O parser de ADRs da vitrine, por
exemplo, lia os grupos da regex sem checagem. O compilador deve cobrir esse
caso?

## Drivers da decisão

- Código copiado do template deve começar com a checagem mais segura, enquanto
  há pouco código para ajustar.
- Evitar `!` (non-null assertion), que só silencia o compilador.

## Opções consideradas

- **Manter desligado** — nenhum custo, nenhuma proteção.
- **Ligar em todos os projetos TypeScript** — escolhida.

## Decisão

`noUncheckedIndexedAccess: true` em `tsconfig.app.json` (app e testes
unitários; o `e2e/tsconfig.json` herda) e em `tsconfig.node.json`
(`vite.config.ts`, `playwright.config.ts`).

Acesso por índice é tratado com guarda, valor padrão (`??`), desestruturação
com checagem ou `at()` com tratamento do `undefined`. `!` só com comentário que
justifique por que o valor existe.

## Consequências

### Positivas

- Acessos a índice inexistente viram erro de tipo, no `pnpm build` e no CI.

### Negativas / trade-offs

- Mais checagens em laços sobre índices e em leituras de `Record`; laços
  `for...of` e métodos de array evitam a maior parte delas.

## Referências

- `tsconfig.app.json`, `tsconfig.node.json`, `src/modules/showcase/adr-index.ts`.
- [TSConfig — noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess)
