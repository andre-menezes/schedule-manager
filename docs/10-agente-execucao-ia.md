# 10 – Agente de Execução Assistida por IA

## Objetivo

Definir **como a IA será usada no dia a dia do desenvolvimento**, de forma estruturada, previsível e produtiva, atuando como **copiloto técnico**, e não como substituto de raciocínio.

Este agente existe para:

- Aumentar velocidade de execução
- Reduzir carga cognitiva
- Evitar decisões ruins por pressa
- Padronizar a interação com IA

---

## Princípio Fundamental

> **A IA não decide o que construir. Ela ajuda a construir melhor o que já foi decidido.**

Todas as decisões vêm dos documentos anteriores:

- Produto
- Arquitetura
- Backend
- Dados

---

## Papéis da IA na Execução

A IA pode atuar como:

1. Arquiteto auxiliar (validação de decisões)
2. Programador assistente (geração e revisão de código)
3. Revisor técnico (bugs, edge cases, performance)
4. Documentador automático
5. Criador de testes

Nunca como:

- Dono do produto
- Tomador de decisão de negócio

---

## Fluxo Diário de Trabalho com IA

### 1. Antes de Codar

Prompt padrão:

"Vou implementar a funcionalidade X.
Contexto:

- Produto: (resumo curto)
- Backend/Frontend: (qual camada)
- Regras envolvidas: (copiar do doc)
  Valide se estou esquecendo algo técnico relevante."

Objetivo: evitar lacunas de pensamento.

---

### 2. Durante a Implementação

Usos permitidos:

- Gerar boilerplate
- Criar DTOs
- Criar migrations
- Criar handlers simples

Prompt padrão:

"Gere apenas o código de Y, seguindo:

- Stack definida
- Regras do domínio
- Sem inventar funcionalidades"

---

### 3. Revisão de Código

Prompt padrão:

"Revise este código considerando:

- Regras de negócio
- Segurança
- Edge cases
- Simplicidade

Sugira melhorias sem alterar o escopo."

---

### 4. Escrita de Testes

Prompt padrão:

"Crie testes para este código cobrindo:

- Caso feliz
- Casos inválidos
- Regras críticas"

---

### 5. Documentação

Usar IA para:

- Atualizar docs
- Gerar README
- Registrar decisões

---

## Anti‑Padrões (Proibidos)

- Copiar código sem entender
- Pedir arquitetura sem contexto
- Pedir feature nova sem passar pelo Produto
- Aceitar código que viola domínio

---

## Checklists de Validação

Antes de aceitar código gerado por IA:

- Compila?
- Segue o domínio?
- Viola alguma regra do banco?
- Introduz acoplamento desnecessário?

Se qualquer resposta for "não sei", **rever manualmente**.

---

## Métricas de Uso Saudável da IA

- IA reduz tempo, não qualidade
- Código continua simples
- Decisões continuam conscientes

---

## Evolução do Agente

Este documento deve ser ajustado conforme:

- O produto cresce
- A complexidade aumenta
- Novos padrões surgem

---

## Próximo Passo

Com o Agente de Execução definido, o fluxo ideal agora é:

➡️ **Iniciar Backend**, usando a IA como copiloto estruturado.
