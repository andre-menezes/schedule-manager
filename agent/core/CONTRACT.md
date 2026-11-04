# Contrato central de comportamento

## Princípios obrigatórios

1. **Ler antes de agir.** Consulte a documentação do projeto antes de criar ou modificar qualquer arquivo.
2. **Nunca inventar.** Não crie soluções por achismo. Se falta informação, pergunte ao desenvolvedor.
3. **Classificar confiança.** Toda decisão deve ser `CONFIRMADO` (na spec/docs), `INFERIDO` (derivado de evidência) ou `PENDENTE` (precisa de validação).
4. **Não alterar configuração.** Não modifique build, lint, tsconfig ou dependências sem aprovação explícita.
5. **Não instalar dependências.** Nenhum `pnpm install` sem aprovação do desenvolvedor.
6. **Não push para main/develop.** Sempre criar branch própria.
7. **Não incluir segredos.** Tokens, senhas, chaves e dados pessoais nunca entram no código.
8. **Código em inglês, docs em português.** Variáveis, funções e arquivos em inglês; documentação e commits em português.
9. **Seguir a arquitetura.** Respeitar camadas, regras de dependência e convenções documentadas.
10. **Testar tudo.** Código novo sem teste não é considerado pronto.

## Política anti-achismo

Quando falta informação para tomar uma decisão:

```text
[PENDENTE] Comportamento não especificado na spec
Dúvida: <descrição objetiva do que falta>
Impacto: baixo | médio | alto
Ação: perguntar ao desenvolvedor antes de implementar
```

O agente **deve parar e perguntar** quando:

- A spec não detalha um fluxo alternativo (erro, vazio, loading).
- A regra de negócio tem ambiguidade ou casos de borda não cobertos.
- O layout/design não está definido e a implementação visual é opinativa.
- Não está claro qual camada deve conter determinada lógica.
- Existe mais de uma abordagem válida e a spec não indica preferência.

O agente **pode inferir** (registrando como `[INFERIDO]`) quando:

- A convenção do projeto já cobre o caso (documentada nos READMEs).
- Existe um padrão estabelecido em código existente similar.
- A decisão é puramente técnica e não altera comportamento funcional.

## Registro de decisões arquiteturais (ADR)

Uma decisão arquitetural que sai do estado `PENDENTE` e passa a `CONFIRMADO`
deve ser registrada como **ADR** (Architecture Decision Record) em
`docs/decisions/`, seguindo o formato e as instruções de
`docs/decisions/README.md` (template em `agent/templates/adr.md`).

Registre uma ADR quando a decisão:

- introduz ou remove uma biblioteca/ferramenta relevante;
- define ou altera um padrão arquitetural (camadas, fluxo de dados, auth);
- escolhe entre mais de uma abordagem válida;
- estabelece uma convenção transversal que o time deve seguir.

A ADR fecha o ciclo da política anti-achismo: a decisão deixa de ser achismo
porque passa a ter um documento datado, com contexto, opções e consequências —
que futuras tarefas poderão citar como fonte `CONFIRMADO`. Decisões triviais ou
puramente locais não exigem ADR.

## Escopo mínimo por tarefa

Cada execução do agente cobre **uma unidade lógica**:

- Uma feature spec completa (um módulo, uma funcionalidade).
- Um bug report (um problema, uma correção).
- Uma validação de código (lint, tipos, testes).

Não misturar responsabilidades numa mesma execução (ex: feature + refactor + docs).

## Critério de pronto

A tarefa só está pronta quando:

- [ ] Spec lida e compreendida (sem `[PENDENTE]` bloqueante).
- [ ] Branch criada com nome correto.
- [ ] Código implementado seguindo a arquitetura.
- [ ] Tipos de um módulo só em `modules/<x>/types.ts`; compartilhados em `src/types/` (ADR-0025).
- [ ] Testes unitários cobrindo regras de negócio.
- [ ] Teste E2E cobrindo fluxo principal (quando aplicável).
- [ ] `pnpm lint` sem erros.
- [ ] `pnpm build` sem erros.
- [ ] `pnpm test` passando.
- [ ] Commits atômicos seguindo COMMIT-CONVENTIONS.md.
- [ ] Decisão arquitetural relevante registrada como ADR (quando aplicável).
- [ ] PR aberto com título e descrição claros.

## Documentação de referência obrigatória

Antes de qualquer implementação, ler:

- `docs/ARCHITECTURE-GUIDE.md` — arquitetura e regras de dependência
- `docs/ONBOARDING.md` — fluxo de criação de feature
- `docs/COMMIT-CONVENTIONS.md` — formato de commits
- `docs/CODE-REVIEW-CHECKLIST.md` — critérios de qualidade
- `docs/decisions/README.md` — decisões arquiteturais registradas (ADR)
- READMEs locais da camada afetada (`src/shared/`, `src/modules/`, etc.)
