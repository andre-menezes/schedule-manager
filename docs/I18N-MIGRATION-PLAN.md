# Plano de migração para i18n (pt-BR)

Planejamento da migração dos textos fixos ("hardcoded") para o `vue-i18n`,
usando **apenas** o locale `pt-BR`.

> **Status: concluído.** A migração foi executada por completo (Fase 1 do
> `ROADMAP.md`), fatiada por tela, cada fatia em sua branch a partir da
> `develop` e com merge de volta. Todo texto de UI das telas de documentação e
> dos componentes globais passou a ser consumido via `$t`/`t`, consolidado em
> `src/app/locales/pt-BR.json`. Este documento permanece como registro do plano
> e das decisões tomadas na execução.

> **Nota (ADR-0038):** depois da migração, o template passou a suportar
> múltiplos locales. Hoje há `pt-BR` (base e fallback) e `en-US`, e as
> mensagens ficam em `locales/<locale>.json` no app e em cada módulo. As
> menções a "locale único" e a "só `pt-BR`" abaixo descrevem o escopo da
> migração, não o estado atual.

Voltar para o índice: [README.md](README.md)

---

## Resultado da execução

Fatias migradas e mergeadas na `develop`:

| Fatia                          | Namespace(s) em `pt-BR.json`                                                   | Branch                          |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------- |
| Fundação + globais             | `common`, `nav`, `header`, `account`, `notFound`, `authError`, `tokenCallback` | `feat/i18n-fundacao`            |
| Home                           | `home`                                                                         | `feat/i18n-home`                |
| Arquitetura                    | `architecture`                                                                 | `feat/i18n-architecture`        |
| Onboarding                     | `onboarding`                                                                   | `feat/i18n-onboarding`          |
| Componentes                    | `components`                                                                   | `feat/i18n-components`          |
| Convenções                     | `conventions`                                                                  | `feat/i18n-conventions`         |
| Decisões + Exemplo autenticado | `decisions`, `protectedExample`                                                | `feat/i18n-decisions-protected` |

Decisões consolidadas na execução:

- **Arrays tipados**: adotou-se a abordagem **(B)** — a view container monta os
  arrays com `computed<T[]>(() => [...])` chamando `t()`, e os componentes
  apresentacionais permanecem "burros" (recebem props já traduzidas). Para dados
  em arquivo `.ts` separado (ex.: `onboarding/steps.ts`), as constantes viraram
  **funções que recebem `t: ComposerTranslation`**, chamadas via `computed` na view.
- **Não traduzidos** (dado técnico/factual): snippets de código, nomes de
  camada, tipos/escopos de commit, prefixos de branch, nomes de store/alias,
  nomes de princípios (SRP/DRY), ícones, e títulos/ids/arquivos de ADR.
- **Interpolação com marcação inline**: trechos com `<code>` embutido na frase
  usam o componente nativo `<i18n-t>` com slots nomeados.
- **Testes**: `mountWithPlugins` registra o i18n real (`createI18n` com
  `legacy: false` + `pt-BR.json`), de modo que os testes asserem o valor
  traduzido. Suíte verde (50/50) ao fim de cada fatia.

---

## Situação inicial (histórico)

> Esta seção descreve o ponto de partida antes da migração (hoje concluída).

- A infraestrutura de i18n já existia e estava ativa:
  - `src/app/providers/i18n.ts` — `createI18n` com `legacy: false` e
    `globalInjection: true` (o `$t` está disponível nos templates sem `useI18n`).
  - `src/app/locales/pt-BR.json` — arquivo de mensagens, então **vazio** (`{}`);
    hoje populado com os namespaces listados acima.
  - `src/types/i18n` — `MessageSchema` (tipagem do dicionário).
  - `SUPPORTED_LOCALES = ['pt-BR']` e `setLocale()` já implementados.
- Os textos visíveis estavam **fixos no código**, em dois lugares:
  1. **Templates** (`.vue`): títulos, descrições, rótulos.
  2. **Arrays tipados** nos `<script setup>`: `navCards`, `activity`,
     `onboardingSteps`, `onboardingFaqs`, `layers`, `dependencyRules`,
     `commitTypes`, `checklist`, `principles`, `adrs`, etc.

## Objetivo

Centralizar todo texto visível ao usuário no `pt-BR.json`, consumido via
`$t('chave')` (template) ou `t('chave')` (script), sem alterar o comportamento
das telas. Locale único `pt-BR` (sem tradução para outros idiomas nesta etapa).

## Convenção de chaves

Namespacing por contexto, em `camelCase`, hierárquico:

```
<contexto>.<secao>.<chave>
```

Exemplos:

