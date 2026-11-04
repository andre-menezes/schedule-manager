# Checklist de Code Review

Critérios objetivos para revisão e aprovação de Pull Requests. Utilize esta
lista como guia durante o review para manter a qualidade consistente.

Voltar para o guia geral: [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)

---

## Como usar

- Percorra cada categoria e verifique os itens aplicáveis.
- Nem todos os itens se aplicam a toda PR (ex: segurança só vale se houver auth).
- Itens marcados com ⚠️ são bloqueantes (PR não deve ser aprovado sem resolver).
- Itens marcados com 💡 são sugestões de melhoria (não bloqueiam).

---

## Arquitetura

- [ ] ⚠️ Código está na camada correta (app/modules/shared/types)
- [ ] ⚠️ Módulo não importa de outro módulo (módulos são independentes)
- [ ] ⚠️ Shared não importa de modules nem de app
- [ ] ⚠️ Nenhum acesso direto a `import.meta.env` fora de `core/config`
- [ ] Componentes compartilhados são agnósticos de domínio
- [ ] Views são containers (orquestram dados), componentes são apresentacionais
- [ ] Lógica reutilizável está em shared (não duplicada entre módulos)
- [ ] 💡 Funções puras em `utils/`, com efeito lateral em `helpers/`, reativas em `composables/`

---

## Tipagem

- [ ] ⚠️ Sem uso de `any` em contratos de domínio (preferir `unknown` se necessário)
- [ ] ⚠️ Props e emits tipados com `defineProps<T>()` e `defineEmits<T>()`
- [ ] ⚠️ Tipos no módulo (`types.ts`) ou em `src/types/` quando compartilhados, nunca inline repetido (ADR-0025)
- [ ] Interfaces sem prefixo `I`, PascalCase
- [ ] Retorno de service tipado com generic (`httpClient.get<T>()`), sem `as unknown as`
- [ ] Busca ou carga que pode ficar obsoleta repassa `signal` (`AbortController`) ao service
- [ ] Contrato de API separado do contrato de UI quando diferem
- [ ] 💡 Enums com valores explícitos (string) ao invés de numéricos implícitos

---

## Testes

- [ ] ⚠️ Toda regra de negócio nova tem teste unitário
- [ ] ⚠️ Testes possuem assertions (sem `it` vazio)
- [ ] ⚠️ Testes passam (`pnpm test`)
- [ ] Mocks isolados — preferir Pinia real a mock do módulo inteiro
- [ ] Fluxos críticos (auth, pagamento) têm teste E2E correspondente
- [ ] ⚠️ Página nova tem E2E com `expectNoA11yViolations` (WCAG A/AA)
- [ ] 💡 Nomes de `it` descrevem o comportamento em português

---

## Performance

- [ ] Componentes de rota usam lazy loading (`() => import(...)`)
- [ ] Sem chamadas HTTP desnecessárias (re-fetch sem motivo, loops)
- [ ] Computed usados para derivar estado (ao invés de watchers recalculando)
- [ ] 💡 Listas grandes usam `v-virtual-scroll` ou paginação
- [ ] 💡 Imports desnecessários removidos (tree-shaking)

---

## Segurança

- [ ] ⚠️ Tokens nunca expostos em logs, templates ou URLs
- [ ] ⚠️ Dados sensíveis não persistidos em localStorage sem necessidade
- [ ] ⚠️ Validação de input antes de enviar ao backend
- [ ] 💡 Sanitização de dados exibidos em `v-html` (se usado)

---

## Acessibilidade

- [ ] Botões e links têm `aria-label` quando sem texto visível
- [ ] Imagens/ícones decorativos com `aria-hidden="true"`
- [ ] Formulários com labels associados aos inputs
- [ ] 💡 Contraste de cores adequado (verificar no tema light e dark)
- [ ] 💡 Navegação por teclado funciona nos elementos interativos

---

## Estilo e formatação

- [ ] ⚠️ Lint passa sem erros (`pnpm lint`)
- [ ] ⚠️ Build passa sem erros (`pnpm build`)
- [ ] Ordem dos blocos: `<template>` → `<script>` → `<style>`
- [ ] Imports usam alias mais curto (`@shared/`, `@app/`, `@typings/`)
- [ ] Eventos customizados em camelCase
- [ ] 💡 Código sem comentários óbvios (o código deve ser auto-explicativo)

---

## Commits e PR

- [ ] ⚠️ Commits seguem [COMMIT-CONVENTIONS.md](COMMIT-CONVENTIONS.md)
- [ ] ⚠️ PR não mistura responsabilidades distintas (feature + refactor + docs)
- [ ] Título do PR conciso (< 70 caracteres)
- [ ] Descrição com resumo das mudanças e o que foi testado
- [ ] 💡 Commits atômicos (cada um representa uma unidade lógica)

---

## Quando bloquear vs solicitar ajuste

| Situação                                       | Ação              |
| ---------------------------------------------- | ----------------- |
| Bug introduzido ou teste falhando              | ⚠️ Bloquear       |
| Violação de arquitetura (import entre módulos) | ⚠️ Bloquear       |
| `any` em contrato de domínio                   | ⚠️ Bloquear       |
| Token/segredo exposto                          | ⚠️ Bloquear       |
| Lint ou build falhando                         | ⚠️ Bloquear       |
| Falta de teste para regra nova                 | ⚠️ Bloquear       |
| Nome de variável pouco descritivo              | 💡 Sugerir ajuste |
| Oportunidade de extrair composable             | 💡 Sugerir ajuste |
| Comentário explicativo que poderia ser código  | 💡 Sugerir ajuste |

---

## Princípios de referência

- **SRP** (Single Responsibility): cada unidade faz uma coisa só.
- **DRY** (Don't Repeat Yourself): extrair duplicação para shared.
- **KISS** (Keep It Simple): preferir a solução mais simples que funciona.
- **Separation of Concerns**: view não busca dados, componente não acessa store.
- **Fail Fast**: validar cedo, lançar erro cedo (config, types, guards).
