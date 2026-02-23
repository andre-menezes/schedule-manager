# 12 – Fluxos do Usuário (User Flows)

## Objetivo

Descrever de forma sequencial e objetiva **como o usuário interage com o sistema**, conectando requisitos funcionais, telas e ações, com foco no **uso real em dispositivos móveis**.

Este documento serve para:

- Guiar o desenvolvimento do frontend
- Validar fluxos antes de codar
- Evitar telas e ações desnecessárias
- Alinhar UX, Produto e Backend

---

## Princípios dos Fluxos

- Mobile-first
- Caminho feliz sempre evidente
- Mínimo de passos por tarefa
- Erros tratados com feedback claro

---

## Fluxo 1 – Primeiro Acesso (Cadastro)

**Pré-condição**: usuário não autenticado

1. Usuário abre o app
2. Visualiza tela de login
3. Seleciona "Criar conta"
4. Informa nome, email e senha
5. Confirma cadastro
6. Sistema cria conta
7. Usuário é redirecionado para a agenda do dia

**Erros possíveis**:

- Email já cadastrado
- Senha inválida

**Resultado esperado**:

- Usuário autenticado
- Agenda vazia exibida

---

## Fluxo 2 – Login

**Pré-condição**: usuário possui conta

1. Usuário abre o app
2. Informa email e senha
3. Confirma login
4. Sistema valida credenciais
5. Usuário acessa agenda do dia

**Erros possíveis**:

- Credenciais inválidas

---

## Fluxo 3 – Visualização da Agenda do Dia

**Pré-condição**: usuário autenticado

1. Sistema exibe automaticamente a agenda do dia atual
2. Atendimentos são listados por horário
3. Próximo atendimento é destacado
4. Usuário pode:
   - Criar novo atendimento
   - Selecionar um atendimento existente

---

## Fluxo 4 – Criar Atendimento

**Pré-condição**: usuário autenticado

1. Usuário toca em "Novo atendimento"
2. Seleciona paciente
3. Visualiza grid de horários disponíveis do dia
4. Seleciona horário (slots ocupados aparecem desabilitados)
5. Opcionalmente adiciona observações
6. Confirma criação
7. Sistema valida conflitos e data/hora
8. Atendimento é criado
9. Usuário retorna à agenda

**Erros possíveis**:

- Horário em conflito
- Data/hora no passado
- Dados obrigatórios ausentes

---

## Fluxo 5 – Marcar Atendimento como Realizado

**Pré-condição**: atendimento agendado

1. Usuário seleciona atendimento
2. Toca em "Marcar como realizado"
3. Sistema atualiza status
4. Atendimento fica bloqueado para edição

---

## Fluxo 6 – Cancelar Atendimento

**Pré-condição**: atendimento agendado

1. Usuário seleciona atendimento
2. Toca em "Cancelar"
3. Confirma ação
4. Sistema atualiza status
5. Atendimento permanece visível como cancelado

---

## Fluxo 7 – Cadastro de Paciente

**Pré-condição**: usuário autenticado

1. Usuário acessa área de pacientes
2. Toca em "Novo paciente"
3. Informa nome e dados opcionais
4. Confirma cadastro
5. Paciente fica disponível para agendamento

---

## Fluxo 8 – Edição de Paciente

**Pré-condição**: paciente existente

1. Usuário seleciona paciente
2. Edita dados permitidos
3. Confirma alteração
4. Sistema salva alterações

---

## Estados de Erro e Feedback

- Mensagens claras e objetivas
- Feedback visual imediato
- Nenhum erro técnico exposto ao usuário

---

## Fora de Escopo dos Fluxos

- Pagamentos
- Notificações automáticas
- Relatórios

---

## Conexão com Outros Documentos

- Requisitos Funcionais (doc 11)
- UX (doc 04)
- Backend (doc 07)

---

## Próximo Documento Relacionado

➡️ **13 – Contratos de API (OpenAPI simplificado)**

Este documento permitirá alinhar frontend, backend e IA no nível de integração.
