# docs/specs

Pasta para specs de features e bugs. Cada spec é um markdown descrevendo o
requisito completo que o agente de IA (ou desenvolvedor) vai implementar.

## De onde vêm as specs

Cada spec nasce de uma ou mais histórias de
[`../requirements/USER-STORIES.md`](../requirements/USER-STORIES.md), na ordem
do [`../ROADMAP.md`](../ROADMAP.md). A spec cita as histórias (`US-XXX`) e as
regras de negócio (`RN-XX`) que implementa, e detalha endpoints, layout e
estados que a história não cobre.

## Como criar uma nova spec

1. Copie o template de `agent/templates/feature-spec.md`.
2. Renomeie para `FEAT-<número>-<slug>.md` (ex: `FEAT-001-customer-list.md`).
3. Preencha todas as seções.
4. Acione o agente com a referência à spec.

## Convenção de nomes

- Features: `FEAT-XXX-<slug>.md`
- Bugs: `BUG-XXX-<slug>.md`

## Template

O template fonte de verdade está em: [`agent/templates/feature-spec.md`](../../agent/templates/feature-spec.md)

## Decisões arquiteturais

Se, durante a implementação de uma spec, surgir uma decisão arquitetural
relevante (nova biblioteca, novo padrão, escolha entre abordagens válidas),
registre-a como ADR em [`../decisions/`](../decisions/README.md).
