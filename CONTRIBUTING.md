# Guia de Contribuição

Obrigado por contribuir com o **schedule-manager** (Agenda). Este guia reúne o fluxo de
trabalho, as convenções e os critérios de qualidade do projeto. Leia antes de
abrir seu primeiro Pull Request (PR).

> Documentação de referência (fonte de verdade):
>
> - Arquitetura: [docs/ARCHITECTURE-GUIDE.md](docs/ARCHITECTURE-GUIDE.md)
> - Como criar uma feature: [docs/ONBOARDING.md](docs/ONBOARDING.md)
> - Convenções de commit: [docs/COMMIT-CONVENTIONS.md](docs/COMMIT-CONVENTIONS.md)
> - Checklist de revisão: [docs/CODE-REVIEW-CHECKLIST.md](docs/CODE-REVIEW-CHECKLIST.md)

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Convenção de branches](#convenção-de-branches)
- [Convenção de commits](#convenção-de-commits)
- [Git hooks (Husky)](#git-hooks-husky)
- [Padrões de código](#padrões-de-código)
- [Testes](#testes)
- [Validação antes do PR](#validação-antes-do-pr)
- [Abrindo um Pull Request](#abrindo-um-pull-request)
- [Publicando uma versão](#publicando-uma-versão)
- [Registrando no CHANGELOG](#registrando-no-changelog)

---

## Pré-requisitos

- **Node.js**: versão exata fixada em [`.tool-versions`](.tool-versions) e
  [`.nvmrc`](.nvmrc) (**24.22.2**, linha LTS). Recomendamos o **vfox** para
  gerenciá-la (veja abaixo).
- **pnpm**: versão 10 ou superior. O campo `packageManager` do `package.json`
  fixa a versão; com o Corepack (que acompanha o Node), basta rodar
  `corepack enable` uma vez por máquina. Não use `npm install`: o projeto não
  tem `package-lock.json` e o lockfile é o `pnpm-lock.yaml` (ADR-0024).
- Variáveis de ambiente: opcionais. Para sobrescrever os padrões, copie
  `.env.example` para `.env.development.local`.

### Gerenciando a versão do Node com vfox

Adotamos o [vfox](https://vfox.dev/) como gerenciador de versões. Diferente de
instalar o Node.js diretamente na máquina, o vfox permite instalar e alternar
versões **sem privilégios de administrador** — útil quando o desenvolvedor não
tem permissão para instalar runtimes globalmente. Ele também respeita os
arquivos de versão do projeto (`.tool-versions` e `.nvmrc`), garantindo que
todo o time use a mesma versão.

Instale o vfox seguindo a [documentação oficial](https://vfox.dev/guides/quick-start.html)
e, na primeira vez, adicione o plugin do Node.js:

```bash
vfox add nodejs                 # adiciona o plugin (apenas uma vez por máquina)
```

Na raiz do projeto, instale e ative a versão definida em `.tool-versions`:

```bash
vfox install nodejs             # instala a versão exata do projeto (24.22.2)
vfox use nodejs                 # ativa a versão para o projeto atual
node -v                         # confirme: v24.22.2
```

> Já usa `nvm`? O `.nvmrc` continua válido — basta rodar `nvm use`. A
> recomendação do vfox é a padrão do time, mas não é obrigatória.

> **Importante:** o projeto usa `engine-strict=true` no `.npmrc`. Se a versão
> ativa do Node estiver fora da linha 24 (a partir da **24.22.2**), o
> `pnpm install` falha com `ERR_PNPM_UNSUPPORTED_ENGINE`. Ative a versão do projeto
> (`vfox use nodejs`) antes de instalar as dependências.

---

## Configuração do ambiente

```bash
vfox use nodejs    # ativa a versão do Node do projeto (ver .tool-versions)
pnpm install       # instala dependências e configura os git hooks (Husky)
pnpm dev           # sobe o servidor de desenvolvimento (porta 9081)
```

> Se preferir usar `nvm`, substitua a primeira linha por `nvm use`.

O `pnpm install` executa o script `prepare`, que ativa o Husky automaticamente.
Não é necessário nenhum passo manual adicional para habilitar os hooks.

---

## Fluxo de trabalho

1. Sincronize a `develop`: `git checkout develop && git pull`.
2. Crie uma branch a partir da `develop` (nunca de `main`).
3. Implemente seguindo a arquitetura em camadas (types → service → store (se necessário) → view → components). Detalhes em [docs/ONBOARDING.md](docs/ONBOARDING.md).
4. Escreva testes cobrindo as regras de negócio.
5. Valide localmente: `pnpm lint && pnpm build && pnpm test`.
6. Commite seguindo as convenções (os hooks validam automaticamente).
7. Faça push e abra um Pull Request para a `develop`.

> **Nunca** faça push direto em `main` ou `develop`. Toda mudança passa por PR.

---

## Convenção de branches

| Tipo         | Padrão                       | Exemplo                       |
| ------------ | ---------------------------- | ----------------------------- |
| Feature      | `feat/FEAT-XXX-<slug>`       | `feat/FEAT-012-customer-list` |
| Bug fix      | `fix/BUG-XXX-<slug>`         | `fix/BUG-007-login-redirect`  |
| Refactor     | `refactor/<descrição-curta>` | `refactor/http-interceptors`  |
| Documentação | `docs/<descrição-curta>`     | `docs/contributing-guide`     |
| Chore/infra  | `chore/<descrição-curta>`    | `chore/github-actions`        |

Use `kebab-case` no slug e mantenha-o curto e descritivo.

---

## Convenção de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/) com a
descrição escrita em **português**. O formato completo está em
[docs/COMMIT-CONVENTIONS.md](docs/COMMIT-CONVENTIONS.md).

```text
tipo(escopo): descrição em português, imperativo, ≤72 chars
```

**Tipos aceitos:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`,
`style`, `perf`, `ci`, `revert`, `build`, `wip` (o mesmo conjunto validado pelo
hook `commit-msg`; `wip` só em branch de trabalho, reescrito antes do PR).

Exemplos:

```text
feat(auth): implementar refresh automático de token expirado
fix(http): corrigir header de autorização após refresh
docs(readme): atualizar instruções de setup
```

O hook `commit-msg` rejeita mensagens fora do padrão.

---

## Git hooks (Husky)

Os hooks são gerenciados pelo [Husky](https://typicode.github.io/husky/) e
ativados no `pnpm install`.

| Hook         | O que faz                                                            |
| ------------ | -------------------------------------------------------------------- |
| `pre-commit` | Roda `lint-staged`: ESLint (`--fix`) e Prettier nos arquivos staged. |
| `commit-msg` | Valida a mensagem via `scripts/verify-commit-msg.mjs`.               |

Em situações excepcionais é possível pular os hooks com `--no-verify`, mas
isso **não é recomendado** — o pipeline de CI reprovará os mesmos problemas.

---

## Padrões de código

- **Código em inglês**; documentação e commits em **português** (UTF-8).
- **Sem `any`** em contratos de domínio (prefira `unknown` quando necessário).
- Props e emits tipados com `defineProps<T>()` e `defineEmits<T>()`.
- Tipos centralizados em `src/types/<contexto>/` (nunca inline repetido).
- Respeite as **regras de dependência entre camadas**: `modules` e `app`
  importam de `shared`, `core` e `types`; `shared` só de `core` e `types`; `core`
  só de `types`; nenhum módulo importa de outro módulo. O ESLint reprova
  violações (ADR-0018).
- Nunca acesse `import.meta.env` fora de `@core/config`.
- Use o alias mais curto (`@shared/`, `@core/`, `@app/`, `@typings/`, `@modules/`, `@test/`).
- Ordem dos blocos em `.vue`: `<template>` → `<script>` → `<style>`.

Referência completa: [docs/ARCHITECTURE-GUIDE.md](docs/ARCHITECTURE-GUIDE.md).

---

## Testes

- **Unitários/integração**: Vitest + Vue Test Utils (`src/test/**/*.spec.ts`).
- **End-to-end**: Playwright (`e2e/**/*.spec.ts`). Na primeira vez, rode
  `pnpm test:e2e:install` para baixar o Chromium; o `pnpm test:e2e` sobe
  o servidor sozinho.
- Toda regra de negócio nova precisa de teste; bug corrigido precisa de teste
  de regressão.

As variáveis de ambiente têm valores padrão (`src/core/config/index.ts`), então
não é preciso configurar nada para rodar os testes.

Thresholds de cobertura (o CI reprova abaixo destes valores):

| Métrica    | Mínimo |
| ---------- | ------ |
| Lines      | 100%   |
| Functions  | 100%   |
| Branches   | 98%    |
| Statements | 100%   |

Os valores são um **piso que só sobe** (ratchet — ADR-0016): refletem a
cobertura real medida e devem ser elevados em `vite.config.ts` sempre que a
cobertura aumentar. A fonte de verdade é o `coverage.thresholds` do
`vite.config.ts`.

---

## Validação antes do PR

Garanta que os três comandos passam sem erros:

```bash
pnpm lint          # análise estática
pnpm build         # type-check + build de produção
pnpm test          # testes unitários
```

Para conferir cobertura: `pnpm test:coverage`.

---

## Abrindo um Pull Request

1. O PR deve apontar para a branch `develop`.
2. Preencha o template de PR (carregado automaticamente pelo GitHub).
3. Aplique as labels adequadas (tipo e prioridade) — veja
   [.github/labels.md](.github/labels.md).
4. Título conciso (< 70 caracteres) no formato Conventional Commits.
5. Descreva o que foi feito, como testar e pendências (se houver).
6. Vincule a issue relacionada (ex.: `Closes #123`).
7. Aguarde o CI do GitHub Actions passar (lint, build, testes e E2E) antes de solicitar review.

O checklist objetivo de aprovação está em
[docs/CODE-REVIEW-CHECKLIST.md](docs/CODE-REVIEW-CHECKLIST.md).

---

## Publicando uma versão

A `main` recebe só versões; o trabalho do dia a dia vai para a `develop`.
Versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

1. Crie `release/<versão>` a partir da `develop` atualizada (ex.:
   `release/1.1.0`).
2. Nela, só o fechamento da versão: `version` no `package.json` e, no
   CHANGELOG, a seção `[Não lançado]` vira `[<versão>] - <data>`, com uma
   `[Não lançado]` vazia acima.
3. Abra um PR da `release/<versão>` para a `main` e faça o merge com o CI
   verde.
4. Crie a tag e a release no GitHub a partir da `main`:
   `gh release create v<versão> --target main --generate-notes`.
5. Traga a `main` de volta para a `develop` (PR `main` → `develop`), para a
   versão e o CHANGELOG ficarem iguais nas duas.

Correção urgente em produção: `hotfix/<versão>` a partir da `main`, com os
mesmos passos 2 a 5.

---

## Registrando no CHANGELOG

Mudanças relevantes devem ser registradas na seção `[Não lançado]` do
[CHANGELOG.md](CHANGELOG.md), na categoria apropriada (Adicionado, Alterado,
Corrigido, etc.). Mudanças puramente internas (refactor sem impacto externo)
podem ser omitidas a critério do revisor.
