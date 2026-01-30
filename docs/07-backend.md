# 07 – Backend (Domínio & API)

## Objetivo do Backend

Fornecer uma API REST segura, simples e estável para suportar o MVP do produto, permitindo o consumo por aplicações mobile e, futuramente, web.

---

## Stack Tecnológica

- Node.js
- TypeScript
- Framework HTTP (ex: Fastify ou NestJS)
- PostgreSQL
- Autenticação JWT

---

## Princípios de Backend

- Backend agnóstico de frontend
- Regras de negócio centralizadas
- Validação de dados no servidor
- APIs previsíveis e versionadas

---

## Modelo de Domínio

### Usuário (User)

Responsável por acessar o sistema e gerenciar seus próprios dados.

Campos principais:

- id
- nome
- email
- senhaHash
- criadoEm

---

### Paciente (Patient)

Pessoa atendida pelo profissional.

Campos principais:

- id
- userId (dono)
- nome
- telefone
- observacoes
- criadoEm

---

### Atendimento (Appointment)

Registro de um atendimento agendado ou realizado.

Campos principais:

- id
- userId
- patientId
- dataHoraInicio
- dataHoraFim
- status (AGENDADO | REALIZADO | CANCELADO)
- observacoes
- criadoEm

---

## Relacionamentos

- User 1:N Patient
- User 1:N Appointment
- Patient 1:N Appointment

Todos os dados são isolados por usuário.

---

## Regras de Negócio

- Um usuário só acessa seus próprios pacientes e atendimentos
- Não pode haver dois atendimentos sobrepostos para o mesmo usuário
- Atendimento cancelado não pode ser marcado como realizado
- Atendimento realizado não pode ser editado (somente visualização)

---

## Endpoints (REST)

### Autenticação

- POST /auth/login
- POST /auth/register
- POST /auth/forgot-password

---

### Pacientes

- GET /patients
- POST /patients
- PUT /patients/:id
- GET /patients/:id

---

### Atendimentos

- GET /appointments?date=YYYY-MM-DD
- POST /appointments
- PUT /appointments/:id
- PATCH /appointments/:id/status

---

## Autenticação e Segurança

- JWT no header Authorization
- Hash de senha (bcrypt ou argon2)
- Validação de payloads
- Rate limit básico

---

## Versionamento de API

- Prefixo: /api/v1
- Mudanças incompatíveis geram nova versão

---

## Estrutura de Pastas (sugestão)

```
/src
 ├── modules
 │   ├── auth
 │   ├── users
 │   ├── patients
 │   └── appointments
 ├── shared
 │   ├── database
 │   ├── errors
 │   └── middlewares
 └── server.ts
```

---

## Decisões Técnicas

- API REST em vez de GraphQL (simplicidade no MVP)
- Regras críticas no backend
- Sem lógica de negócio no frontend

---

## Próximos Passos Técnicos

- Definir schema do banco (Prisma ou SQL)
- Implementar autenticação
- Criar endpoints do MVP
- Testes básicos de integração
