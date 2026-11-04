# ADR-0035: Dependabot para atualização de dependências

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0011 (Fluxo de contribuição), ADR-0024 (pnpm), ADR-0034 (CI com actions fixadas por SHA)

## Contexto e problema

As dependências são fixadas em versão exata no `package.json` e as actions do
CI por SHA (ADR-0034). Sem automação, atualizar depende de alguém lembrar, e
correções de segurança atrasam. Como receber atualizações sem inundar o time de
PRs?

## Drivers da decisão

- Atualizações chegam como PR para a `develop` e passam pelo CI.
- Poucos PRs por semana; majors revisadas uma a uma.
- Mensagens aceitas pelo hook `commit-msg` (`scripts/verify-commit-msg.mjs`).
- Sem serviço ou app extra para instalar e manter.

## Opções consideradas

- **Dependabot** — nativo do GitHub, configurado por `.github/dependabot.yml`,
  com suporte a pnpm e a actions fixadas por SHA. Escolhida.
- **Renovate** — mais configurável (agendamento fino, presets, automerge,
  dashboard), mas exige instalar o app ou rodá-lo como action, e a
  configuração é maior. Fica como alternativa se o Dependabot não bastar.
- **Atualização manual** — situação atual.

## Decisão

`.github/dependabot.yml` com duas entradas, ambas semanais e com
`target-branch: develop`:

- `npm` (lê o `pnpm-lock.yaml`): minor e patch num único PR (grupo
  `minor-and-patch`); cada major em PR próprio. Mensagens `chore(deps): ...`
  e `chore(deps-dev): ...`.
- `github-actions` nos workflows e em `.github/actions/*`: mesmo agrupamento,
  mensagens `ci(deps): ...`.

Os PRs recebem a label `tipo: chore`.

## Consequências

### Positivas

- Atualizações e alertas de segurança viram PRs que passam pelo CI.
- Um PR semanal de minor/patch por ecossistema, mais um por major.

### Negativas / trade-offs

- O título do PR do Dependabot fica em inglês (`bump ... from ... to ...`).
- Sem automerge: alguém precisa revisar e aprovar.

## Referências

- `.github/dependabot.yml`.
- [Dependabot — opções de configuração](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)
