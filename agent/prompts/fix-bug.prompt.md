# Prompt: Corrigir Bug

Use este prompt para acionar o agente na correção de um bug.

## Comando

```text
Corrija o bug descrito abaixo seguindo o workflow
agent/workflows/fix-bug.workflow.md.
```

## Variações

### Com spec de bug

```text
Corrija o bug descrito em docs/specs/BUG-001-theme-persistence.md.
Siga o workflow de correção de bug.
```

### Com descrição direta

```text
Bug: ao alternar para o tema escuro e recarregar a página, a aplicação
volta para o tema claro.

Comportamento esperado: o tema escolhido é persistido em localStorage
(STORAGE_KEYS.THEME) e restaurado no carregamento da app.store.

Corrija seguindo o workflow de correção de bug.
```

### Com stacktrace

```text
Bug: erro no console ao abrir a tela de Decisões.

Erro: TypeError: Cannot read properties of null (reading 'status')
Arquivo: src/modules/showcase/views/DecisionsView.vue:42

O componente tenta acessar adr.status sem verificar null.
Corrija e adicione teste de regressão.
```

## O que o agente deve fazer

1. Ler `agent/core/CONTRACT.md` e `agent/core/PROCEDURE.md`.
2. Ler `agent/skills/vue-vuetify-dev/SKILL.md` e `agent/skills/testing/SKILL.md`.
3. Executar `agent/workflows/fix-bug.workflow.md`.
4. Entregar PR com correção + teste de regressão.
