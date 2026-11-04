# ADR-0034: CI com actions fixadas por SHA, setup compartilhado e timeout

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0022 (GitHub e GitHub Actions), ADR-0024 (pnpm), ADR-0035 (Dependabot)

## Contexto e problema

O `ci.yml` referenciava as actions por tag (`actions/checkout@v4`). Uma tag é
móvel: quem controla o repositório da action pode apontá-la para outro código,
que rodaria no CI com acesso ao repositório. Além disso, os quatro jobs
repetiam os mesmos passos de setup e não tinham `timeout-minutes` (o padrão do
GitHub é 360 minutos). Como deixar o pipeline mais seguro e mais fácil de
manter?

## Drivers da decisão

- O código que roda no CI deve ser o revisado, não o que a tag apontar depois.
- Mudar a versão do Node, do pnpm ou a forma de instalar deve exigir uma
  edição, não quatro.
- Um job travado não deve consumir horas de runner.

## Opções consideradas

- Referência das actions: **SHA do commit com a versão em comentário**
  (escolhida), tag de versão exata (também móvel) ou tag major (atual).
- Setup: **composite action local** (escolhida), workflow reutilizável
  (`workflow_call`, que vira um job à parte e não compartilha o runner) ou
  manter a repetição.

## Decisão

- Toda action de terceiros usa `owner/repo@<sha-de-40-caracteres> # vX.Y.Z`.
  Os SHAs são os das tags `v4` usadas antes, conferidos com
  `gh api repos/<owner>/<repo>/git/ref/tags/<tag>`. No `pnpm/action-setup`, a
  `v4` aponta para a v4.3.0; a tag v4.4.0 é o mesmo commit da v5.0.0, que roda
  em Node 24, e por isso não foi usada.
- `.github/actions/setup/action.yml` (composite) instala o pnpm, o Node do
  `.nvmrc` com cache do pnpm e roda `pnpm install --frozen-lockfile`.
- O checkout fica em cada job, antes da action local: ela só existe no runner
  depois que o repositório é baixado.
- `timeout-minutes`: 10 em `lint`, `build` e `test`; 20 no `e2e`, que baixa o
  Chromium.
- O Dependabot (ADR-0035) atualiza SHA e comentário juntos.

## Consequências

### Positivas

- Mudança numa tag de terceiros não chega ao CI sem um PR.
- O setup é editado num só lugar.
- Jobs travados param em minutos.

### Negativas / trade-offs

- O SHA não diz a versão sozinho; o comentário precisa acompanhar (o
  Dependabot mantém os dois).
- Cada job ainda repete a linha do checkout.

## Referências

- `.github/workflows/ci.yml`, `.github/actions/setup/action.yml`.
- [GitHub — Security hardening: pin actions to a full-length commit SHA](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)
