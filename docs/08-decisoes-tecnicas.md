# 08 – Planejamento Técnico

## Objetivo

Transformar o escopo do MVP e a arquitetura definida em um **plano de execução técnico**, com etapas claras, ordem correta de implementação e tarefas acionáveis, reduzindo riscos e retrabalho.

---

## Estratégia Geral de Execução

Ordem correta de desenvolvimento:

1. Fundação técnica
2. Backend (core do sistema)
3. Frontend mobile
4. Integração
5. Validação do MVP

Essa ordem garante que o frontend nunca fique bloqueado por decisões atrasadas de backend.

---

## Fase 1 – Fundação Técnica

### Tarefas

- Criar repositório Git
- Definir padrão de commits
- Configurar lint e formatter
- Definir variáveis de ambiente
- Estruturar pastas do backend

**Critério de saída**: projeto sobe localmente sem regras de negócio.

---

## Fase 2 – Backend (MVP)

### 2.1 Autenticação

- Cadastro de usuário
- Login
- Geração de JWT
- Middleware de autenticação

### 2.2 Domínio Paciente

- Criar tabela de pacientes
- CRUD básico
- Validações de ownership (userId)

### 2.3 Domínio Atendimento

- Criar tabela de atendimentos
- Criar atendimento
- Listar atendimentos por data
- Alterar status
- Regras de conflito de horário

**Critério de saída**: API funcional para todo o MVP.

---

## Fase 3 – Frontend Mobile

### 3.1 Fundação

- Criar projeto React Native
- Configurar navegação
- Configurar consumo de API
- Gerenciamento de estado

### 3.2 Telas Essenciais

- Login
- Cadastro
- Agenda do dia
- Criar atendimento
- Lista de pacientes

**Critério de saída**: usuário consegue usar o sistema ponta a ponta.

---

## Fase 4 – Integração e Ajustes

- Ajustar fluxos UX
- Tratar erros de API
- Loading states
- Feedback visual

---

## Fase 5 – Validação do MVP

- Uso real por pelo menos 1 profissional
- Ajustes baseados em feedback
- Correção de gargalos

---

## Controle de Escopo

Qualquer funcionalidade que:

- não seja usada diariamente
- não destrave o fluxo principal

➡️ fica fora do MVP.

---

## Definição de Pronto (MVP)

- Usuário cria conta
- Cadastra paciente
- Agenda atendimento
- Visualiza agenda diária
- Marca atendimento como realizado

---

## Próximo Passo Técnico

Após este planejamento, o próximo agente recomendado é:

➡️ **Agente de Dados (Banco & Schema)**

Para transformar o domínio em tabelas reais.
