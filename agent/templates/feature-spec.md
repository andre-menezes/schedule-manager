# [FEAT-XXX] Título da Feature

> Copie este template para criar uma nova spec. Renomeie o arquivo para
> `FEAT-<número>-<slug>.md` (ex: `FEAT-001-customer-list.md`).

## Contexto

Descrição do cenário e motivação para a feature. Explique o problema que está
sendo resolvido e qual o valor entregue ao usuário.

## Requisitos funcionais

Lista objetiva do que a feature deve fazer:

- [ ] RF01: Descrição do requisito funcional 1
- [ ] RF02: Descrição do requisito funcional 2
- [ ] RF03: Descrição do requisito funcional 3

## Regras de negócio

Regras que governam o comportamento da feature:

| Código | Regra                           |
| ------ | ------------------------------- |
| RN01   | Descrição da regra de negócio 1 |
| RN02   | Descrição da regra de negócio 2 |

## Critérios de aceite

Condições que devem ser verdadeiras para a feature ser considerada pronta:

- [ ] CA01: Dado [contexto], quando [ação], então [resultado esperado]
- [ ] CA02: Dado [contexto], quando [ação], então [resultado esperado]
- [ ] CA03: Testes unitários cobrindo todas as regras de negócio
- [ ] CA04: Teste E2E cobrindo o fluxo principal
- [ ] CA05: Lint e build passando sem erros

## Layout / Wireframe

Descrição textual do layout esperado ou link para o design (Figma, imagem, etc.):

```text
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ [Breadcrumb / título da página]         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Componente principal                │ │
│ │ (descreva o comportamento visual)   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Ações: botões, filtros, paginação]     │
└─────────────────────────────────────────┘
```

> Se houver link do Figma ou imagem, adicione aqui.

## Endpoints envolvidos

| Método | Endpoint           | Descrição                  | Body/Params        |
| ------ | ------------------ | -------------------------- | ------------------ |
| GET    | `/api/recurso`     | Lista os recursos          | `?page=1&limit=10` |
| POST   | `/api/recurso`     | Cria um novo recurso       | `{ name, email }`  |
| PUT    | `/api/recurso/:id` | Atualiza recurso existente | `{ name, email }`  |
| DELETE | `/api/recurso/:id` | Remove o recurso           | —                  |

## Dependências

- [ ] Backend: endpoint `/api/recurso` disponível e documentado
- [ ] Design: layout aprovado no Figma
- [ ] Outro: descreva dependências externas

## Observações

Informações adicionais, limitações conhecidas ou decisões técnicas pendentes.

> Decisões arquiteturais tomadas durante a implementação (nova lib, novo padrão,
> escolha entre abordagens válidas) devem ser registradas como ADR em
> `docs/decisions/` (ver `docs/decisions/README.md`).

---

## Checklist do agente (preenchido pela IA)

> Esta seção é preenchida automaticamente pelo agente durante a implementação.

- [ ] Spec lida e compreendida (sem dúvidas pendentes)
- [ ] Branch criada: `feat/FEAT-XXX-slug`
- [ ] Módulo criado em `src/modules/<nome>/`
- [ ] Tipos criados em `src/modules/<nome>/types.ts`
- [ ] Service criado em `src/modules/<nome>/api/`
- [ ] Query num composable do módulo (`useQuery`)
- [ ] View container implementada
- [ ] Componentes apresentacionais implementados
- [ ] Testes unitários criados e passando
- [ ] Teste E2E criado e passando
- [ ] `pnpm lint` sem erros
- [ ] `pnpm build` sem erros
- [ ] `pnpm test` passando
- [ ] Commits seguindo COMMIT-CONVENTIONS.md
- [ ] PR aberto com descrição completa
