# [FEAT-001] CRUD de clientes (exemplo canônico)

## Contexto

O template demonstra as camadas, mas não tinha um fluxo de dados de ponta a
ponta. Um módulo `customers` com listagem paginada, detalhe, cadastro, edição
e exclusão fecha essa lacuna e vira o exemplo canônico citado no Onboarding
(roadmap, item 2.1). Decisões em [ADR-0039](../decisions/ADR-0039-crud-de-exemplo-e-api-simulada.md).

## Requisitos funcionais

- [x] RF01: Listar clientes em páginas, com 10, 25 ou 50 itens por página.
- [x] RF02: Buscar clientes por nome ou e-mail.
- [x] RF03: Exibir o detalhe de um cliente.
- [x] RF04: Cadastrar um cliente.
- [x] RF05: Editar um cliente.
- [x] RF06: Excluir um cliente, com confirmação.

## Regras de negócio

| Código | Regra                                                                     |
| ------ | ------------------------------------------------------------------------- |
| RN01   | Nome e e-mail são obrigatórios; o e-mail precisa ter formato válido.      |
| RN02   | O e-mail é único entre os clientes (a API responde 409).                  |
| RN03   | Telefone é opcional; vazio é gravado como `null`.                         |
| RN04   | Cliente novo começa ativo.                                                |
| RN05   | Página, tamanho da página e busca ficam na URL; uma busca nova volta à 1. |
| RN06   | Trocar o tamanho da página volta à primeira página.                       |
| RN07   | Id inexistente mostra "cliente não encontrado"; id não numérico, a 404.   |

## Critérios de aceite

- [x] CA01: Dado a lista, quando avanço a página, então a URL e a tabela mudam e "voltar" retorna à página anterior.
- [x] CA02: Dado a lista, quando busco "costa", então só os clientes com "costa" no nome ou e-mail aparecem.
- [x] CA03: Dado o formulário, quando salvo sem nome ou e-mail, então vejo a mensagem de campo obrigatório e nada é enviado.
- [x] CA04: Dado o formulário, quando salvo com um e-mail já cadastrado, então vejo o erro da API (HTTP 409).
- [x] CA05: Dado um cadastro ou edição bem-sucedido, então abro o detalhe do cliente.
- [x] CA06: Dado o detalhe, quando confirmo a exclusão, então volto para a lista sem o cliente.
- [x] CA07: Dado uma falha da API, então a tela mostra a mensagem do Problem Details (RFC 9457).
- [x] CA08: Testes unitários cobrindo todas as regras de negócio.
- [x] CA09: Teste E2E cobrindo o fluxo principal e o axe (WCAG A/AA).
- [x] CA10: Lint e build passando sem erros.

## Layout / Wireframe

```text
/customers                                   /customers/:id
┌──────────────────────────────────────┐     ┌──────────────────────────────┐
│ Clientes                [Novo cliente]│     │ ← Voltar para a lista        │
│ [Buscar por nome ou e-mail ] [Buscar] │     │ Maria Souza  [Editar][Excluir]│
│ Nome     E-mail     Situação  Cadastro│     │ E-mail / Telefone / Situação │
│ Ana ...  ana@...    Ativo     01/01   │     │ Cadastrado em                │
│ ...                                   │     └──────────────────────────────┘
│ Itens por página: 10   1-10 de 32 < > │     /customers/new, /customers/:id/edit
└──────────────────────────────────────┘     Nome, E-mail, Telefone, Ativo [Cancelar][Salvar]
```

## Endpoints envolvidos

| Método | Endpoint             | Descrição          | Body/Params                      |
| ------ | -------------------- | ------------------ | -------------------------------- |
| GET    | `/api/customers`     | Página de clientes | `?page=1&pageSize=10&search=`    |
| GET    | `/api/customers/:id` | Detalhe            | —                                |
| POST   | `/api/customers`     | Cadastra (201)     | `{ name, email, phone, active }` |
| PUT    | `/api/customers/:id` | Atualiza           | `{ name, email, phone, active }` |
| DELETE | `/api/customers/:id` | Exclui (204)       | —                                |

A listagem responde `{ items, total, page, pageSize }`. Erros seguem a
RFC 9457 (`application/problem+json`).

## Dependências

- [x] Backend: simulado no `pnpm dev` por `mock/customers.ts` (ADR-0039).

## Observações

- A validação usa VeeValidate + Zod (`customers/schemas.ts`, ADR-0042).
- Sem notificação de sucesso: depende do padrão de snackbar (roadmap 3.1).

---

## Checklist do agente (preenchido pela IA)

- [x] Spec lida e compreendida (sem dúvidas pendentes)
- [x] Branch criada: `feat/modulo-customers`
- [x] Módulo criado em `src/modules/customers/`
- [x] Tipos criados em `src/modules/customers/types.ts`
- [x] Service criado em `src/modules/customers/api/`
- [x] Query num composable do módulo (`useQuery`)
- [x] View container implementada
- [x] Componentes apresentacionais implementados
- [x] Testes unitários criados e passando
- [x] Teste E2E criado e passando
- [x] `pnpm lint` sem erros
- [x] `pnpm build` sem erros
- [x] `pnpm test` passando
- [x] Commits seguindo COMMIT-CONVENTIONS.md
- [x] PR aberto com descrição completa
