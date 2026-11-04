# ADR-0045: Componentes base e padrões do design system Agenda

- **Status:** Descontinuada
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0012 (Vuetify), ADR-0029 (contraste AA), ADR-0044
  (paleta do design system Agenda)

> Nota (ADR-0047): a mudança desta ADR foi revertida a pedido do Andre, que
> preferiu o visual original do template (coral e azul). O texto fica como
> registro da decisão.

## Contexto e problema

A ADR-0044 levou a paleta do design system Agenda (Figma) ao tema, mas o
resto do sistema não chegou ao código:

- **Tipografia:** as telas usam `text-h4`, `text-body-2`, `text-overline`…,
  nomes do MUI que o design system adota. O Vuetify 4 só gera as classes do
  Material 3 (`text-body-medium`…), então essas classes não tinham efeito:
  os títulos saíam com o tamanho padrão do navegador.
- **Forma:** botões elevados e cartões com sombra, enquanto o design system
  pede borda de 1px e sombra só no que flutua.
- **Componentes:** chip de status, avatar, cabeçalho de página, diálogo de
  confirmação e bloco de evento existiam no Figma, mas cada tela montaria os
  seus com `v-chip`, `v-avatar` e `v-dialog` soltos.

Como aplicar o design system de forma que uma tela nova já saia nele, sem
cada uma repetir classes e props?

## Drivers da decisão

- Fidelidade ao Figma: tipografia, raio, elevação e cores dos componentes.
- Uma tela nova herda o visual sem configurar nada.
- Componentes agnósticos de domínio em `shared/ui`, com contraste AA.
- Nenhuma dependência nova.

## Opções consideradas

- **Padrões globais do Vuetify + escala tipográfica em SCSS + componentes
  `Base*`** — escolhida.
- **Só componentes `Base*`, sem padrões globais** — os `v-btn`, `v-card` e
  `v-text-field` soltos continuariam fora do design system.
- **Biblioteca de componentes à parte** — sobra para um template com um
  só app.

## Decisão

1. **Tipografia** (`src/app/styles/typography.scss`): as classes do MUI
   (`text-h1`…`text-h6`, `text-subtitle-1/2`, `text-body-1/2`,
   `text-button`, `text-caption`, `text-overline`), com os tamanhos do
   Figma, e as variantes por breakpoint (`text-md-h3`…).
2. **Padrões dos componentes** (`componentDefaults` em
   `@app/providers/vuetify`): `VBtn` sem elevação (`flat`); `VCard` com
   borda e sem sombra; campos (`VTextField`, `VSelect`, `VTextarea`,
   `VAutocomplete`) em contorno, densidade `comfortable`; `VAlert` tonal;
   `VSwitch` inset; menus e diálogos com raio de 8px e sombra. Uma prop
   explícita no componente continua prevalecendo.
3. **Cores de status:** `<tom>-container` e `on-<tom>-container` para
   `success`, `warning`, `error`, `info` e `neutral` nos dois temas (tokens
   `<tom>/container` do Figma), com contraste AA verificado em teste.
4. **Componentes** em `src/shared/ui/components`:
   - `BaseStatusChip`: rótulo com o tom (`success`… `neutral`) e ícone.
   - `BaseAvatar`: iniciais sobre uma cor de evento estável pelo nome
     (`getInitials` e `hueFor` em `@shared/utils/avatar`); `decorative`
     quando o nome já está escrito ao lado.
   - `BasePageHeader`: o `<h1>` da tela, com sobretítulo, subtítulo e os
     slots `prepend` e `actions`.
   - `BaseConfirmDialog`: confirmação com tom `error` para ações
     destrutivas, carregamento e erro dentro do diálogo.
   - `BaseEventBlock`: bloco de compromisso nas oito cores de evento,
     normal ou compacto; com `clickable`, vira botão.
   - Tipos `EventHue` (com a lista `EVENT_HUES`) e `StatusTone` em
     `@typings/theme`.
5. **Uso:** o CRUD de clientes passa a usá-los (cabeçalhos, avatar, chip de
   situação e diálogo de exclusão, que substitui o `CustomerDeleteDialog`), e
   a vitrine de componentes ganha a seção "Design system Agenda".

## Consequências

### Positivas

- Telas novas saem no design system com os componentes do Vuetify e os
  `Base*`, sem classes repetidas.
- A tipografia das telas existentes passa a valer.

### Negativas / trade-offs

- Os padrões globais mudam o visual de todas as telas de uma vez (botões
  sem sombra, cartões com borda); uma tela que precise do visual antigo
  declara a prop.
- As classes tipográficas são CSS próprio do template: uma versão futura do
  Vuetify que volte a gerá-las pode conflitar.

### Neutras

- As visões de semana e de mês do Figma ficam para quando houver um módulo
  de agenda; o `BaseEventBlock` é a peça delas.

## Referências

- `src/app/styles/typography.scss`, `src/app/providers/vuetify.ts`,
  `src/shared/ui/components/Base*.vue`, `src/shared/utils/avatar.ts`.
- [Figma do design system Agenda](https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z)
