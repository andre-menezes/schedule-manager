# modules

Camada de funcionalidades de domínio. Cada pasta representa um contexto
funcional isolado.

Módulos do template:

- `home`: página inicial do projeto (`/`).
- `showcase`: telas de documentação do template (hub em `/docs`). Removido por
  `pnpm template:clean` ao iniciar um projeto novo (ADR-0026).
- `customers`: CRUD de exemplo (`/customers`), o exemplo canônico do
  Onboarding: listagem paginada, detalhe, cadastro, edição e exclusão, com a
  API simulada de `mock/` no `pnpm dev`. Também removido pelo
  `pnpm template:clean` (ADR-0039).

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Estrutura esperada por módulo

```text
<módulo>/
├── routes.ts          # rotas do módulo (auto-descobertas pelo router)
├── views/             # views container (orquestram dados)
├── components/        # componentes apresentacionais do módulo
├── types.ts           # tipos do módulo (ou types/ quando crescer)
├── api/               # services do módulo (opcional)
├── stores/            # stores usadas só por este módulo (opcional)
├── composables/       # composables usados só por este módulo (opcional)
└── locales/           # mensagens do módulo, um <locale>.json por locale (opcional)
```

Tudo que só este módulo usa fica aqui (ADR-0025). Um módulo com `locales/`
precisa de um arquivo para cada locale de `SUPPORTED_LOCALES` (`pt-BR.json` e
`en-US.json`), com as mesmas chaves: o `messages.ts` os descobre por glob e o
teste de paridade e o ESLint cobram as chaves (ADR-0038). Quando um segundo módulo
precisar de algo, promova: tipos para `src/types/`, o resto para `shared/`.

## Como as rotas são carregadas

O router carrega automaticamente os `routes.ts` de `app/` e `modules/` via glob:

```ts
const modules = import.meta.glob('@/{app,modules}/**/routes.ts', { eager: true });
```

Basta criar um `routes.ts` exportando um array default — a rota é registrada
sem nenhuma configuração manual adicional.

## Regras

- `routes.ts` deve exportar `default` com array tipado `RouteRecordRaw[]`.
- Views funcionam como container/orquestrador (buscam dados, passam props).
- Components priorizam responsabilidade apresentacional (props + emits).
- Regra de negócio reutilizável deve ir para `shared/` (service, store, util).
- Um módulo **nunca** importa de outro módulo (módulos são independentes).
- Um módulo pode importar de `shared/` e `types/`.

## Meta fields disponíveis

| Meta       | Tipo       | Efeito                                                            |
| ---------- | ---------- | ----------------------------------------------------------------- |
| `layout`   | `string`   | Define o layout (`'empty'` para sem chrome)                       |
| `titleKey` | `string`   | Chave i18n do título da aba: `"<título> · <APP_NAME>"` (ADR-0036) |
| `nav`      | `RouteNav` | Item no menu lateral: `titleKey` (i18n), `icon` e `order`         |

## Exemplo — bom código (módulo completo)

### routes.ts

```ts
// src/modules/customers/routes.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./views/CustomersView.vue'),
    meta: {
      titleKey: 'pageTitle.customers',
      nav: { titleKey: 'nav.customers', icon: 'group', order: 20 },
    },
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: () => import('./views/CustomerDetailView.vue'),
  },
];

export default routes;
```

Por que é bom: rotas tipadas com `RouteRecordRaw[]`, lazy loading via
`import()`, meta fields declarados, nome semântico.

### Query do módulo

```ts
// src/modules/customers/composables/useCustomersQuery.ts
import { useQuery } from '@tanstack/vue-query';
import { getCustomersRequest } from '../api/customer.service';

export function useCustomersQuery() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => getCustomersRequest({ signal }),
  });
}
```

Por que é bom: dados do servidor ficam no TanStack Query (ADR-0027), que cuida
de cache, loading, erro e cancelamento. A chave da query é o único contrato a
invalidar depois de uma gravação.

### View container

```vue
<!-- src/modules/customers/views/CustomersView.vue -->
<template>
  <section class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">Clientes</h1>
    <v-alert v-if="error" type="error" :text="error.message" />
    <CustomerList v-else :customers="data ?? []" :loading="isPending" />
  </section>
</template>

<script setup lang="ts">
import CustomerList from '../components/CustomerList.vue';
import { useCustomersQuery } from '../composables/useCustomersQuery';

const { data, error, isPending } = useCustomersQuery();
</script>
```

Por que é bom: a view orquestra dados (consome a query, trata loading e erro),
passa o resultado para o componente apresentacional e não tem lógica de
template complexa.

### Componente apresentacional

```vue
<!-- src/modules/customers/components/CustomerList.vue -->
<template>
  <v-progress-linear v-if="loading" indeterminate color="primary" />
  <v-list v-else>
    <v-list-item v-for="customer in customers" :key="customer.id">
      <v-list-item-title>{{ customer.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { Customer } from '../types';

defineProps<{
  customers: Customer[];
  loading: boolean;
}>();
</script>
```

Por que é bom: componente puro, sem fetch, sem store, testável em isolamento.

## Exemplo — mau código (view fazendo tudo inline)

```vue
<!-- RUIM: view com fetch, lógica de negócio e apresentação misturados -->
<template>
  <div>
    <p v-if="loading">Carregando...</p>
    <div v-for="c in customers" :key="c.id">
      <span>{{ c.name }}</span>
      <span v-if="c.active && c.balance > 1000" class="text-success">VIP</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ofetch } from 'ofetch';

const customers = ref<any[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  // RUIM: URL e configuração de transporte montadas na view, ignorando a
  // instância `httpClient` (base URL, timeout e cancelamento centralizados).
  customers.value = await ofetch('https://api.exemplo.com/customers', {
    timeout: 5000,
  });
  loading.value = false;
});
</script>
```

Por que é ruim:

- Fetch direto na view (viola separation of concerns — use service e query).
- Loading controlado à mão e sem `try/finally`: um erro deixa a tela carregando para sempre (o `useQuery` resolve).
- Base URL e timeout fixos na view (viola DRY — a instância `httpClient` já centraliza a configuração de transporte).
- Configuração de transporte no componente (viola encapsulamento — use a instância/service).
- Lógica de negócio no template (`c.active && c.balance > 1000`).
- Tipo `any[]` (viola type safety).
- Sem separação view/componente (SRP violado).

## Exemplo — mau código (módulo importando outro módulo)

```ts
// RUIM: módulo customers importa direto do módulo orders
import { getOrdersByCustomer } from '@modules/orders/services/order.service';
```

Por que é ruim: viola a regra de independência entre módulos. Se
`customers` precisa de dados de `orders`, a lógica deve ser movida para
`shared/api/services/` onde ambos podem consumir.

## Checklist para criar um novo módulo

1. Criar pasta em `src/modules/<nome>/`.
2. Criar `routes.ts` com array tipado `RouteRecordRaw[]`.
3. Criar `views/` com ao menos uma view container.
4. Criar `components/` para componentes apresentacionais.
5. Criar `types.ts` no módulo se houver contratos específicos.
6. Criar service em `api/` no módulo se houver integração com backend.
7. Ler dados do servidor com `useQuery` num composable em `composables/` (ADR-0027).
8. Verificar que o lint e type-check passam (`pnpm lint && pnpm build`).
