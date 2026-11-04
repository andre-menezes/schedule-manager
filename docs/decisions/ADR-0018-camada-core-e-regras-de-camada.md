# ADR-0018: Camada `core` e regras de camada verificadas pelo ESLint

- **Status:** Aceita
- **Data:** 2026-10-29
- **Decisores:** Time de frontend / Arquitetura
- **Relacionadas:** ADR-0001 (Arquitetura em camadas), ADR-0009 (Estado e organização do `shared/`), ADR-0010 (Tipagem, aliases e env), ADR-0017 (Autenticação fail-closed)

> Nota (ADR-0021): `core/auth`, `shared/helpers/session`, `useSession`, a
> `user.store` e o handler de 401 (`auth-error.ts`) foram removidos junto com a
> autenticação corporativa. A camada `core` e as regras de dependência seguem
> vigentes.
>
> Nota (2026-10-30): os padrões casavam só com `@modules/*` e `**/modules/**`,
> então `import x from '../../outro-modulo/...'` passava no lint. O
> `eslint.config.mjs` agora proíbe, conforme a profundidade do arquivo, todo
> import relativo que sobe até `src/modules/`. O teste
> `src/test/architecture/layerRules.spec.ts` garante o bloqueio.

## Contexto e problema

A ADR-0001 define que `shared` importa apenas de `types` e que `types` não
importa de nenhuma camada. O próprio template violava essas regras:

- `shared` importava de `app` em seis pontos (`@app/config` na camada HTTP, nos
  services, helpers, stores e no header; `@app/auth` na `user.store`).
- Havia um **ciclo** `user.store → @app/auth → @shared/helpers/session →
user.store`, contornado com um `import()` dinâmico na camada HTTP.
- `types/auth` importava código de runtime de `@app/auth`, e `types/i18n`
  importava o JSON de locale de `app`.
- Um módulo importava componente de outro (`protected-example → architecture`).

A causa de fundo: `config` e o cliente OAuth são infraestrutura **base**,
consumida por `shared`, mas moravam em `app`, a camada mais alta. E nada
verificava as regras — elas existiam só na documentação.

## Drivers da decisão

- Dependências apontando sempre "para baixo", sem ciclos.
- Regras de camada verificadas automaticamente, não só documentadas.
- Nenhuma dependência nova sem necessidade.

## Opções consideradas

- **Inversão por porta, mantendo `config`/`auth` em `app`** — `shared` exporia
  pontos de registro e o `app` injetaria tudo. Exigiria injetar até a leitura
  de configuração; muita indireção para algo que é base por natureza.
- **Camada `core` abaixo de `shared`** — move para uma camada própria o que não
  depende de UI, stores ou services. Escolhida; a inversão por porta é usada só
  no ponto em que a camada HTTP precisa disparar o login.
- **Verificação com `eslint-plugin-boundaries` + `dependency-cruiser`** — detecta
  também ciclos indiretos, mas adiciona duas dependências. Adiada.
- **Verificação com `no-restricted-imports` nativo do ESLint** — zero
  dependências; cobre imports proibidos (alias e relativos). Escolhida.

## Decisão

1. Nova camada `src/core` (alias `@core`), que importa apenas de `types`:
   - `core/config` — leitura de env e constantes (antes `app/config`).
   - `core/auth` — cliente OAuth e `state`/nonce (antes `app/auth`). O
     cliente só monta URLs e redireciona; não conhece stores nem services.
2. A orquestração de sessão fica em `shared/helpers/session`
   (`cleanStorage`, `startLogin`, `endSession`), exposta aos componentes por
   `useSession`. A `user.store` passa a conter apenas estado.
3. A camada HTTP não importa o fluxo de login: `auth-error.ts` expõe
   `setUnauthorizedHandler`, e o `app` registra `startLogin` no bootstrap
   (`providers/plugins.ts`). O `import()` dinâmico é removido.
4. `types` não importa de nenhuma camada: o tipo `OAuthSSC` vira interface
   explícita e `MessageSchema` passa para `app/providers/i18n.ts`.
5. Matriz de dependências (verificada em `eslint.config.mjs`):

   | Camada  | Pode importar de    |
   | ------- | ------------------- |
   | app     | shared, core, types |
   | modules | shared, core, types |
   | shared  | core, types         |
   | core    | types               |
   | types   | —                   |

   Módulos não importam outros módulos; componentes reaproveitados vão para
   `shared/ui` (ex.: `FlowSteps`). Aliases longos (`@/shared/...`,
   `@root/src/...`) também são reprovados.

Esta decisão substitui a tabela de dependências da ADR-0001 e o local de
`config` definido na ADR-0010 (`@app/config` → `@core/config`). O restante
dessas ADRs segue vigente.

## Consequências

### Positivas

- Grafo de dependências acíclico e sem `import()` dinâmico de contorno.
- `npm run lint` reprova violações de camada no pre-commit e no CI.
- `user.store` e o cliente OAuth ficam simples de testar isoladamente.

### Negativas / trade-offs

- Mais uma camada a aprender; imports de `@app/config`/`@app/auth` mudam.
- `no-restricted-imports` não detecta ciclos **dentro** da mesma camada; se
  isso virar problema, reavaliar `dependency-cruiser` em nova ADR.

### Neutras

- Preferência de tema deixa de ser apagada no logout (não é dado de sessão).

## Referências

- `src/core/` — `config/index.ts`, `auth/index.ts`, `auth/state.ts`.
- `src/shared/helpers/session.ts` — `startLogin`, `endSession`, `cleanStorage`.
- `src/shared/api/instances/auth-error.ts` — `setUnauthorizedHandler`.
- `src/app/providers/plugins.ts` — registro do handler de 401.
- `eslint.config.mjs` — `layerRules`.
