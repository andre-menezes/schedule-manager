# ADR-0032: Chunks de vendor com `codeSplitting.groups` do Rolldown

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0012 (Vuetify como UI), ADR-0023 (Fontes e i18n)

## Contexto e problema

O `vite.config.ts` separava as dependências em `vendor-vue`, `vendor-vuetify`
e `vendor-i18n` com `build.rollupOptions.output.manualChunks`. Dois problemas:

- O teste do `vendor-vue` só reconhecia `vue`, `vue-router` e `pinia`. Os
  pacotes `@vue/*` (runtime-core, reactivity, shared, runtime-dom), que formam
  o runtime, ficavam de fora. Como o Rolldown inclui as dependências de cada
  grupo, o runtime ia parar no `vendor-i18n` (primeiro a importá-lo) e o
  `runtime-dom` no `vendor-vuetify`.
- No Vite 8, `rollupOptions` é alias deprecado de `rolldownOptions`. No
  Rolldown 1.2, `manualChunks` e `advancedChunks` são deprecados em favor de
  `output.codeSplitting`.

Como agrupar as dependências de forma previsível e na API atual?

## Drivers da decisão

- Cada chunk de vendor deve conter o pacote que dá nome a ele.
- Atualizar o Vuetify ou o vue-i18n não deve invalidar o cache do runtime do
  Vue, e vice-versa.
- Usar a API não deprecada do Rolldown, verificada nos tipos instalados.

## Opções consideradas

- **Corrigir o teste no `manualChunks`** — resolve o agrupamento, mas mantém a
  API deprecada.
- **`codeSplitting.groups` com prioridade** — escolhida.
- **Deixar o Rolldown decidir (sem grupos)** — chunks mudam de forma a cada
  build e misturam bibliotecas sem relação.

## Decisão

`build.rolldownOptions.output.codeSplitting.groups` define três grupos, com
regex que aceitam `/` e `\` como separador:

| Grupo            | Captura                                | Prioridade |
| ---------------- | -------------------------------------- | ---------- |
| `vendor-vue`     | `vue`, `vue-router`, `pinia`, `@vue/*` | 30         |
| `vendor-vuetify` | `vuetify`                              | 20         |
| `vendor-i18n`    | `vue-i18n`, `@intlify/*`               | 10         |

A prioridade maior do `vendor-vue` faz o runtime ficar nele mesmo quando outro
grupo o puxa como dependência. O restante (ex.: TanStack Query) segue o
agrupamento automático.

Medição do `pnpm build` (kB, bruto / gzip):

| Chunk            | Antes          | Depois         |
| ---------------- | -------------- | -------------- |
| `vendor-vue`     | 28,67 / 11,53  | 106,56 / 41,35 |
| `vendor-i18n`    | 100,70 / 38,04 | 34,66 / 12,85  |
| `vendor-vuetify` | 230,98 / 75,10 | 218,62 / 70,60 |
| `index`          | 66,36 / 21,19  | 66,35 / 21,16  |

## Consequências

### Positivas

- Cada chunk contém o que o nome diz; o cache do runtime sobrevive a
  atualizações do Vuetify e do vue-i18n.
- O build não usa mais opção deprecada.

### Negativas / trade-offs

- O total baixado na primeira visita não muda: os três vendors continuam no
  carregamento inicial.
- Uma biblioteca nova da família Vue (ex.: `@vueuse/*`) precisa entrar na regex
  se deve ficar no `vendor-vue`.

### Neutras

- `codeSplitting` ainda evolui no Rolldown; a opção é conferida nos tipos de
  `rolldown` a cada major do Vite.

## Referências

- `vite.config.ts` (bloco `build`).
- [Rolldown — manual code splitting](https://rolldown.rs/in-depth/manual-code-splitting)
