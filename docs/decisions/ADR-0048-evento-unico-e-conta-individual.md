# ADR-0048: Evento único para compromisso e atendimento, numa conta individual

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0025 (colocalização por módulo), ADR-0051 (datas e
  recorrência)

## Contexto e problema

O Agenda junta vida pessoal e atendimentos (ver
`docs/requirements/VISION.md`). Os dois aparecem na mesma grade, competem
pelo mesmo horário e repetem do mesmo jeito, mas o atendimento tem cliente,
serviço, preço, status e lembrete ao cliente. Também é preciso decidir quem é
o "dono" dos dados: uma pessoa ou uma organização. Como modelar os eventos e
a posse dos dados sem travar a evolução para equipes (R5)?

## Drivers da decisão

- Uma consulta só para montar a agenda de um período.
- Conflito, recorrência e lembrete com uma implementação só.
- MVP simples para uma pessoa, sem impedir equipe no futuro.

## Opções consideradas

- **Entidade `Event` com `kind` (`personal` | `appointment`)** e campos de
  atendimento opcionais — escolhida.
- **Entidades separadas (`PersonalEvent` e `Appointment`)**: tipos mais
  estritos, mas duas listas para mesclar na grade e lógica de recorrência e
  conflito duplicada.
- **Posse por organização desde o MVP**: prepara o R5, mas obriga convite,
  papéis e seleção de organização num produto que, no início, tem uma pessoa
  por conta.

## Decisão

- Adotamos um `Event` com `kind`. No frontend, o tipo é uma união
  discriminada (`PersonalEvent | AppointmentEvent`), para o TypeScript
  garantir que só o atendimento tem `client`, `service` e `status`.
- No MVP, todos os dados pertencem a uma `Account` (uma pessoa). As tabelas
  do backend já levam um `owner_id` em todos os registros, que no R5 passa a
  apontar para uma organização com membros.

## Consequências

### Positivas

- A grade, a busca e o cálculo de conflitos leem uma coleção só.
- Recorrência e lembrete valem para os dois tipos sem código duplicado.

### Negativas / trade-offs

- Campos opcionais que só valem para um tipo; a validação depende de `kind`
  (no Zod do formulário e no backend).
- O R5 exige migração de posse (conta → organização) e revisão desta ADR.

### Neutras

- O modo pessoal (US-091) é só uma preferência de interface: o modelo é o
  mesmo.

## Referências

- `docs/requirements/DOMAIN-MODEL.md`
