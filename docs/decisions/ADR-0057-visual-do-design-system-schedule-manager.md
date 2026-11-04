# ADR-0057: Visual do produto pelo design system Schedule Manager (Figma)

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0044, ADR-0045 e ADR-0046 (retomadas por esta),
  ADR-0047 (substituída por esta), ADR-0029 (contraste AA), ADR-0052 (grade
  do calendário)

## Contexto e problema

O template voltou ao visual original (ADR-0047) e deixou em aberto a
identidade visual do produto (pendência Q-13). Em paralelo, o arquivo do
Figma do design system foi renomeado para **Schedule Manager - Design
System** e ganhou as telas e o protótipo do MVP (página **Telas · MVP**),
montados com os componentes, as variáveis e os estilos desse arquivo. Que
visual o código deve seguir?

## Drivers da decisão

- Uma fonte de verdade visual, já validada em protótipo navegável.
- Componentes de agenda prontos no design system: bloco de evento com oito
  cores, chip de status, avatar, item de lista, diálogo.
- Contraste AA nos dois temas (ADR-0029).

## Opções consideradas

- **Adotar o design system Schedule Manager do Figma** — escolhida.
- **Manter o visual original do template (ADR-0047)**: não tem bloco de
  evento, cores de evento nem chip de status, que o produto precisa desde a
  US-010.

## Decisão

- O visual do produto segue o arquivo **Schedule Manager - Design System**
  (https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z), nas páginas
  Fundamentos, Componentes e Padrões, e as telas da página **Telas · MVP**
  (node `33:116`) são a referência de layout das histórias.
- O tema do Vuetify volta a usar as variáveis do Figma (coleções Color,
  Spacing e Radius, modos Light e Dark), a escala tipográfica (Inter,
  estilos `text/*`) e as elevações (`elevation/1`–`4`).
- Os componentes base voltam a `src/shared/ui/components`, mapeados aos
  componentes do Figma: `Calendar event` → `BaseEventBlock`, `Chip` →
  `BaseStatusChip`, `Avatar` → `BaseAvatar`, `Dialog` → `BaseConfirmDialog`
  (além de `BasePageHeader` para a barra das telas).
- **Ponto de partida do código:** o que as ADR-0044, 0045 e 0046
  implementaram no `vue-template` (PRs #39, #40 e #41, revertidos pela
  ADR-0047) e pode ser reaplicado a partir do histórico daquele repositório,
  conferindo com o Figma atual.
- O nome exibido continua provisório ("Agenda" no código, "Schedule
  Manager" no Figma) até a Q-06 ser decidida.

## Consequências

### Positivas

- A grade do calendário (ADR-0052) e as telas do MVP têm componentes e
  cores definidos.
- O protótipo serve de critério de aceite visual nas specs.

### Negativas / trade-offs

- Trabalho no R0 para levar tema, tipografia e componentes ao código antes
  das telas.
- Mudança no Figma continua exigindo atualizar o tema à mão (como na
  ADR-0044).

### Neutras

- As ADRs 0044–0046 continuam com status Descontinuada no histórico do
  template; esta ADR registra que o produto retoma o que elas definiam.

## Referências

- Figma: https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z?node-id=33-116
- `src/app/providers/vuetify.ts`, `src/shared/ui/components/`
