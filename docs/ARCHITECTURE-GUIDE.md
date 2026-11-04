# Guia de Arquitetura Frontend

Documento central da arquitetura do projeto. Serve como ponto de entrada para
desenvolvedores e agentes de IA entenderem a estrutura, os padrões adotados e
onde implementar cada tipo de funcionalidade.

## Índice

- [Visão em camadas](#visão-em-camadas)
- [Diagrama de dependência](#diagrama-de-dependência)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Mapa de documentação](#mapa-de-documentação)
- [Fluxo de inicialização](#fluxo-de-inicialização)
- [Autenticação](#autenticação)
- [Composição de rotas](#composição-de-rotas)
- [Camada HTTP](#camada-http)
- [Estado global](#estado-global)
- [Utils, Helpers e Composables](#utils-helpers-e-composables)
- [UI e Layouts](#ui-e-layouts)
- [Tipagem](#tipagem)
- [Testes](#testes)
- [Convenções gerais](#convenções-gerais)
- [Decisões arquiteturais (ADR)](#decisões-arquiteturais-adr)

---

## Visão em camadas

O código-fonte segue uma arquitetura em camadas com responsabilidades isoladas:

```text
app        → inicialização, providers e composição de rotas
modules    → funcionalidades por domínio (features)
shared     → infraestrutura transversal reutilizável
core       → base sem UI: config/env e constantes
types      → contratos TypeScript centralizados por contexto
test       → validação automatizada (unitários e integração)
e2e        → testes end-to-end (Playwright)
```

Cada camada tem um contrato claro de dependência: camadas superiores podem
importar das inferiores, mas nunca o contrário. As regras são verificadas pelo
ESLint (`no-restricted-imports` em `eslint.config.mjs`) — ver ADR-0018.

---

## Diagrama de dependência

```mermaid
graph TD
  APP[app] --> SHARED[shared]
  APP --> CORE[core]
  APP --> TYPES[types]
  MODULES[modules] --> SHARED
  MODULES --> CORE
  MODULES --> TYPES
  SHARED --> CORE
  SHARED --> TYPES
  CORE --> TYPES
  TEST[test] --> APP
  TEST --> MODULES
  TEST --> SHARED
  TEST --> TYPES
  E2E[e2e] -->|via HTTP| APP

  style APP fill:#4162D9,color:#fff
  style MODULES fill:#0A7F7A,color:#fff
  style SHARED fill:#0676AE,color:#fff
  style CORE fill:#C42D31,color:#fff
  style TYPES fill:#996105,color:#fff
  style TEST fill:#05844B,color:#fff
  style E2E fill:#263C8D,color:#fff
```

**Regras de dependência:**

| Camada  | Pode importar de             | Não pode importar de |
| ------- | ---------------------------- | -------------------- |
| app     | shared, core, types          | modules (*)          |
| modules | shared, core, types          | app, outro módulo    |
| shared  | core, types                  | app, modules         |
| core    | types                        | app, modules, shared |
| types   | nenhuma (apenas declarações) | qualquer outra       |
| test    | todas as camadas de src      | —                    |

(*) Exceto o carregamento das rotas dos módulos via `import.meta.glob`.

Para inverter uma dependência que apontaria "para cima", a camada inferior
expõe um ponto de registro e o `app` injeta a implementação no bootstrap.

---

## Estrutura de pastas

```text
.
├── docker/                        # Configuração do Nginx da imagem de produção (ADR-0041)
├── docs/                          # Documentação arquitetural e guias
├── e2e/                           # Testes end-to-end (Playwright)
│   ├── *.spec.ts                  # Specs E2E (um arquivo por página/fluxo)
├── mock/                          # API simulada do `pnpm dev` (plugin do Vite, ADR-0039)
├── public/                        # Assets estáticos servidos na raiz
├── src/
│   ├── app/                       # Bootstrap, providers, rotas base
│   │   ├── locales/               # Mensagens i18n (pt-BR.json, en-US.json)
│   │   ├── providers/             # Registro de plugins (Pinia, i18n, Router, Vuetify)
│   │   ├── styles/                # SCSS global
│   │   └── views/                 # Views de uso global (404)
│   ├── core/                      # Base sem UI (não importa app/modules/shared)
│   │   └── config/                # Constantes e variáveis de ambiente
│   ├── modules/                   # Features por domínio
│   │   ├── customers/             # CRUD de exemplo, o exemplo canônico (removível, ADR-0039)
│   │   ├── home/                  # Página inicial do projeto (/)
│   │   └── showcase/              # Documentação do template (removível, ADR-0026)
│   ├── shared/                    # Infraestrutura transversal
│   │   ├── api/                   # Instâncias HTTP e services
│   │   ├── composables/           # Lógica reativa compartilhada (useXxx)
│   │   ├── helpers/               # Funções com efeito lateral (stores/services/DOM)
│   │   ├── stores/                # Estado global (Pinia)
│   │   ├── ui/                    # Layouts, componentes globais, ícones
│   │   ├── utils/                 # Funções puras (sem dependência de camadas)
│   │   └── assets/                # Arquivos estáticos compartilhados
│   ├── test/                      # Testes unitários e de integração (Vitest)
│   └── types/                     # Contratos TypeScript centralizados
├── Dockerfile                     # Imagem de produção: build + Nginx (ADR-0041)
├── .editorconfig                  # Configuração de editor (LF, UTF-8, 2 espaços)
├── .gitattributes                 # Normalização de line endings (eol=lf)
├── .prettierrc                    # Configuração do Prettier
├── playwright.config.ts           # Configuração do Playwright (webServer, Chromium)
├── eslint.config.mjs              # Configuração do ESLint (flat config)
├── tsconfig.app.json              # Configuração do TypeScript (paths, strict)
└── vite.config.ts                 # Configuração do Vite (aliases, build, test)
```

---

## Mapa de documentação

Cada pasta relevante possui um README local com regras, exemplos de bom e mau
código, e instruções de implementação. Navegue diretamente:

| Documento                                                 | Conteúdo                                     |
| --------------------------------------------------------- | -------------------------------------------- |
| [src/README.md](../src/README.md)                         | Visão geral do código-fonte                  |
| [src/app/README.md](../src/app/README.md)                 | Bootstrap, providers, rotas base             |
| [src/core/README.md](../src/core/README.md)               | Config/env e constantes                      |
| [src/modules/README.md](../src/modules/README.md)         | Como criar um módulo de feature              |
| [src/shared/README.md](../src/shared/README.md)           | Utils, helpers, composables, stores, UI, API |
| [src/shared/api/README.md](../src/shared/api/README.md)   | Camada HTTP (factory, services)              |
| [src/types/README.md](../src/types/README.md)             | Tipagem e convenção de nomenclatura TS       |
| [src/test/README.md](../src/test/README.md)               | Estratégia de testes (Vitest + Playwright)   |
| [docs/ONBOARDING.md](ONBOARDING.md)                       | Guia: como criar uma feature passo a passo   |
| [docs/COMMIT-CONVENTIONS.md](COMMIT-CONVENTIONS.md)       | Padrão de mensagens de commit                |
| [docs/CODE-REVIEW-CHECKLIST.md](CODE-REVIEW-CHECKLIST.md) | Critérios de aprovação de PR                 |
| [docs/decisions/README.md](decisions/README.md)           | Decisões arquiteturais registradas (ADR)     |

---

## Fluxo de inicialização

```mermaid
flowchart TD
  A[src/app/main.ts] --> B[createApp - App.vue]
  B --> C[registerPlugins]
  C --> D[Pinia]
  C --> E[i18n]
  C --> F[Router]
  C --> G[Vuetify]
  B --> J[mount #app]
```

1. `main.ts` cria a instância Vue com `App.vue`.
2. `registerPlugins` registra Pinia → i18n → Router → Vuetify.
3. O Router carrega rotas automaticamente via `import.meta.glob('@/{app,modules}/**/routes.ts')`.
4. A aplicação monta no elemento `#app`.

---

## Autenticação

O template não tem autenticação: todas as páginas são públicas (ADR-0021). Uma
tela de login própria será adicionada quando existir um backend de
autenticação, com uma nova ADR definindo o fluxo.

---

## Composição de rotas

O Router carrega automaticamente os `routes.ts` de `app/` e `modules/` via glob:

```ts
const modules = import.meta.glob('@/{app,modules}/**/routes.ts', { eager: true });
```

**Padrão esperado por módulo:**

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/clientes',
    name: 'Clientes',
    component: () => import('./views/ClientesView.vue'),
  },
];

export default routes;
```

**Meta fields disponíveis:**

- `layout: 'empty'` → usa layout sem header/navegação.

---

## Camada HTTP

Padrão adotado: factory `createApiInstance` + services semânticos.

Documentação detalhada: [src/shared/api/README.md](../src/shared/api/README.md)

**Resumo:**

- `shared/api/instances/index.ts` → factory que recebe `baseURL`, cria **uma**
  instância do ofetch e retorna `get`, `post`, `put`, `patch`, `delete`,
  `download` e `upload` (multipart), todos com
  `(url, { query?, body?, headers?, signal? })` (no `upload`, `fields` no lugar
  de `body`) e tipagem genérica, sem casts.
- Instância pré-configurada: `httpClient` (API da aplicação, `VITE_API_BASE_URL`).
- Services expõem funções com nome de negócio. Ficam em `modules/<x>/api/`
  quando um módulo só os usa, e em `shared/api/services/` quando são
  compartilhados (ADR-0025).
- As views leem dados por queries do TanStack Query que chamam os services
  (ADR-0027).
- Componentes/views nunca chamam endpoints diretamente.

---

## Estado global

Stores Pinia ficam em `shared/stores/`. Cada store tem responsabilidade única.

| Store                | Responsabilidade                                         |
| -------------------- | -------------------------------------------------------- |
| `app.store`          | Estado global de UX (tema persistido)                    |
| `notification.store` | Fila do snackbar global; use pelo `useNotify` (ADR-0040) |

**Regra de uso:**

- Estado transversal/global → store.
- Estado local de tela/componente → `ref`/`reactive` no próprio componente.
- Lógica reativa derivada de stores → composables.

---

## Utils, Helpers e Composables

Documentação detalhada: [src/shared/README.md](../src/shared/README.md)

**Resumo da decisão:**

| Precisa de store/service? | É reativo (ref/computed)? | Vai para       |
| ------------------------- | ------------------------- | -------------- |
| Não                       | Não                       | `utils/`       |
| Sim                       | Não                       | `helpers/`     |
| Sim                       | Sim                       | `composables/` |

- **utils**: funções puras — `formatCurrency`, `truncate`, `formatDate`, `validateFile`.
- **helpers**: interagem com stores/services/DOM — `downloadAndSave`, `validateAndUpload`.
- **composables**: lógica reativa — `useTheme`.

---

## UI e Layouts

- **Layouts** em `shared/ui/layouts/`: `DefaultLayout` (header + nav) e `EmptyLayout`.
- **Componentes base** em `shared/ui/components/`: agnósticos de domínio.
- `App.vue` seleciona o layout dinamicamente via `route.meta.layout`.

**Padrão de componente apresentacional:**

```vue
<script setup lang="ts">
defineProps<{ title: string; value: string }>();
const emit = defineEmits<{ select: [] }>();
</script>
```

**Convenções:**

- Views são containers (orquestram dados).
- Componentes filhos são apresentacionais (props + emits).
- Eventos customizados em camelCase (`switchTheme`, não `switch-theme`).

---

## Tipagem

Documentação detalhada: [src/types/README.md](../src/types/README.md)

**Resumo:**

- Tipos de um módulo só ficam em `src/modules/<x>/types.ts`; os compartilhados, em `src/types/` por contexto (store, theme, http, router...) (ADR-0025).
- Alias de importação: `@typings/<contexto>`.
- Interfaces sem prefixo `I`, PascalCase, sem decoração de tipo no nome.
- Separar contrato de API do contrato de UI (mapear explicitamente).
- Preferir `interface` para objetos, `type` para uniões/utilitários.

---

## Testes

Documentação detalhada: [src/test/README.md](../src/test/README.md)

**Ferramentas:**

- **Unitários e integração**: Vitest + Vue Test Utils + happy-dom.
- **End-to-end**: Playwright (Chromium).

**Estrutura:**

- `src/test/` → specs unitárias (`.spec.ts`).
- `e2e/` → specs E2E (`.spec.ts`).

**Comandos:**

```bash
pnpm test                 # unitários (single run)
pnpm test:watch           # unitários (watch mode)
pnpm test:coverage        # cobertura
pnpm test:e2e             # E2E headless
pnpm test:e2e:open        # E2E interativo (Playwright UI)
pnpm test:all             # unitários + E2E
```

**Thresholds de cobertura:**

Piso que só sobe (ratchet — ADR-0016), definido em `vite.config.ts`:
lines 29%, functions 19%, branches 51%, statements 28%.

---

## Convenções gerais

### Idioma

- **Documentação**: português (UTF-8, com acentuação).
- **Código** (nomes de funções, variáveis, arquivos): inglês.
- **Commits**: português.
- **Contratos de API**: mantém o idioma original do backend.

### Estilo de código

- Formatação 100% a cargo do Prettier (sem regras estilísticas no ESLint).
- ESLint cuida apenas de regras de qualidade e boas práticas.
- `editor.formatOnSave` habilitado no projeto (`.vscode/settings.json`).

### Aliases de importação

| Alias      | Aponta para    |
| ---------- | -------------- |
| `@`        | `src/`         |
| `@app`     | `src/app/`     |
| `@core`    | `src/core/`    |
| `@modules` | `src/modules/` |
| `@shared`  | `src/shared/`  |
| `@typings` | `src/types/`   |
| `@test`    | `src/test/`    |

**Regra**: sempre usar o alias mais próximo do destino. Nunca usar `@/shared/`
quando `@shared/` está disponível.

### Line endings

- Repositório normalizado em LF (`.gitattributes`).
- Editor configurado para salvar em LF (`.editorconfig`).

### Variáveis de ambiente

- Centralizadas em `src/core/config/index.ts` (`@core/config`).
- Nunca acessar `import.meta.env` diretamente fora do config.

---

## Decisões arquiteturais (ADR)

As decisões arquiteturais relevantes do projeto são registradas como
**ADR** (Architecture Decision Records) no formato MADR, em português, na pasta
[docs/decisions/](decisions/README.md).

Cada ADR documenta o contexto, as opções consideradas, a decisão tomada e suas
consequências — preservando o "porquê" das escolhas ao longo do tempo. As
decisões estruturais descritas neste guia (camadas, camada HTTP,
roteamento, testes, tipagem, etc.) têm ADRs correspondentes.

Ao tomar uma nova decisão arquitetural, registre-a seguindo as instruções em
[docs/decisions/README.md](decisions/README.md).
