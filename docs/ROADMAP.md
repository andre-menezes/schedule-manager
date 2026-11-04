# Roadmap — Próximos passos

Planejamento técnico dos próximos incrementos do template, na perspectiva de
arquitetura. Cada item segue o fluxo de branches a partir da `develop` e as
camadas do projeto (no módulo: `types → api → query (useQuery) → view → components`,
promovendo para `shared/`/`types/` só o que dois módulos usam; `utils` puro,
`helpers` com efeito, `composables` reativo).

Voltar para o índice: [README.md](README.md)

---

## Onde estamos

Consolidado na `develop` (ver `CHANGELOG.md`):

- Telas de documentação: Home (hub), Arquitetura, Onboarding, Componentes & UI,
  Convenções e Decisões (ADRs), reunidas no módulo removível `showcase`
  (ADR-0026). Todas as páginas são públicas: a autenticação corporativa foi
  removida (ADR-0021).
- Hospedagem e CI no GitHub (GitHub Actions — ADR-0022).
- Camada HTTP (factory `createApiInstance` + ofetch), erros no padrão RFC 9457,
  download de arquivos binários (service + helper + utils).
- Dados assíncronos com TanStack Query (ADR-0027) e código de cada feature
  colocalizado no módulo (ADR-0025).
- Tratamento global de erros (`errorHandler` + `unhandledrejection`, ADR-0028).
- Qualidade: ESLint/Prettier, Husky, Vitest, Playwright com checagem de
  acessibilidade (axe, ADR-0029), CI (GitHub Actions), pnpm (ADR-0024),
  ADRs 0001–0029.
- i18n **configurado e migrado** (`vue-i18n`): todo texto de UI vem dos
  `locales/<locale>.json` do app e dos módulos (ver `I18N-MIGRATION-PLAN.md`),
  em `pt-BR` (base e fallback) e `en-US`, com seletor de idioma no cabeçalho e
  o Vuetify acompanhando o locale (ADR-0038).

## Princípios de priorização

1. **Reduzir dívida antes de ampliar escopo** — fechar o que ficou pela metade
   (i18n, cobertura de testes dos utils novos) antes de novas features.
2. **Cada incremento é exemplar** — como é um template, cada adição vira
   referência de "o jeito certo"; prioriza clareza sobre completude.
3. **Sem novas dependências/padrões sem ADR** — decisões relevantes viram ADR.

---

## Fase 1 — Fechar dívidas (fundação) ✅ concluída

Objetivo: deixar o que já existe consistente e testado. **Todos os itens foram
entregues e mergeados na `develop`.**

| #   | Item                                    | Entregável                                                    | Camadas                            | Risco                       | Status       |
| --- | --------------------------------------- | ------------------------------------------------------------- | ---------------------------------- | --------------------------- | ------------ |
| 1.1 | **Migração i18n (pt-BR)**               | Executar o `I18N-MIGRATION-PLAN.md`, fatiado por tela         | `app/locales`, views, `types/i18n` | Médio (toca todas as telas) | ✅ Concluído |
| 1.2 | **Cobertura de testes dos utils novos** | Specs para `file-download`, `http-error` e helpers            | `test/`                            | Baixo                       | ✅ Concluído |
| 1.3 | **Teste do fluxo de download**          | Unit do service/helper (E2E fica para quando houver uma tela) | `test/`                            | Baixo                       | ✅ Concluído |

> A regra de steering exige "sem código sem teste" — a Fase 1 quitou isso para o
> que foi adicionado recentemente (download, RFC 9457) e consolidou o i18n.
> A migração i18n foi fatiada em sete branches (fundação/globais, Home,
> Arquitetura, Onboarding, Componentes, Convenções e Decisões + Exemplo
> autenticado), cada uma validada por `lint + build + test` e com merge `--no-ff`
> na `develop`.

## Fase 2 — Completar a camada de dados (CRUD de referência) ✅ concluída

Objetivo: o template demonstra camadas, mas não um fluxo de dados real de ponta
a ponta. Um módulo de exemplo `customers` (ou similar) fecha essa lacuna e vira
o "exemplo canônico" citado no Onboarding.

| #   | Item                            | Entregável                                                              | Camadas                                                    | Risco | Status       |
| --- | ------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- | ----- | ------------ |
| 2.1 | **Módulo CRUD de exemplo**      | Listagem com paginação + detalhe + criar/editar/excluir                 | módulo: `types → api → query/mutation → view → components` | Médio | ✅ Concluído |
| 2.2 | **Padrão de paginação/filtros** | Tipos e util de paginação reutilizáveis (`DEFAULT_PAGE_SIZE` já existe) | `types/services`, `utils`                                  | Baixo | ✅ Concluído |
| 2.3 | **Upload de arquivo**           | Service + helper + util simétricos ao download (multipart)              | `shared/api`, `helpers`, `utils`                           | Médio | ✅ Concluído |
| 2.4 | **Estados de UI padronizados**  | Loading/empty/error como componentes compartilhados reutilizáveis       | `shared/ui`                                                | Baixo | ✅ Concluído |

