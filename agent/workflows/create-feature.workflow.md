# Workflow: Criar Feature

## Referências obrigatórias

Ler antes de executar:

- `agent/core/CONTRACT.md`
- `agent/core/PROCEDURE.md`
- `agent/skills/vue-vuetify-dev/SKILL.md`
- `agent/skills/testing/SKILL.md`
- `docs/ARCHITECTURE-GUIDE.md`
- `docs/ONBOARDING.md`
- `docs/decisions/README.md` — registro de decisões arquiteturais (ADR)

## Entrada

- Spec preenchida em `docs/specs/FEAT-XXX-<slug>.md` (ou `agent/templates/feature-spec.md` como base).
- Se a spec não existir, solicite ao desenvolvedor antes de prosseguir.

## Passos

1. Ler a spec completamente. Identificar requisitos, regras, critérios de aceite, endpoints e layout.
2. Listar dúvidas. Se houver ambiguidade, **parar e perguntar**.
3. Criar branch a partir de develop: `git checkout develop && git pull && git checkout -b feat/FEAT-XXX-<slug>`.
4. Criar tipos em `src/modules/<x>/types.ts` (ou `src/types/<contexto>/` se já forem compartilhados por outro módulo; ADR-0025). Separar contrato API do contrato UI quando diferirem.
5. Criar service em `src/modules/<x>/api/<contexto>.service.ts` (ou `src/shared/api/services/` se já for compartilhado por outro módulo). Tipar retorno com generics e aceitar `signal` opcional.
6. Criar a query em `src/modules/<x>/composables/use<Contexto>Query.ts` com `useQuery` (TanStack Query, ADR-0027). Escritas usam `useMutation` e invalidam a query afetada.
7. Criar store Pinia **somente** para estado de cliente transversal ou persistente (dados do servidor ficam na query); em `src/shared/` só se compartilhada.
8. Criar módulo: `src/modules/<nome>/routes.ts` com `RouteRecordRaw[]` e lazy loading.
9. Criar view container em `src/modules/<nome>/views/`. Orquestra dados e controla estados.
10. Criar componentes apresentacionais em `src/modules/<nome>/components/`. Props tipadas, sem fetch/store. Adicionar `data-cy`.
11. Criar testes unitários em `src/test/`. Cobrir service e regras de negócio.
12. Criar teste E2E (Playwright) em `e2e/`. Cobrir fluxo principal com seletores `data-cy` (`getByTestId`).
13. Validar: `pnpm lint && pnpm build && pnpm test`.
14. Corrigir se necessário. Revalidar até zero erros.
15. Se a feature envolveu uma decisão arquitetural (nova lib, novo padrão, mudança de camada, escolha entre abordagens válidas), criar/atualizar a ADR em `docs/decisions/` (template em `agent/templates/adr.md`).
16. Commitar: commits atômicos seguindo `docs/COMMIT-CONVENTIONS.md`.
17. Push: `git push -u origin feat/FEAT-XXX-<slug>`.
18. Abrir PR com título conciso e descrição (resumo, link da spec, o que foi testado).
19. Marcar checklist na spec (`docs/specs/FEAT-XXX-<slug>.md`).

## Saída esperada

- Módulo funcional com route auto-descoberta.
- Tipos e service no módulo, query com `useQuery`, view + componentes puros.
- Testes unitários e E2E passando.
- Lint e build sem erros.
- PR aberto pronto para code review.

## Falha controlada

Se não for possível concluir (endpoint não disponível, design indefinido, etc.):

- Documentar o que foi feito e o que está bloqueado.
- Commitar progresso com mensagem `wip(escopo): descrição do bloqueio`.
- Informar o desenvolvedor com a ação necessária para desbloquear.
