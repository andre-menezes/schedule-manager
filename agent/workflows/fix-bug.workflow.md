# Workflow: Corrigir Bug

## Referências obrigatórias

Ler antes de executar:

- `agent/core/CONTRACT.md`
- `agent/core/PROCEDURE.md`
- `agent/skills/vue-vuetify-dev/SKILL.md`
- `agent/skills/testing/SKILL.md`

## Entrada

- Descrição do bug (spec em `docs/specs/BUG-XXX.md`, issue ou mensagem direta).
- Se a descrição for vaga ou insuficiente para reproduzir, **perguntar** antes.

## Passos

1. Ler a descrição do bug completamente. Identificar: comportamento esperado vs atual, passos para reproduzir.
2. Se algo não estiver claro, **parar e perguntar**.
3. Criar branch a partir de develop: `git checkout develop && git pull && git checkout -b fix/BUG-XXX-<slug>`.
4. Localizar a causa raiz. Traçar o fluxo do sintoma até a origem (template → componente → view → service → store). Ler antes de alterar.
5. Verificar se existe teste cobrindo o cenário. Se não houver, criar no step 7.
6. Aplicar a correção mínima e focada. Não refatorar código adjacente (isso é um commit separado).
7. Criar teste de regressão que **falha** sem a correção e **passa** com ela.
8. Verificar vulnerabilidades: a correção expõe tokens? Bypassa validação? Altera auth?
9. Validar: `pnpm lint && pnpm build && pnpm test`.
10. Corrigir regressões se necessário. Revalidar.
11. Se a correção exigiu uma decisão arquitetural (mudança estrutural, novo padrão), registrar como ADR em `docs/decisions/` (ver `docs/decisions/README.md`). Correções pontuais de bug normalmente não geram ADR.
12. Commitar: `fix(escopo): descrição do que foi corrigido`. Usar corpo para explicar causa raiz quando relevante.
13. Push: `git push -u origin fix/BUG-XXX-<slug>`.
14. Abrir PR com: título, descrição do bug, causa raiz, como foi corrigido, teste de regressão.

## Saída esperada

- Bug corrigido na causa raiz (não apenas sintoma).
- Teste de regressão garantindo que não volta.
- Nenhuma vulnerabilidade ou regressão introduzida.
- Lint, build e testes passando.
- PR aberto com descrição clara.

## Falha controlada

Se não for possível reproduzir ou corrigir:

- Documentar o que foi investigado e onde parou.
- Registrar hipóteses de causa com evidências.
- Informar o desenvolvedor com o contexto coletado.
