# Skill: Vue 3 + Vuetify 4 + TypeScript

## Objetivo

Implementar código frontend seguindo os padrões deste projeto: Vue 3 com
Composition API, Vuetify 4, TypeScript strict, Pinia, ofetch e Vue Router.

## Sinais técnicos

Reconheça e utilize: SFCs com `<script setup lang="ts">`, `defineProps<T>()`,
`defineEmits<T>()`, composables `use*`, stores Pinia (Options API), services
via `createApiInstance`, queries do TanStack Query (`useQuery`), Vue Router com
auto-discovery, aliases de importação (`@shared/`, `@core/`, `@app/`,
`@typings/`, `@modules/`, `@test/`).

## Arquitetura em camadas

```text
src/
├── app/       → bootstrap, providers, rotas base (nunca importa modules)
├── modules/   → features por domínio (independentes entre si)
├── shared/    → infraestrutura transversal (nunca importa modules/app)
├── core/      → config/env e constantes (importa só types)
├── types/     → contratos compartilhados (sem imports de camadas)
└── test/      → testes (pode importar todas as camadas)
```

## Padrões de código

### Componente apresentacional

```vue
<template>
  <v-card variant="outlined">
    <v-card-text>{{ metric.label }}: {{ metric.value }}</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Metric } from '../types';

defineProps<{ metric: Metric }>();
</script>
```

- Sem fetch, sem store, sem efeito lateral.
- Props tipadas com interface (`types.ts` do módulo ou `@typings/` se compartilhada).
- Ordem: `<template>` → `<script>` → `<style>`.

### Query (composable do módulo)

```ts
// modules/metrics/composables/useMetricQuery.ts
import { useQuery } from '@tanstack/vue-query';
import { getMetricRequest } from '../api/metric.service';

export function useMetricQuery() {
  return useQuery({
    queryKey: ['metric'],
    queryFn: ({ signal }) => getMetricRequest({ signal }),
  });
}
```

- Dados do servidor são lidos com TanStack Query (ADR-0027), nunca com
  `ref` + `onMounted`.
- A query fica num composable do módulo; a `queryKey` identifica o dado no cache.
- Repasse o `signal` ao service para cancelar a requisição.

### View container

```vue
<template>
  <v-alert v-if="error" type="error" :text="error.message" />
  <v-progress-linear v-else-if="isPending" indeterminate color="primary" />
  <MetricCard v-else-if="data" :metric="data" />
</template>

<script setup lang="ts">
import MetricCard from '../components/MetricCard.vue';
import { useMetricQuery } from '../composables/useMetricQuery';

const { data, error, isPending } = useMetricQuery();
</script>
```

- Orquestra dados (query → props).
- Trata os estados que a query expõe (loading, erro).
- Nunca lógica de apresentação complexa.

### Service

```ts
// modules/customers/api/customer.service.ts
import { httpClient } from '@shared/api/instances';
import type { Customer } from '../types';

export function getCustomersRequest(options: { signal?: AbortSignal } = {}): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers', { signal: options.signal });
}
```

- Fica em `modules/<x>/api/` quando só um módulo usa; vai para
  `shared/api/services/` quando um segundo módulo precisar (ADR-0025).
- Usa instância HTTP compartilhada (nunca ofetch direto).
- Retorno tipado com generic e `signal` opcional para cancelamento.
- Nome descritivo com sufixo `Request`.

### Store (Pinia)

```ts
import { defineStore } from 'pinia';
import type { NotificationState } from '@typings/store';

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({ items: [], unreadCount: 0 }),
  getters: {
    hasUnread: (state): boolean => state.unreadCount > 0,
  },
  actions: {
    markAllAsRead(): void {
      this.items.forEach((item) => (item.read = true));
      this.unreadCount = 0;
    },
  },
});
```

- Options API do Pinia.
- State tipado com interface centralizada.
- Actions encapsulam toda mutação.

### Rotas (auto-descoberta)

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./views/CustomersView.vue'),
  },
];

export default routes;
```

- Tipagem explícita `RouteRecordRaw[]`.
- Lazy loading com `import()`.
- Meta fields: `layout` (todas as rotas são públicas — ADR-0021).

### Composable

```ts
import { computed } from 'vue';
import { useAppStore } from '@shared/stores/app.store';

export function useTheme() {
  const appStore = useAppStore();
  const isDark = computed(() => appStore.theme === 'dark');

  function toggleTheme(): void {
    appStore.switchTheme();
  }

  return { isDark, toggleTheme };
}
```

- Prefixo `use`.
- Retorna refs/computeds + ações.
- Encapsula acesso à store.

## Separação shared/

| Precisa de store/service? | É reativo? | Destino        |
| ------------------------- | ---------- | -------------- |
| Não                       | Não        | `utils/`       |
| Sim                       | Não        | `helpers/`     |
| Sim                       | Sim        | `composables/` |

## Vuetify — convenções

- Tema configurado em `src/app/providers/vuetify.ts`.
- Variáveis de tema acessíveis via classes utilitárias do Vuetify.
- Texto colorido usa os tons `<cor>-text` do tema (`text-primary-text`,
  `color="secondary-text"` em chips de texto), que têm contraste AA. A cor da
  marca (`primary`, `secondary`...) fica para fundos, bordas e botões (ADR-0029).
- Componentes Vuetify usados diretamente nos templates (auto-import ativo).
- Ícones via Material Symbols (pacote `material-symbols`, icon set `ms` do
  Vuetify). Use a ligatura do ícone, sem prefixo: `icon="settings"`,
  `prepend-icon="home"`. Catálogo: https://fonts.google.com/icons
- Variante preenchida (eixo `FILL`): sufixo `-fill` no nome (`icon="favorite-fill"`)
  ou a classe utilitária `ms-fill` (`<v-icon class="ms-fill" icon="favorite" />`).
  Sem o sufixo/classe, o ícone é exibido em contorno (outline).
- Eventos em camelCase nos emits, kebab-case nos templates (Vue converte).

## Não fazer

- Não usar `any` em contratos de domínio.
- Não usar `defineProps` runtime (sem generics).
- Não acessar `import.meta.env` fora de `@core/config`.
- Não importar módulo de outro módulo.
- Não importar `app/` nem `modules/` a partir de `shared/` (nem `shared/` a partir de `core/`).
- Não criar componente em `shared/ui/` que dependa de regras de domínio.
- Não chamar endpoint diretamente na view (usar service).
- Não mutar state de store fora de uma action.
