# 16 – Playbook de Uso do Claude (Prompts Oficiais)

## Objetivo

Definir um **playbook oficial de uso do Claude** para este SaaS, garantindo que a IA atue como **orientador técnico e revisor**, mantendo consistência, qualidade e aderência total à documentação do projeto.

Este documento padroniza **como conversar com a IA**, evitando respostas genéricas, geração indevida de código e decisões desalinhadas.

---

## Princípios Fundamentais

1. **Você escreve o código**
2. **IA valida e orienta**
3. **Código só é gerado sob solicitação explícita**
4. **Documentação é sempre referenciada**
5. **Respostas devem ser técnicas, objetivas e acionáveis**

---

## Contexto Base (Sempre Ativo no Claude)

Sempre manter como contexto fixo:

- Documentos `/docs` do projeto
- Documento 15 – Agentes de IA
- Documento 14 – Testes e Qualidade
- Documento 05 – Arquitetura

---

## Tipos de Interação Padronizados

### 1. Validação de Código (Padrão)

**Uso**: Após escrever código

**Prompt**:

> "Valide este código conforme os Documentos 05, 14 e 15. Não gere código, apenas analise e sugira melhorias."

**Resposta Esperada**:

- Aderência à arquitetura
- Pontos de melhoria
- Riscos técnicos
- Observações de testabilidade

---

### 2. Revisão Arquitetural

**Uso**: Decisões estruturais

**Prompt**:

> "Avalie esta decisão arquitetural conforme o Documento 05 e a Clean Architecture."

---

### 3. Avaliação de Regras de Negócio

**Uso**: Implementação de regras

**Prompt**:

> "Esta implementação atende as regras de negócio descritas no Documento 15? Aponte desvios."

---

### 4. Avaliação de Testes

**Uso**: Após criar testes

**Prompt**:

> "Avalie estes testes conforme o Documento 14. Eles cobrem os cenários corretos?"

---

### 5. Geração Controlada de Código (Exceção)

⚠️ **Usar somente quando necessário**

**Prompt**:

> "Gere código para X seguindo rigorosamente toda a documentação do projeto."

**Obrigatório**:

- Contexto completo
- Camada especificada
- Linguagem definida

---

### 6. Refatoração Assistida

**Uso**: Código existente

**Prompt**:

> "Sugira refatorações para este código mantendo comportamento e sem reescrever tudo."

---

### 7. Análise de Dívida Técnica

**Uso**: Periodicamente

**Prompt**:

> "Identifique possíveis dívidas técnicas neste módulo e priorize riscos."

---

## Prompt Anti‑Padrão (Evitar)

❌ "Melhore esse código"
❌ "Refatore isso"
❌ "Faça do jeito certo"

Motivo: Ambíguos, geram respostas genéricas e inconsistentes.

---

## Estrutura Esperada das Respostas da IA

Toda resposta deve conter:

1. Diagnóstico técnico
2. Referência à documentação
3. Impacto (baixo / médio / alto)
4. Sugestão clara (sem código, salvo permissão)

---

## Checklists Rápidos

### Antes de Comitar

- Código validado pela IA
- Testes criados/atualizados
- Nenhuma violação arquitetural

### Antes de Criar Nova Feature

- Fluxo definido
- Requisitos claros
- Impacto avaliado

---

## Integração com Agentes de IA

Este playbook ativa corretamente:

- Agente de Execução Assistida por IA
- Agente de Arquitetura
- Agente de Testes
- Agente de Produto

---

## Critério de Maturidade

Você está usando o Claude corretamente quando:

- A IA questiona decisões
- Bugs são identificados cedo
- Refatorações são seguras
- Código permanece legível ao longo do tempo

---

## Próximo Documento Opcional

➡️ **17 – Estratégia de Monitoramento, Logs e Observabilidade**
