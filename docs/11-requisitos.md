# 11 – Requisitos Funcionais e Não Funcionais

## Objetivo

Definir de forma clara e objetiva **o que o sistema deve fazer** (requisitos funcionais) e **como ele deve se comportar** (requisitos não funcionais), servindo como referência obrigatória para decisões técnicas e validação do MVP.

Este documento evita:

- Ambiguidade de escopo
- Decisões técnicas conflitantes
- Crescimento desordenado do produto

---

## Requisitos Funcionais (RF)

### RF-01 – Autenticação de Usuário

O sistema deve permitir que o usuário:

- Crie uma conta
- Realize login
- Recupere senha

Restrições:

- Email deve ser único
- Senha deve ser armazenada de forma segura (hash)

---

### RF-02 – Gerenciamento de Pacientes

O sistema deve permitir que o usuário:

- Cadastre pacientes
- Edite pacientes
- Liste pacientes
- Visualize dados básicos do paciente

Restrições:

- Pacientes pertencem exclusivamente ao usuário autenticado

---

### RF-03 – Gerenciamento de Atendimentos

O sistema deve permitir que o usuário:

- Crie atendimentos
- Edite atendimentos (quando permitido)
- Cancele atendimentos
- Marque atendimentos como realizados
- Liste atendimentos por data

Restrições:

- Não permitir atendimentos sobrepostos (exceto quando o existente estiver cancelado)
- Atendimentos realizados não podem ser editados
- Não permitir agendamento em data/hora anterior à atual
- Duração da sessão configurável (padrão: 1 hora)
- Horários disponíveis gerados automaticamente com base no expediente do profissional
- Último horário de agendamento deve respeitar o fim do expediente menos a duração da sessão

---

### RF-04 – Visualização da Agenda Diária

O sistema deve:

- Exibir a agenda do dia atual por padrão
- Destacar o próximo atendimento
- Exibir status do atendimento

---

### RF-05 – Isolamento de Dados

O sistema deve garantir que:

- Um usuário não visualize dados de outro usuário

---

## Requisitos Não Funcionais (RNF)

### RNF-01 – Usabilidade

- O sistema deve ser utilizável prioritariamente em dispositivos móveis
- Fluxos principais devem exigir o mínimo de interações
- Não deve exigir treinamento prévio

---

### RNF-02 – Performance

- Listagens devem responder em até 2 segundos
- Criação de atendimento deve ocorrer em tempo quase imediato

---

### RNF-03 – Segurança

- Autenticação via JWT
- Senhas armazenadas com hash seguro
- Proteção básica contra brute force

---

### RNF-04 – Disponibilidade

- Sistema deve estar disponível 24/7, exceto manutenções programadas

---

### RNF-05 – Escalabilidade

- Arquitetura deve permitir crescimento de usuários sem reescrita

---

### RNF-06 – Manutenibilidade

- Código organizado por domínio
- Documentação mínima obrigatória
- Fácil inclusão de novas funcionalidades

---

## Fora de Escopo (Reforço)

Explicitamente fora do MVP:

- Pagamentos
- Relatórios
- Integrações externas
- Multiusuário

---

## Critérios de Aceitação Global

O MVP é considerado aceito quando:

- Todos os RFs estão implementados
- Nenhum RNF crítico é violado
- O sistema pode ser usado integralmente via celular

---

## Próximo Documento Relacionado

➡️ **12 – Fluxos do Usuário (User Flows)**

Este documento detalhará como os requisitos se conectam na prática.
