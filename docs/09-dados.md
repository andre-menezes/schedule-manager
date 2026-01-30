# 09 – Dados (Banco & Schema)

## Objetivo

Definir o **modelo de dados oficial do sistema**, garantindo integridade, clareza de domínio e preparo para crescimento, servindo como base direta para a implementação do backend.

---

## Estratégia de Persistência

- Banco relacional
- Forte integridade referencial
- Regras críticas garantidas no banco
- Backend responsável por validações adicionais

Banco escolhido:

- **PostgreSQL**

---

## Entidades Principais

### User

Representa o profissional que utiliza o sistema.

Campos:

- id (UUID, PK)
- name (varchar, obrigatório)
- email (varchar, único, obrigatório)
- password_hash (varchar, obrigatório)
- created_at (timestamp)
- updated_at (timestamp)

Restrições:

- email único

---

### Patient

Representa um paciente pertencente a um usuário.

Campos:

- id (UUID, PK)
- user_id (UUID, FK -> User.id)
- name (varchar, obrigatório)
- phone (varchar, opcional)
- notes (text, opcional)
- created_at (timestamp)
- updated_at (timestamp)

Restrições:

- paciente sempre pertence a um usuário

---

### Appointment

Representa um atendimento agendado.

Campos:

- id (UUID, PK)
- user_id (UUID, FK -> User.id)
- patient_id (UUID, FK -> Patient.id)
- start_at (timestamp, obrigatório)
- end_at (timestamp, obrigatório)
- status (enum: AGENDADO | REALIZADO | CANCELADO)
- notes (text, opcional)
- created_at (timestamp)
- updated_at (timestamp)

Restrições:

- start_at < end_at
- não permitir sobreposição de horários para o mesmo usuário

---

## Relacionamentos

- User 1:N Patient
- User 1:N Appointment
- Patient 1:N Appointment

Todos os registros são isolados por user_id.

---

## Índices

- User.email (unique)
- Patient.user_id
- Appointment.user_id
- Appointment.start_at

---

## Regras Garantidas no Banco

- Integridade referencial via FK
- Exclusão em cascata opcional (avaliar):
  - User -> Patient
  - User -> Appointment

---

## Estratégia de Migração

- Migrações versionadas
- Histórico imutável
- Nunca alterar migração já aplicada

Ferramentas possíveis:

- Prisma
- Knex
- SQL puro

---

## Decisões de Dados

- UUID como PK (segurança e escalabilidade)
- Enum para status de atendimento
- Timestamps em UTC

---

## Próximo Passo

Com o modelo de dados definido, o próximo passo é:

➡️ **Iniciar implementação do backend**, seguindo fielmente o domínio e o schema definidos.