## Fase 3 — Experiência e robustez

Objetivo: padronizar feedback ao usuário e endurecer o tratamento de erros.

| #   | Item                               | Entregável                                                                                            | Camadas                               | Risco | Status       |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------- | ----- | ------------ |
| 3.1 | **Notificações (snackbar/toast)**  | Store + composable `useNotify` + render global                                                        | `shared/stores`, `composables`, `app` | Baixo | ✅ Concluído |
| 3.2 | **Tratamento global de erro HTTP** | Interceptor/handler central mapeando RFC 9457 → notificação                                           | `shared/api`, `helpers`               | Médio | ✅ Concluído |
| 3.3 | **Formulários + validação**        | Padrão de form com validação (avaliar lib em ADR) e exemplo no CRUD                                   | `shared/ui`, `composables`            | Médio | ✅ Concluído |
| 3.4 | **Acessibilidade (a11y)**          | Auditoria das telas (foco, labels, contraste) + ajustes                                               | transversal                           | Baixo | ✅ Concluído |
| 3.5 | **Login próprio**                  | Tela de login, guard de rotas e sessão integrados ao backend de autenticação próprio (quando existir) | `app`, `shared`, `core`               | Alto  | Pendente     |

- **3.1 e 3.2 (concluídos, ADR-0040):** store de notificações, `useNotify` e
  o snackbar global `TheNotifications`. O erro de uma gravação (mutation) vira
  notificação com a mensagem RFC 9457, pelo `MutationCache`; a tela que já
  mostra o erro declara `meta: { notifyError: false }`. Erros de leitura
  ficam na tela (`BaseErrorState`), e os não tratados seguem no
  `ErrorReporter` (ADR-0028).
- **3.3 (concluído, ADR-0042):** VeeValidate + Zod 4, com o adapter
  `toTypedSchema` em `@shared/utils/form-schema`, schemas no módulo e
  mensagens como chaves de i18n (`validation.*`). O formulário de clientes é
  o exemplo.
- **3.4 (concluído, PR #8):** o E2E roda o axe (WCAG 2.1 A/AA) em todas as
  páginas, e o tema ganhou tons de texto com contraste AA (ADR-0029).

## Fase 4 — Visão de longo prazo (multi-framework)

Objetivo: a visão declarada é aproveitar a arquitetura para React e Angular.
Isto é estratégico e precisa de decisão explícita (ADR) antes de execução.

| #   | Item                                | Entregável                                                               | Risco |
| --- | ----------------------------------- | ------------------------------------------------------------------------ | ----- |
| 4.1 | **ADR: estratégia multi-framework** | Decidir entre monorepo com núcleo agnóstico vs. templates irmãos         | Alto  |
| 4.2 | **Extrair núcleo agnóstico**        | Isolar o que é framework-agnóstico (tipos, contratos de API, convenções) | Alto  |
| 4.3 | **Prova de conceito React/Angular** | Reproduzir 1–2 telas na stack alvo validando a arquitetura               | Alto  |

---

## Sequência recomendada

```
Fase 1 (dívidas)  →  Fase 2 (dados/CRUD)  →  Fase 3 (UX/robustez)  →  Fase 4 (multi-framework)
```

As **Fases 1 e 2** estão concluídas: i18n migrado, utils cobertos e a camada
de dados completa, com o CRUD de exemplo como "exemplo canônico" do
Onboarding. O próximo foco é a **Fase 3 (UX/robustez)**.

- **2.1 (concluído):** módulo `src/modules/customers` com listagem paginada
  e busca na URL, detalhe, cadastro, edição e exclusão, servido no `pnpm dev`
  por uma API simulada em `mock/` (ADR-0039).
- **2.2 (concluído):** `PageParams` e `PaginatedResponse<TItem>` em
  `@typings/services`, e `parsePageParams`/`toPageQuery` em
  `@shared/utils/pagination` para ler e montar a página da URL. O módulo
  `customers` estende os dois só com a busca.
- **2.3 (concluído):** `httpClient.upload` (POST multipart), `toFormData`,
  `validateFile` e `formatFileSize` em `@shared/utils/file-upload`,
  `validateAndUpload` em `@shared/helpers/file-upload` e o exemplo
  `uploadReportAttachmentRequest`. Sem lib nova, então sem ADR; progresso de
  envio fica de fora (o `fetch` não o informa).
- **2.4 (concluído):** `BaseLoadingState`, `BaseEmptyState` e `BaseErrorState`
  em `shared/ui/components`, com textos em `states.*`, "Tentar novamente"
  ligado ao `refetch` e uso no módulo `customers`.

## Itens que exigem ADR antes de executar

- 3.5 Fluxo de autenticação do login próprio.
- 4.x Toda a estratégia multi-framework.

## Fora de escopo (por ora)

- SSR/SSG (o template é SPA por decisão).
- Gerência de permissões finas por recurso (depende do login próprio).
