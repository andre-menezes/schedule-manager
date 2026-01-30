# 13 – Contratos de API (OpenAPI Simplificado)

## Objetivo

Definir contratos claros entre **frontend e backend**, descrevendo endpoints, payloads, respostas e erros esperados. Este documento serve como **fonte única de verdade** para implementação, testes e uso de IA na geração de código.

---

## Convenções Gerais

- Base URL: `/api/v1`
- Autenticação: `Authorization: Bearer <token>`
- Formato: JSON
- Datas em ISO 8601 (UTC)

---

## Autenticação

### POST /auth/register

**Request**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Responses**

- `201 Created`

```json
{ "token": "jwt" }
```

- `400 Bad Request`
- `409 Conflict` (email já cadastrado)

---

### POST /auth/login

**Request**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses**

- `200 OK`

```json
{ "token": "jwt" }
```

- `401 Unauthorized`

---

## Pacientes

### GET /patients

**Responses**

- `200 OK`

```json
[{ "id": "uuid", "name": "string" }]
```

---

### POST /patients

**Request**

```json
{
  "name": "string",
  "phone": "string",
  "notes": "string"
}
```

**Responses**

- `201 Created`

```json
{ "id": "uuid" }
```

- `400 Bad Request`

---

### PUT /patients/{id}

**Request**

```json
{
  "name": "string",
  "phone": "string",
  "notes": "string"
}
```

**Responses**

- `200 OK`
- `404 Not Found`

---

## Atendimentos

### GET /appointments?date=YYYY-MM-DD

**Responses**

- `200 OK`

```json
[
  {
    "id": "uuid",
    "patientId": "uuid",
    "startAt": "2026-01-01T10:00:00Z",
    "endAt": "2026-01-01T11:00:00Z",
    "status": "AGENDADO"
  }
]
```

---

### POST /appointments

**Request**

```json
{
  "patientId": "uuid",
  "startAt": "2026-01-01T10:00:00Z",
  "endAt": "2026-01-01T11:00:00Z",
  "notes": "string"
}
```

**Responses**

- `201 Created`
- `409 Conflict` (conflito de horário)

---

### PUT /appointments/{id}

**Request**

```json
{
  "startAt": "2026-01-01T10:00:00Z",
  "endAt": "2026-01-01T11:00:00Z",
  "notes": "string"
}
```

**Responses**

- `200 OK`
- `400 Bad Request`

---

### PATCH /appointments/{id}/status

**Request**

```json
{ "status": "REALIZADO | CANCELADO" }
```

**Responses**

- `200 OK`
- `400 Bad Request`

---

## Padrão de Erro

```json
{
  "error": "string",
  "message": "string"
}
```

---

## Conexão com Fluxos do Usuário

Cada endpoint está diretamente ligado aos fluxos descritos no documento 12.

---

## Uso com IA

Ao gerar código com IA, sempre fornecer:

- Este documento
- O fluxo correspondente
- A camada (frontend ou backend)

---

## Próximo Documento Relacionado

➡️ **16 – Estratégia de Deploy & Ambientes**
