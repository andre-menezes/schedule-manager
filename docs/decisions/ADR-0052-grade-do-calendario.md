# ADR-0052: Grade do calendário — decidir por spike

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0012 (Vuetify), ADR-0029 e ADR-0036
  (acessibilidade), ADR-0057 (design system Schedule Manager)

## Contexto e problema

As visões de dia, semana e mês (US-010 a US-016) são o coração do produto.
O design system Schedule Manager (ADR-0057) define o bloco de evento
(`Calendar event`, oito cores) e as grades de semana e mês na página
Padrões do Figma. A grade
precisa posicionar eventos sobrepostos, rolar até o horário de trabalho,
funcionar no celular, ser acessível por teclado e, como "Could", aceitar
arrastar. Construir ou adotar uma biblioteca?

## Drivers da decisão

- Fidelidade ao Figma (padrões Semana e Mês, telas Agenda · Dia/Semana/Mês).
- Acessibilidade AA verificada pelo axe (ADR-0029).
- Desempenho com 100+ eventos na semana.
- Licença compatível com uso comercial.

## Opções consideradas

- **Grade própria** com CSS Grid e `BaseEventBlock`: controle total do visual
  e da acessibilidade; custo de implementar o layout de sobreposição e o
  arrastar.
- **FullCalendar (Vue 3)**: completo e testado; visual e marcação próprios,
  difícil de alinhar ao tema; alguns recursos são pagos.
- **Schedule-X**: moderno, com adaptador Vue; ecossistema menor.
- **`VCalendar` do Vuetify**: integrado ao tema; verificar maturidade e
  recursos na versão 4.

## Decisão

Ainda não decidida. Propomos um **spike de 2 dias** (antes da US-010) que
monta a visão de semana com os mesmos dados nas opções acima e compara:
fidelidade ao Figma, resultado do axe, navegação por teclado, tempo de
renderização com 150 eventos, tamanho no bundle e licença. A recomendação
inicial é a **grade própria**, com a lógica de layout (colunas de
sobreposição) como função pura testada em `modules/calendar/`.

## Consequências

### Positivas

- A escolha fica baseada em medição, não em preferência.

### Negativas / trade-offs

- Dois dias sem entrega visível.

### Neutras

- Qualquer que seja a opção, os dados vêm do mesmo endpoint de ocorrências
  (ADR-0049).

## Referências

- [FullCalendar](https://fullcalendar.io/), [Schedule-X](https://schedule-x.dev/)
