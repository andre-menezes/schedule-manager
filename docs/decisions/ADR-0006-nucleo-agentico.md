# ADR-0006: Núcleo de desenvolvimento agêntico em `agent/` com adapters por IDE

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** nenhuma

## Contexto e problema

O projeto é desenvolvido com apoio de agentes de IA em diferentes ferramentas
(Kiro, Cursor, Claude, Copilot). Cada ferramenta lê instruções de um local
próprio. Manter instruções duplicadas e potencialmente divergentes por
ferramenta é frágil. Como padronizar o comportamento do agente entre IDEs?

## Drivers da decisão

- Fonte de verdade única para o comportamento do agente.
- Portabilidade entre ferramentas de IA.
- Crescimento: suportar novos frameworks sem reescrever o núcleo.
- Autonomia com guarda-corpos (não instalar deps, não alterar build, não fazer
  push em main/develop).

## Opções consideradas

- **Núcleo único em `agent/` + adapters finos por IDE** — o conhecimento vive em
  `agent/` (core, skills, workflows, templates, prompts) e cada adapter aponta
  para ele.

> A alternativa de manter instruções completas e duplicadas por ferramenta é o
> que se evita, mas não foi formalmente avaliada e comparada na documentação.

## Decisão

Mantemos o conhecimento agêntico em `agent/`, dividido em `core` (contrato e
procedimento genéricos), `skills` (conhecimento por framework), `workflows`,
`templates` e `prompts`. Os adapters de cada IDE
(`.kiro/steering/project.md`, `.kiro/skills/*.md`, `.cursorrules`, `CLAUDE.md`,
`.github/copilot-instructions.md`) referenciam `agent/` como fonte de verdade. O
contrato inclui a política anti-achismo (CONFIRMADO/INFERIDO/PENDENTE).

## Consequências

### Positivas

- Uma mudança de comportamento é feita em um lugar e refletida em todas as IDEs.
- Suporte a novo framework = nova skill, sem mexer no core.

### Negativas / trade-offs

- Os adapters duplicam referências manualmente; toda adição de documento precisa
  ser propagada em cada adapter.

### Neutras

- Introduz uma estrutura de metadesenvolvimento (`agent/`) além do código-fonte.

## Referências

- `agent/README.md`, `agent/ARCHITECTURE.md` — estrutura e fluxo de dados.
- `agent/core/CONTRACT.md`, `agent/core/PROCEDURE.md`.
- Adapters: `.kiro/steering/project.md`, `.cursorrules`, `CLAUDE.md`,
  `.github/copilot-instructions.md`.
