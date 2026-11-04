# ADR-0010: Tipagem centralizada, aliases e env em `@app/config`

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0001

> Nota (ADR-0025): tipos usados por um módulo só ficam em `modules/<x>/types.ts`.
> `src/types/` guarda os contratos compartilhados por dois ou mais módulos ou
> camadas.
>
> Nota (2026-10-30): o alias `@root` foi removido. Nenhum arquivo o importava,
> e a regra do ESLint que proibia `@root/src/...` (ADR-0018) saiu junto.

## Contexto e problema

Contratos TypeScript repetidos inline pelo código dificultam a evolução junto ao
backend e geram divergências. Além disso, imports relativos longos e acesso
disperso a variáveis de ambiente prejudicam a manutenção. Como padronizar
tipagem, imports e leitura de env?

## Drivers da decisão

- Evitar tipos duplicados e facilitar a evolução dos contratos.
- Imports curtos e consistentes.
- Centralizar a leitura de variáveis de ambiente (fail fast).

## Opções consideradas

- **Tipagem centralizada em `src/types` + aliases de import + env só em
  `@app/config`.**
- Sobre o nome do alias de tipos: **`@types`** foi descartado por colidir com o
  namespace reservado do TypeScript para pacotes do DefinitelyTyped; adotou-se
  **`@typings`** (registrado como breaking change).

## Decisão

Contratos TypeScript ficam centralizados em `src/types/<contexto>`, importados
via `@typings/<contexto>`. Convenções: interfaces sem prefixo `I`, PascalCase;
`interface` para objetos e `type` para uniões/utilitários; separar contrato de
API do contrato de UI; proibido `any` em contratos de domínio. Imports usam o
alias mais curto disponível (`@`, `@app`, `@modules`, `@shared`, `@typings`,
`@test`, `@root`). Variáveis de ambiente são lidas exclusivamente em
`src/app/config`, nunca via `import.meta.env` direto.

## Consequências

### Positivas

- Contratos reutilizáveis e fáceis de evoluir com o backend.
- Imports padronizados; env centralizado falha cedo se faltar variável.

### Negativas / trade-offs

- Exige criar/atualizar arquivos em `src/types` em vez de tipar inline.
- Alias `@typings` (em vez do intuitivo `@types`) precisa ser conhecido pelo time.

### Neutras

- A proibição de `any` e o uso de aliases são reforçados por review e lint.

## Referências

- `docs/ARCHITECTURE-GUIDE.md` — Tipagem; Aliases; Variáveis de ambiente.
- `src/types/README.md`.
- `docs/COMMIT-CONVENTIONS.md` — exemplo de breaking change `@types`→`@typings`.
- `vite.config.ts` — `resolve.alias`; `src/app/config/index.ts`.
