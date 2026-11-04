# ADR-0051: Datas em UTC com fuso IANA e recorrência pela RFC 5545

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0048, ADR-0049

## Contexto e problema

Agenda é, antes de tudo, data e hora. Erros comuns: um evento semanal que
"pula" uma hora no horário de verão, um evento de dia inteiro que muda de dia
quando o fuso muda, um cliente em outro fuso que vê o horário errado na
página pública (R2). O `Date` do JavaScript não tem fuso nem datas sem hora.
Como representar e calcular datas no frontend e no contrato?

## Drivers da decisão

- Correção em horário de verão e entre fusos (RNF-10).
- Recorrência com exceções (US-065, US-066).
- Tamanho do bundle (RNF-05).

## Opções consideradas

- **`Temporal` (com polyfill onde faltar)**: API nova da linguagem, com fuso e
  datas sem hora; suporte nativo ainda desigual entre navegadores.
- **`date-fns` + `@date-fns/tz`**: funções puras, tree-shaking, fusos IANA;
  é a opção madura de hoje.
- **Day.js / Luxon**: boas APIs; Luxon é maior, Day.js depende de plugins
  para fuso.

## Decisão

Propomos:

- **Contrato:** instantes em ISO 8601 UTC (`2026-11-04T13:00:00Z`); eventos
  de dia inteiro como data local (`2026-11-04`); a conta tem `timeZone` IANA
  (`America/Sao_Paulo`).
- **Recorrência:** regra no formato RRULE da RFC 5545, guardada com o fuso de
  origem; exceções por `originalStart`. O backend expande as ocorrências do
  intervalo pedido; o frontend não expande séries.
- **Frontend:** `date-fns` + `@date-fns/tz` para formatar e fazer contas de
  calendário (início da semana, grade, navegação), concentrados em
  `shared/utils/date.ts`, com testes de horário de verão. Reavaliar
  `Temporal` quando o suporte nativo cobrir a RNF-14.

A dependência nova só entra com a aprovação desta ADR (CONTRACT.md, item 5).

## Consequências

### Positivas

- Um lugar só para as regras de data no frontend.
- Recorrência interoperável com Google e iCal (R2/R3).

### Negativas / trade-offs

- Mais uma dependência (~10–20 kB gzip, com tree-shaking).
- A expansão de recorrência no servidor exige uma chamada por período (o
  cache do TanStack Query compensa).

### Neutras

- `Intl.DateTimeFormat` continua formatando no locale ativo (ADR-0038).

## Referências

- [RFC 5545 — iCalendar](https://www.rfc-editor.org/rfc/rfc5545)
- [date-fns](https://date-fns.org/), [TC39 Temporal](https://tc39.es/proposal-temporal/docs/)
