# Workflow: Validar Código

## Referências obrigatórias

- `agent/core/CONTRACT.md`
- `docs/CODE-REVIEW-CHECKLIST.md`

## Objetivo

Executar uma validação completa do código do projeto, identificando problemas
de qualidade, arquitetura, tipagem, testes e segurança. Equivalente a um
code review automatizado.

## Entrada

- Escopo da validação: branch inteira, arquivos específicos, ou projeto completo.
- Se nenhum escopo for informado, validar apenas os arquivos alterados na branch atual.

## Passos

1. Identificar escopo (diff da branch ou projeto inteiro).
2. Executar lint: `pnpm lint`. Listar erros.
3. Executar type-check: `pnpm typecheck` (`vue-tsc -b`). Listar erros.
4. Executar testes: `pnpm test`. Listar falhas.
5. Verificar arquitetura:
   - Módulos não importam entre si.
   - `shared/` não importa de `modules/` ou `app/`; `core/` importa só de `types/`
     (o `pnpm lint` já reprova essas violações — ADR-0018).
   - Nenhum `import.meta.env` fora de `@core/config`.
   - Aliases corretos (mais curtos).
6. Verificar tipagem:
   - Sem `any` em contratos de domínio.
   - Props e emits tipados com generics.
   - Tipos em `src/types/` (não inline repetido).
7. Verificar testes:
   - Regras de negócio novas têm teste.
   - Testes possuem assertions.
   - Sem mocks excessivos.
8. Verificar segurança:
   - Tokens não expostos em logs, templates ou URLs.
   - Validação de input antes de enviar ao backend.
9. Verificar decisões arquiteturais (ADR):
   - Decisões arquiteturais relevantes introduzidas têm ADR em `docs/decisions/`.
   - ADRs afetadas continuam coerentes com o código (status atualizado se substituídas).
10. Gerar relatório com:

- Total de problemas encontrados por categoria.
- Itens bloqueantes (⚠️) vs sugestões (💡).
- Ações recomendadas para cada problema.

## Saída esperada

Relatório estruturado com:

```text
## Resultado da validação

### Resumo
- Lint: ✅ | ❌ (X erros)
- Type-check: ✅ | ❌ (X erros)
- Testes: ✅ | ❌ (X falhas)
- Arquitetura: ✅ | ❌ (X violações)
- Segurança: ✅ | ❌ (X problemas)
- Decisões (ADR): ✅ | ❌ (X pendências)

### Problemas encontrados
1. ⚠️ [categoria] descrição — arquivo:linha — ação recomendada
2. 💡 [categoria] descrição — arquivo:linha — sugestão

### Conclusão
[Aprovado para merge | Precisa de correções antes de merge]
```

## Quando usar

- Antes de abrir PR (auto-review).
- Após implementação de feature ou bug fix.
- Periodicamente para auditoria do projeto.
- Quando solicitado pelo desenvolvedor.