```jsonc
{
  "common": { "backToHome": "Voltar para o início" },
  "home": {
    "eyebrow": "Documentação viva",
    "title": "Vue 3 Template",
    "navCards": {
      "architecture": { "title": "Arquitetura", "description": "Camadas, regras..." },
    },
  },
  "onboarding": { "title": "Primeiros passos e como criar uma feature" },
}
```

Regras:

- Chaves em inglês (padrão técnico); valores em português.
- Reaproveitar `common.*` para textos repetidos (ex.: "Voltar para o início").
- Listas (steps, faqs, cards) viram objetos com chave estável por item —
  **não** usar índice numérico como chave (frágil a reordenação).

## Escopo por arquivo (inventário)

| Área         | Arquivos                                                                                      | Tipo de texto                                                                      |
| ------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Home         | `modules/home/views/HomeView.vue` + componentes                                               | template + `navCards`, `activity`, `metrics`                                       |
| Arquitetura  | `modules/architecture/**`                                                                     | template + `layers`, `dependencyRules`, flows, `stores`, `aliases`                 |
| Onboarding   | `modules/onboarding/views` + `steps.ts`                                                       | template + `onboardingSteps`, `checklist`, `faqs`                                  |
| Componentes  | `modules/components/views/ComponentsView.vue`                                                 | template + descrições das seções                                                   |
| Convenções   | `modules/conventions/views/ConventionsView.vue`                                               | template + `commitTypes`, `commitScopes`, `branchTypes`, `checklist`, `principles` |
| Decisões     | `modules/decisions/views/DecisionsView.vue`                                                   | template + `madrParts`, `statusLegend` (os títulos das ADRs vêm de dado)           |
| Exemplo aut. | `modules/protected-example/views`                                                             | template + `guardFlow`, rótulos de `userFields`                                    |
| App/globais  | `app/views/{NotFoundView,AuthErrorView,TokenCallbackView}.vue`, `shared/ui/**` (menu, header) | template                                                                           |

> Blocos de **código de exemplo** (conteúdo de `CodeBlock`) **não** são
> traduzidos — são snippets técnicos, não texto de UI.

## Estratégia de execução (incremental) — concluída

Fatiada por tela, uma branch por fatia (a partir da `develop`), para manter os
diffs revisáveis e o app sempre funcional. A ordem executada foi:

1. **Fundação**: popular `common.*` e migrar componentes globais
   (`TheNavigationMenu`, header, 404, erro de autenticação).
2. **Home** (hub): template + `navCards`/`activity`/`metrics`.
3. **Arquitetura**.
4. **Onboarding** (inclui `steps.ts`).
5. **Componentes**.
6. **Convenções**.
7. **Decisões** + **Exemplo autenticado**.

Para os **arrays tipados**, duas abordagens foram consideradas:

- **(A)** Manter os arrays com uma **chave i18n** por campo textual (ex.:
  `{ titleKey: 'home.navCards.architecture.title' }`) e resolver com `t()` no
  template/computed. Mais explícito, menos mágico.
- **(B)** Substituir o valor textual direto por `t('...')` já no `<script>`
  (exige `useI18n` e reatividade via `computed`). Mais direto, porém os arrays
  passam a depender do contexto de componente.

Decisão adotada: **(B)** para dados de lista das views (montados via
`computed<T[]>` chamando `t()`), e `$t` direto nos textos de template. A exceção
`MenuItem.titleKey` (abordagem A) permaneceu nos componentes globais, onde o
item de menu é estrutura compartilhada sem contexto de i18n próprio.

## Padrão de uso

Template:

```vue
<h1>{{ $t('home.title') }}</h1>
<p>{{ $t('home.description') }}</p>
```

Script (quando o texto é derivado/condicional):

```ts
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const message = computed(() => t('auth.error.default'));
```

## Impacto em testes

- **Unit (Vitest)**: `mountWithPlugins` precisa registrar o plugin i18n (ou um
  stub que devolva a própria chave). Testes que asseguram texto visível passam a
  asserir a **chave** ou o **valor** traduzido — padronizar antes de migrar.
- **E2E (Playwright)**: preferir seletores `data-cy` (já é a regra) — assim os
  testes não quebram com a troca de texto fixo por `$t`.

## Critérios de conclusão (por fatia)

- Nenhum texto de UI fixo no arquivo migrado (exceto snippets de código).
- Chaves adicionadas ao `pt-BR.json` seguindo a convenção.
- `pnpm lint`, `pnpm build` e `pnpm test` verdes.
- Sem regressão visual (conferir a tela no navegador).

## Fora de escopo (por ora)

- Tradução para outros idiomas (só `pt-BR`).
- Pluralização/interpolação avançada — introduzir apenas onde necessário.
- Internacionalização de datas/números (já há `Intl` em `utils/format.ts`).
