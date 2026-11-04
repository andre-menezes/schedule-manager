# docs/requirements — Requisitos do Agenda

Levantamento de requisitos do **Agenda**, sistema de agenda pessoal e de
atendimentos para profissionais autônomos. É a fonte de verdade do **o quê** e
do **porquê** do produto; o **como** fica nas ADRs (`docs/decisions/`) e nas
specs de feature (`docs/specs/`).

Voltar para o índice: [../README.md](../README.md)

## Documentos

| Documento                              | Conteúdo                                                          |
| -------------------------------------- | ----------------------------------------------------------------- |
| [VISION.md](VISION.md)                 | Problema, público, personas, proposta de valor, escopo e métricas |
| [REQUIREMENTS.md](REQUIREMENTS.md)     | Requisitos funcionais, não funcionais e regras de negócio         |
| [USER-STORIES.md](USER-STORIES.md)     | Épicos e histórias de usuário com critérios de aceite             |
| [DOMAIN-MODEL.md](DOMAIN-MODEL.md)     | Entidades, relacionamentos, ciclo de vida e glossário             |
| [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) | Pendências que precisam de decisão antes da implementação         |
| [../ROADMAP.md](../ROADMAP.md)         | Releases: MVP e evolução do produto                               |

## Como os documentos se ligam

```text
VISION ──► REQUIREMENTS (RF/RNF/RN) ──► USER-STORIES (US) ──► specs/FEAT-XXX ──► código
                 │                              │
                 └──────► decisions/ADR ◄───────┘
```

- Cada **requisito funcional** (`RF-XX`) aponta para as histórias que o
  realizam.
- Cada **história** (`US-XXX`) cita as regras de negócio (`RN-XX`) que valem
  para ela e a release em que entra.
- Quando uma história for implementada, ela vira uma **spec**
  (`docs/specs/FEAT-XXX-<slug>.md`, template em
  `agent/templates/feature-spec.md`) com endpoints, layout e checklist.
- Decisões que saem de `[PENDENTE]` viram **ADR** (política anti-achismo,
  `agent/core/CONTRACT.md`).

## Convenções

- **Prioridade (MoSCoW):** `Must` (sem isso não há release), `Should`
  (importante, entra se couber), `Could` (desejável), `Won't` (fora, por ora).
- **Releases:** `R0` fundação, `R1` MVP, `R2`–`R5` evolução (ver o
  [ROADMAP](../ROADMAP.md)).
- **Confiança:** o que não foi confirmado pelo dono do produto está marcado
  `[PENDENTE]` e listado em [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md).
- Documentos em português e UTF-8; identificadores de código em inglês.
