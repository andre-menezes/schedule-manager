# ADR-0000: Template de ADR (exemplo)

> Este é um ADR de exemplo/base, não uma decisão real. Serve como referência de
> preenchimento. O template fonte de verdade fica em `agent/templates/adr.md`.
> Para criar uma nova ADR, copie o template e numere sequencialmente.

- **Status:** Exemplo (não é uma decisão; ignorado no índice)
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** nenhuma

## Contexto e problema

Decisões arquiteturais do projeto precisavam de um registro formal, datado e
rastreável. Sem isso, o "porquê" das escolhas ficava disperso em guias e
comentários de configuração. Como padronizar o registro dessas decisões?

## Drivers da decisão

- Rastreabilidade histórica das decisões.
- Onboarding mais rápido de novos integrantes e de agentes de IA.
- Consistência com o restante da documentação (português, UTF-8).

## Opções consideradas

- **MADR** — formato Markdown estruturado (status, contexto, opções, decisão,
  consequências).
- **Nygard** — formato original, mais enxuto.

## Decisão

Adotamos o formato **MADR**, com conteúdo em português, armazenado em
`docs/decisions/`. O MADR equilibra estrutura e legibilidade e documenta
alternativas e consequências de forma explícita.

## Consequências

### Positivas

- Decisões passam a ter contexto, alternativas e consequências registradas.
- Índice único em `docs/decisions/README.md`.

### Negativas / trade-offs

- Exige disciplina para manter as ADRs atualizadas conforme decisões evoluem.

### Neutras

- Cada decisão arquitetural nova gera um arquivo adicional no repositório.

## Referências

- `agent/templates/adr.md` — template fonte de verdade.
- `docs/decisions/README.md` — índice e convenções.
