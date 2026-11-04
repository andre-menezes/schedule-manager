# ADR-0013: Migração de ícones para o Material Symbols

- **Status:** Aceita
- **Data:** 2026-09-01
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0012 (atualiza a decisão de ícones)

> Nota (ADR-0023): o import de `material-symbols/outlined.css` foi trocado por
> `src/app/styles/icons.scss`, que usa uma fonte gerada com só o eixo FILL
> variável (458 KB em vez de 3,96 MB). O uso dos ícones não mudou.

## Contexto e problema

A ADR-0012 adotou o Vuetify 4 com o conjunto de ícones **Material Design Icons**
(`@mdi/font`, prefixo `mdi-`). O time optou por padronizar a aplicação no
**Material Symbols** — a geração mais recente de ícones do Google, com maior
cobertura, variações (outlined/rounded/sharp) e alinhamento com o Material
Design 3. Como trocar o conjunto de ícones sem reescrever cada componente de
forma acoplada a uma biblioteca específica?

## Drivers da decisão

- Adotar o conjunto de ícones oficial e atual do Google (Material Symbols).
- Manter o uso idiomático do Vuetify (`<v-icon>`, props `icon`/`prepend-icon`).
- Isolar a biblioteca de ícones atrás de um icon set do Vuetify, para que uma
  futura troca afete um único ponto de configuração.

## Opções consideradas

- **Custom icon set do Vuetify + pacote `material-symbols`** — registrar um set
  próprio (`ms`) que renderiza a ligatura do ícone num
  `<span class="material-symbols-outlined">`, com o font self-hosted.
- **Set `md` embutido do Vuetify** — descartado: usa a classe `material-icons`
  (Material Icons, a geração anterior), não o Material Symbols.
- **CDN do Google Fonts** — descartado: o projeto roda atrás de proxy
  corporativo e prioriza dependências self-hosted (reprodutibilidade).

## Decisão

Substituímos o `@mdi/font` pelo pacote **`material-symbols`** (self-hosted) e
criamos um icon set customizado do Vuetify em `src/app/providers/icons.ts`
(`ms`), definido como `defaultSet`. O set renderiza a ligatura do ícone dentro
de um `<span class="material-symbols-outlined">`. Os componentes passam a
referenciar ícones pela **ligatura** (ex.: `icon="settings"`), sem prefixo. O
CSS é importado em `src/app/providers/vuetify.ts` via
`material-symbols/outlined.css`. Os aliases internos do Vuetify (usados por
componentes como `v-select`, `v-checkbox`) foram remapeados para as ligaturas
correspondentes.

## Consequências

### Positivas

- Conjunto de ícones atual e mais amplo do Google.
- A biblioteca fica isolada num único módulo (`icons.ts`); trocar de conjunto no
  futuro exige alterar apenas esse arquivo.
- Font self-hosted, sem dependência de CDN externo.
- Suporte à variante **preenchida** (eixo `FILL` da variable font): use o
  sufixo `-fill` no nome do ícone (`icon="favorite-fill"`) ou a classe
  utilitária `ms-fill`. O contorno permanece o padrão.

### Negativas / trade-offs

- A referência ao ícone muda de `mdi-<nome-kebab>` para a ligatura
  `<nome_snake>` do Material Symbols — exige conhecer o novo catálogo.
- O import `outlined.css` do `material-symbols` traz a variante outlined
  completa; se o peso do bundle for uma preocupação, avaliar subsets no futuro.
- Como os ícones são renderizados por um icon set customizado (`h()`), o
  tree-shaking do `vite-plugin-vuetify` não injeta o CSS base do `VIcon` —
  inclusive as regras de tamanho (`.v-icon--size-*`). Por isso, as regras de
  tamanho são declaradas manualmente em `src/app/styles/main.scss` para que a
  prop `size` (`small`/`large`/numérico) do `<v-icon>` funcione. Ao ajustar a
  escala de tamanhos, edite esse arquivo.

### Neutras

- Ícones passam a ser renderizados como `<span>` com ligatura (não mais via
  classe `mdi-*`).

## Referências

- `src/app/providers/icons.ts` — icon set `ms` e aliases.
- `src/app/providers/vuetify.ts` — import do CSS e `defaultSet: 'ms'`.
- `src/app/styles/main.scss` — regras de tamanho (`.v-icon--size-*`) e variante `ms-fill`.
- `package.json` — dependência `material-symbols`.
- Catálogo de ícones: https://fonts.google.com/icons
