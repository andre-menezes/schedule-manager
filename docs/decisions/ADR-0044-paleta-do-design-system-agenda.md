# ADR-0044: Paleta do design system Agenda

- **Status:** Descontinuada
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0012 (Vuetify como UI), ADR-0029 (emenda a paleta e
  os tons de texto)

> Nota (ADR-0047): a mudança desta ADR foi revertida a pedido do Andre, que
> preferiu o visual original do template (coral e azul). O texto fica como
> registro da decisão.

## Contexto e problema

O tema do Vuetify usava a paleta original do template: primary coral
`#FF8066`, secondary azul `#6D8CFF` e accent `#00B8A9`, a mesma nos dois
temas. Como texto sobre o fundo claro, essas cores ficavam abaixo do AA
(o coral em 2,3:1), por isso a ADR-0029 criou os tons `-text`. Os fundos
tonais (`*-variant`) eram cores com 10% de opacidade, sem um par `on-*`
definido.

O design system Agenda, desenhado no Figma, define uma nova identidade e as
cores de evento do futuro calendário. Como levar essa paleta ao tema sem
quebrar os componentes que já usam os nomes de cor atuais?

## Drivers da decisão

- Uma fonte de verdade para as cores: o arquivo do Figma.
- Contraste AA (4,5:1) nos dois temas, verificado pelo axe no E2E
  (ADR-0029).
- Nenhum componente muda: os nomes de cor atuais (`primary-text`,
  `accent-variant`, `light-grey`, `surface-variant`...) continuam valendo.
- Cores de evento prontas para o calendário, com fundo e texto em par.

## Opções consideradas

- **Aplicar a paleta do Agenda ao tema atual, mantendo os nomes**, que foi a
  escolha.
- **Renomear as cores para os tokens do Figma**: alinharia os nomes, mas
  exigiria mudar todos os componentes e testes de uma vez, sem ganho de
  comportamento.
- **Manter a paleta original**: não acompanha o design system.

## Decisão

Adotamos a paleta do design system Agenda em `src/app/providers/vuetify.ts`:

- **Marca índigo e neutros frios.** O primary passa a `#4162D9` (claro) e
  `#7A9CFE` (escuro); secondary e accent viram o mesmo teal (`#0A7F7A` e
  `#44B6AF`). Fundo, superfície e bordas usam cinzas frios (`#F4F7FB` e
  `#FFFFFF` no claro; `#111316` e `#1D1F23` no escuro).
- **Escalas OKLCH.** Cada matiz do Figma é uma escala de tons gerada em
  OKLCH, com luminosidade perceptual uniforme entre matizes; o tema usa os
  degraus dessa escala para base, `-variant` (fundo tonal), `-text` e `on-*`.
- **Contraste AA nos dois temas.** No claro, as cores base já passam como
  texto sobre a superfície (só `success` fica em 4,4:1 sobre o fundo); os
  tons `-text`, mais escuros, passam com folga (≥ 6:1). No escuro, as cores
  base são claras, os `on-*` são escuros e os `-text` passam de 8,5:1. O
  `medium-emphasis-opacity` 0,7 do tema claro continua.
- **Paleta por tema.** O objeto `palette` compartilhado deixa de existir;
  cada tema tem os próprios valores. Os `-variant` deixam de ser
  translúcidos e viram cores sólidas da escala.
- **Nomes novos:** `surface-bright`, `surface-light`, `border`,
  `primary-container` e `on-primary-container`.
- **Cores de evento.** Oito matizes (`indigo`, `teal`, `violet`, `pink`,
  `orange`, `amber`, `green`, `sky`), cada um com três cores por tema:
  `event-<matiz>` (borda e destaque), `event-<matiz>-bg` (fundo do bloco) e
  `on-event-<matiz>-bg` (texto do bloco, AA sobre o fundo).
- **Botões.** O Vuetify 4 já usa `text-transform: none` (texto em sentence
  case, como no design system) e raio de 4px (`rounded` padrão); nada muda.

Os testes de `src/test/app/vuetify.spec.ts` verificam que os dois temas
definem os mesmos nomes, as três cores de evento por matiz e o contraste AA
dos tons `-text` e do texto dos blocos de evento.

## Consequências

### Positivas

- O tema segue o Figma, e os componentes não mudam.
- O par fundo/texto de cada cor de evento está pronto para o calendário.
- O contraste passa a ser verificado também no teste unitário, além do axe.

### Negativas / trade-offs

- Secondary e accent ficaram iguais; continuam separados por compatibilidade.
- Os nomes do tema não são os mesmos tokens do Figma; a correspondência fica
  nesta ADR e no comentário do tema.
- Mudar uma cor no Figma ainda exige atualizar o tema à mão.

### Neutras

- `light-grey` e `surface-variant` passam a ter o mesmo valor.
- Texto em `success` sobre o fundo claro deve usar `success-text`, como a
  ADR-0029 já orienta.

## Referências

- `src/app/providers/vuetify.ts`, `src/test/app/vuetify.spec.ts`.
- Fonte de verdade (Figma): https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z
- [OKLCH (CSS Color Module Level 4)](https://www.w3.org/TR/css-color-4/#ok-lab)
