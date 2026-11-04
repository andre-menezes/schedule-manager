# Prompt: Criar Feature

Use este prompt para acionar o agente na criação de uma nova funcionalidade.

## Comando

```text
Implemente a feature descrita em docs/specs/FEAT-XXX-<slug>.md seguindo o
workflow agent/workflows/create-feature.workflow.md.
```

## Variações

### Com spec existente

```text
Implemente a feature descrita em docs/specs/FEAT-001-customer-list.md.
Siga o workflow de criação de feature. Pergunte se tiver dúvidas.
```

### Sem spec (descrição direta)

```text
Preciso de uma página de listagem de clientes com:
- Tabela paginada com nome, email e status.
- Filtro por nome.
- Botão de criar novo cliente.
- Endpoint: GET /api/customers?page=1&limit=10&name=filtro

Crie a spec em docs/specs/ e implemente seguindo o workflow de criação de feature.
```

### Parcial (apenas frontend, sem backend pronto)

```text
Implemente o frontend da feature FEAT-002-customer-form.
O endpoint ainda não está pronto. Crie o service com o contrato esperado
e use dados mockados na view para desenvolvimento. Registre o endpoint
como [PENDENTE] na spec.
```

## O que o agente deve fazer

1. Ler `agent/core/CONTRACT.md` e `agent/core/PROCEDURE.md`.
2. Ler `agent/skills/vue-vuetify-dev/SKILL.md`.
3. Ler a spec da feature.
4. Executar `agent/workflows/create-feature.workflow.md`.
5. Entregar PR pronto para review.
