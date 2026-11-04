# ADR-0011: Fluxo de contribuição — commits, hooks e CI

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0005, ADR-0007, ADR-0008

> Nota (ADR-0022): o pipeline de CI deixou de ser o `.gitlab-ci.yml` e passou
> a ser o GitHub Actions (`.github/workflows/ci.yml`). Commits, hooks e
> demais regras desta ADR seguem vigentes.
>
> Nota (ADR-0024): o gerenciador de pacotes passou a ser o pnpm. O CI usa
> `pnpm install --frozen-lockfile` e o pre-commit, `pnpm exec lint-staged`.
>
> Nota (2026-10-30): o hook `commit-msg` passou a validar também a linha em
> branco após o título e o corpo em 72 colunas, regras que já estavam no
> `docs/COMMIT-CONVENTIONS.md` mas não eram verificadas.
>
> Nota (2026-11-04): o fluxo de publicação de versões ficou documentado no
> CONTRIBUTING (seção "Publicando uma versão"): `release/<versão>` a partir
> da `develop`, PR para a `main`, tag `v<versão>` e merge de volta na
> `develop`.

## Contexto e problema

Um template mantido por várias pessoas precisa de um histórico legível, de
validações automáticas antes do commit e de um pipeline que reprove problemas
antes do merge. Como padronizar commits, validações locais e integração
contínua?

## Drivers da decisão

- Histórico de commits consistente e legível.
- Falhar cedo (localmente) no que o CI também reprovaria.
- Validação automática de lint, build e testes no pipeline.

## Opções consideradas

- **Conventional Commits (em português) + Husky/lint-staged + CI GitLab de
  validação.**
- Sobre o CI: usar **`npm ci`** (preferível para builds reprodutíveis) foi
  adiado em favor de **`npm install`**, porque `package.json` e
  `package-lock.json` ainda não estão perfeitamente sincronizados.

## Decisão

Adotamos [Conventional Commits](https://www.conventionalcommits.org/) com
descrição em português (imperativo, ≤72 caracteres) e tipo/escopo em inglês,
validados pelo hook `commit-msg` (`scripts/verify-commit-msg.mjs`). O
`pre-commit` roda `lint-staged` (ESLint `--fix` + Prettier nos arquivos staged),
via Husky ativado no `npm install` (script `prepare`). O CI do GitLab
(`.gitlab-ci.yml`) executa `install → lint → build → test` com cobertura, sem
estágio de deploy; usa `npm install` temporariamente e gera um `.env` a partir
de `.env.example` para o Vitest.

## Consequências

### Positivas

- Histórico padronizado e validado automaticamente.
- Problemas de lint/formatação barrados antes do commit.
- Pipeline reprova regressões de lint, build ou cobertura.

### Negativas / trade-offs

- Hooks adicionam etapas ao commit; `--no-verify` é desencorajado.
- Uso de `npm install` no CI (em vez de `npm ci`) é uma solução temporária até
  o lockfile ser sincronizado.

### Neutras

- Depende de Husky e lint-staged como dependências de desenvolvimento.

## Referências

- `docs/COMMIT-CONVENTIONS.md`, `CONTRIBUTING.md` — commits e hooks.
- `.husky/pre-commit`, `.husky/commit-msg`, `scripts/verify-commit-msg.mjs`.
- `.gitlab-ci.yml` — pipeline e racional de `npm install` vs `npm ci`.
