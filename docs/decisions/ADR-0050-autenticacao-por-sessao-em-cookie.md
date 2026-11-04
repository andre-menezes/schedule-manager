# ADR-0050: Autenticação com e-mail/senha e Google, sessão em cookie HttpOnly

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0021 (remoção da autenticação corporativa),
  ADR-0014 e ADR-0017 (descontinuadas, servem de referência), ADR-0049

## Contexto e problema

O template não tem autenticação (ADR-0021): todas as páginas são públicas. O
Agenda precisa de contas (US-001 a US-004), de rotas protegidas e de algumas
páginas públicas (confirmação pelo cliente — US-081; agendamento online —
R2). Onde guardar a sessão e como proteger as rotas?

## Drivers da decisão

- Segurança contra XSS e CSRF (RNF-06).
- Simplicidade no frontend.
- Login com Google no R1.

## Opções consideradas

- **Sessão no servidor com cookie `HttpOnly; Secure; SameSite=Lax`** e token
  CSRF em header — recomendada.
- **JWT no `localStorage`**: simples, mas exposto a XSS e sem revogação.
- **Provedor gerenciado (Auth0, Clerk, Cognito)**: menos código, custo por
  usuário ativo e dependência do fornecedor nas telas de login.

## Decisão

Propomos:

- O backend emite a sessão em cookie `HttpOnly`; o frontend nunca lê o token.
  Mutações levam o header `X-CSRF-Token` (o padrão da ADR-0015, descontinuada,
  é a referência).
- O frontend descobre a sessão com `GET /api/v1/me` ao iniciar e guarda o
  usuário num store Pinia (`shared/stores`, ADR-0009).
- As rotas declaram `meta.public: true` quando não exigem login; o guard
  global do router manda as demais para `/entrar?redirect=...`. Um 401 em
  qualquer chamada limpa o store e redireciona.
- Google via OAuth 2.0 / OIDC com o fluxo de código feito pelo backend.

## Consequências

### Positivas

- O token não fica acessível ao JavaScript.
- Logout e "encerrar outras sessões" (US-003) são revogações no servidor.

### Negativas / trade-offs

- Frontend e API precisam do mesmo site (ou CORS com credenciais e
  `SameSite=None`), o que pesa na escolha da hospedagem.
- Fica a cargo do backend: hash de senha, limite de tentativas e e-mails.

### Neutras

- A ADR-0021 deixa de valer para as rotas do Agenda quando esta for aceita.

## Referências

- `src/app/routes.ts`, `src/shared/stores/`
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
