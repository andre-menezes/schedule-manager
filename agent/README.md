# Agent — Núcleo de Desenvolvimento Agêntico

Agente reutilizável para desenvolvimento frontend com autonomia total.
Cobre criação de features, correção de bugs, validação de código e abertura de PR.

A primeira implementação cobre **Vue 3 + Vuetify 4 + TypeScript + Vite**.

## O que ele faz

Para cada tarefa recebida (feature ou bug), o agente executa o fluxo completo:

1. Lê a spec ou descrição do problema.
2. Pergunta se algo não estiver claro (nunca assume).
3. Cria branch seguindo convenção.
4. Implementa seguindo a arquitetura em camadas do projeto.
5. Valida (lint, type-check, testes).
6. Commita seguindo convenções de commit.
7. Faz push e abre Pull Request.

O desenvolvedor humano é responsável pelo code review e merge.

## Estrutura

```text
agent/
├── README.md              # Este arquivo
├── ARCHITECTURE.md        # Diagrama e camadas do agente
├── core/
│   ├── CONTRACT.md        # Princípios obrigatórios e política anti-achismo
│   └── PROCEDURE.md       # Fases do workflow (entrada → implementação → entrega)
├── skills/
│   ├── vue-vuetify-dev/   # Conhecimento Vue 3 + Vuetify + TS deste projeto
│   └── testing/           # Conhecimento de testes (Vitest + Playwright)
├── workflows/
│   ├── create-feature.workflow.md
│   ├── fix-bug.workflow.md
│   └── validate-code.workflow.md
├── templates/
│   ├── feature-spec.md    # Template de spec de feature
│   └── adr.md             # Template de ADR (decisão arquitetural)
└── prompts/
    ├── create-feature.prompt.md
    └── fix-bug.prompt.md
```

## Adapters (onde cada IDE lê)

Os adapters ficam nos locais que cada ferramenta reconhece automaticamente.
Eles referenciam o núcleo em `agent/` como fonte de verdade.

| Ferramenta | Arquivo do adapter                |
| ---------- | --------------------------------- |
| Kiro       | `.kiro/steering/*.md`             |
| Kiro       | `.kiro/skills/create-feature.md`  |
| Kiro       | `.kiro/skills/fix-bug.md`         |
| Cursor     | `.cursorrules`                    |
| Claude     | `CLAUDE.md`                       |
| Copilot    | `.github/copilot-instructions.md` |

Os adapters só apontam para os arquivos deste núcleo, sem repetir regras. Os
do Kiro incluem os arquivos do núcleo com `#[[file:...]]`, então o conteúdo
carregado é sempre o da fonte de verdade.

## Como usar

1. Abra o projeto na ferramenta de sua escolha (Kiro, Claude Code, Cursor, VS Code + Copilot).
2. A IDE carrega automaticamente as instruções do adapter correspondente.
3. Envie uma tarefa ao agente (feature spec ou descrição de bug).
4. O agente executa o fluxo completo conforme `core/PROCEDURE.md`.
5. Revise o PR gerado e faça merge.

## Princípios fundamentais

1. **Nunca assumir.** Se algo não está claro, perguntar antes de implementar.
2. **Ler antes de agir.** Documentação do projeto é fonte de verdade.
3. **Seguir padrões.** Não introduzir nada novo sem aprovação explícita.
4. **Evidenciar.** Toda decisão deve ter origem na spec ou na documentação.

## Limites

- Framework: Vue 3, TypeScript, Vuetify 4, Vite.
- Escopo por execução: uma feature ou um bug por vez.
- Não altera configurações de build/lint/tsconfig sem aprovação.
- Não instala dependências sem aprovação.
- Não faz push para main/develop.
