# Procedimento operacional

## Fase 0 — Entrada

Receba a tarefa: feature spec (`agent/templates/feature-spec.md` preenchida)
ou descrição de bug (issue, mensagem direta ou spec em `docs/specs/`).

Antes de implementar, registre o entendimento mínimo:

- Tipo de tarefa (feature, bug fix, refactor).
- Escopo (módulo, camada, componente afetado).
- Requisitos funcionais e regras de negócio.
- Critérios de aceite.
- Dúvidas pendentes.

### Resolução de ambiguidades

Se o requisito for ambíguo ou incompleto:

1. Liste as dúvidas de forma objetiva.
2. Apresente ao desenvolvedor com opções quando possível.
3. Aguarde resposta antes de prosseguir.
4. Registre a decisão tomada como referência futura. Se ela for arquitetural
   (nova lib, novo padrão, mudança de camada, escolha entre abordagens válidas),
   registre-a como ADR em `docs/decisions/` (ver `docs/decisions/README.md`).

Nunca prossiga com dúvida que impacte comportamento funcional.

## Fase 1 — Preparação

1. Ler a documentação relevante (ARCHITECTURE-GUIDE, READMEs da camada afetada).
2. Ler código existente relacionado (se for alteração de módulo existente).
3. Criar branch seguindo convenção:
   - Feature: `git checkout develop && git pull && git checkout -b feat/FEAT-XXX-<slug>`
   - Bug fix: `git checkout develop && git pull && git checkout -b fix/BUG-XXX-<slug>`
   - Refactor: `git checkout develop && git pull && git checkout -b refactor/<descrição-curta>`

   **Toda branch é criada a partir de `develop` atualizada.**

## Fase 2 — Implementação

Seguir a ordem de camadas (de baixo para cima):

1. **Types** — Criar/atualizar contratos em `src/modules/<nome>/types.ts`
   (em `src/types/<contexto>/` só se outro módulo também usar; ADR-0025).
2. **Service** — Criar/atualizar em `src/modules/<nome>/api/` (em
   `src/shared/api/services/` só se compartilhado), aceitando `signal`.
3. **Query** — Ler dados do servidor com `useQuery` num composable do módulo
   (`src/modules/<nome>/composables/`; TanStack Query, ADR-0027).
4. **Store** — Criar só para estado de cliente transversal ou persistente (se necessário).
5. **Composable** — Criar no módulo; em `src/shared/composables/` só se compartilhado.
6. **Módulo/Rotas** — Criar `routes.ts` em `src/modules/<nome>/`.
7. **View** — Criar view container em `src/modules/<nome>/views/`.
8. **Components** — Criar componentes apresentacionais em `src/modules/<nome>/components/`.

### Regras durante implementação

- Sempre usar o alias mais curto (`@shared/`, `@app/`, `@typings/`).
- Props e emits sempre tipados com generics.
- Sem `any` em contratos de domínio.
- Componentes apresentacionais: sem fetch, sem store.
- Views container: orquestram dados e passam via props.
- Eventos customizados em camelCase.
- Adicionar `data-cy` attributes para seletores E2E.

## Fase 3 — Testes

1. **Unitários** — Cobrir toda regra de negócio nova.
   - Arquivo: `src/test/<camada>/<contexto>.spec.ts`
   - Usar Pinia real + mock isolado do service/HTTP.
   - Cada `it` com assertion clara e nome descritivo em português.

2. **E2E** — Cobrir fluxo principal (happy path).
   - Arquivo: `e2e/<contexto>.spec.ts` (Playwright)
   - Seletores via `page.getByTestId(...)` (atributo `data-cy`).

## Fase 4 — Validação

Executar e garantir zero erros:

```bash
pnpm lint
pnpm build
pnpm test
```

Se falhar:

1. Identificar a causa (não aplicar fix cego).
2. Corrigir.
3. Revalidar.

## Fase 5 — Entrega

### Registro de decisão arquitetural (ADR)

Se a tarefa envolveu uma decisão arquitetural (nova biblioteca, novo padrão,
mudança de camada, escolha entre abordagens válidas), crie ou atualize a ADR
correspondente em `docs/decisions/` antes de commitar (ver
`docs/decisions/README.md`; template em `agent/templates/adr.md`).

### Commits

- Atômicos (uma responsabilidade por commit).
- Formato: `tipo(escopo): descrição em português`
- Seguir `docs/COMMIT-CONVENTIONS.md`.

### Push e PR

```bash
git push -u origin <nome-da-branch>
```

Abrir Pull Request com:

- **Título**: `tipo(escopo): descrição curta` (< 70 chars).
- **Descrição**:
  - Resumo do que foi implementado.
  - Link da spec (se existir).
  - O que foi testado.
  - Pendências (se houver).

### Checklist final

- [ ] Spec atendida completamente.
- [ ] Nenhum `[PENDENTE]` bloqueante restante.
- [ ] Decisão arquitetural relevante registrada como ADR (quando aplicável).
- [ ] Lint, build e testes passando.
- [ ] Commits seguem convenção.
- [ ] PR aberto com descrição clara.
- [ ] Branch correta (nunca main/develop).

## Falha controlada

Se algo impedir a conclusão:

- Documentar exatamente o que falhou e por quê.
- Registrar o estado atual (o que foi feito, o que falta).
- Commitar o progresso parcial com prefixo `wip:` se necessário.
- Informar o desenvolvedor com contexto suficiente para continuar.

Nunca abandonar silenciosamente uma tarefa incompleta.
