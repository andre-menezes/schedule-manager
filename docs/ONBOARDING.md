# Guia de Onboarding — Como criar uma nova feature

Guia passo a passo para implementar uma funcionalidade completa no projeto,
do módulo ao teste. Siga na ordem e consulte os READMEs específicos para
detalhes de cada camada.

Voltar para o guia geral: [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)

---

## Pré-requisitos

- Node.js **24.22.2** (versão de referência em `.nvmrc`/`.tool-versions`; o `pnpm install` aceita qualquer 24.x a partir dela — ver o CONTRIBUTING)
- pnpm 10 (`corepack enable` uma vez por máquina; ver o CONTRIBUTING)
- Variáveis de ambiente: opcionais (para sobrescrever os padrões, copie `.env.example` para `.env.development.local`)
- Extensões recomendadas instaladas (veja `.vscode/extensions.json`)

```bash
pnpm install
pnpm dev
```

---

## Exemplo canônico — módulo `customers`

Os passos abaixo usam trechos curtos. O exemplo completo, que compila e passa
no lint, na cobertura e no axe, é o módulo `src/modules/customers`: rode
`pnpm dev` e abra `/customers`. A API vem de uma simulação em memória servida
pelo próprio Vite (`mock/`, ADR-0039); para usar um backend real, aponte o
`VITE_API_BASE_URL` para ele.

| Arquivo                                        | O que mostra                                                    |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `types.ts`                                     | Contrato da API: cliente, campos editáveis e filtro da listagem |
| `api/customer.service.ts`                      | Uma função por endpoint, com `signal` nas leituras              |
| `composables/customer-keys.ts`                 | Chaves de query centralizadas, para ler e invalidar             |
| `composables/useCustomersQuery.ts`             | Página reativa aos parâmetros, com `keepPreviousData`           |
| `composables/useCustomerQuery.ts`              | Detalhe com query desligada sem id (`enabled`)                  |
| `composables/useCustomerMutations.ts`          | Cadastro, edição e exclusão invalidando as listas               |
| `list-query.ts`                                | Busca na URL, somada à paginação de `@shared/utils/pagination`  |
| `views/CustomersView.vue`                      | Container da listagem: URL → query → tabela                     |
| `views/CustomerDetailView.vue`                 | Detalhe, 404 tratado e exclusão confirmada                      |
| `views/CustomerFormView.vue`                   | Um formulário para cadastro e edição                            |
| `components/`                                  | Tabela, formulário, detalhe e diálogo, só com props e emits     |
| `src/test/customers/`, `e2e/customers.spec.ts` | Testes do service às views, e o fluxo completo no navegador     |

O módulo `customers` e a spec dele (`docs/specs/FEAT-001-crud-de-clientes.md`)
foram removidos na criação do Agenda; continuam no repositório
[andre-menezes/vue-template](https://github.com/andre-menezes/vue-template)
como exemplo completo a consultar.

---

## Passo 1 — Criar o módulo

Crie a pasta do módulo em `src/modules/<nome>/`:

```text
src/modules/customers/
├── routes.ts
├── views/
└── components/
```

### routes.ts

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./views/CustomersView.vue'),
    meta: { nav: { titleKey: 'nav.customers', icon: 'group', order: 20 } },
  },
];

export default routes;
```

A rota é registrada automaticamente pelo router (auto-discovery via glob), e o
`meta.nav` coloca o item no menu lateral, na posição de `order`. Não é
necessário editar nenhum outro arquivo além de criar a chave `nav.customers` em
cada locale do módulo (`locales/pt-BR.json` e `locales/en-US.json` — ADR-0038).
Rotas sem `meta.nav` (detalhe, edição) não aparecem no menu.

> Referência: [src/modules/README.md](../src/modules/README.md)

---

## Passo 2 — Criar os tipos

Crie os contratos do domínio em `src/modules/<nome>/types.ts` (ADR-0025). Só
promova para `src/types/` quando um segundo módulo precisar deles:

```ts
// src/modules/customers/types.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export interface CreateCustomerParams {
  name: string;
  email: string;
}
```

> Referência: [src/types/README.md](../src/types/README.md)

---

## Passo 3 — Criar o service

Crie as funções de comunicação com o backend em `src/modules/<nome>/api/`. Aceite
um `signal` opcional, para que a requisição seja cancelada quando a tela deixa de
precisar dela:

```ts
// src/modules/customers/api/customer.service.ts
import { httpClient } from '@shared/api/instances';
import type { CreateCustomerParams, Customer } from '../types';

export function getCustomersRequest(options: { signal?: AbortSignal } = {}): Promise<Customer[]> {
  return httpClient.get<Customer[]>('/customers', { signal: options.signal });
}

export function createCustomerRequest(params: CreateCustomerParams): Promise<Customer> {
  return httpClient.post<Customer>('/customers', { body: params });
}
```

> Referência: [src/shared/api/README.md](../src/shared/api/README.md)

---

## Passo 4 — Criar a query e a view container

Dados do servidor são lidos com TanStack Query (ADR-0027). Encapsule a query num
composable do módulo; ele cuida de cache, loading, erro e cancelamento:

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

A view orquestra os dados e passa para componentes apresentacionais:

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

Para gravar (criar, editar, excluir), use `useMutation` e invalide a query
afetada no `onSuccess` (`queryClient.invalidateQueries({ queryKey: ['customers'] })`).
Pinia continua sendo o lugar do estado de cliente (tema, preferências), não de
cópias de dados do servidor.

> Referência: [src/shared/ui/README.md](../src/shared/ui/README.md) (padrão container vs apresentacional)

---

## Passo 5 — Criar componentes apresentacionais

Componentes puros: recebem props, emitem eventos, sem fetch nem store.

```vue
<!-- src/modules/customers/components/CustomerList.vue -->
<template>
  <v-progress-linear v-if="loading" indeterminate color="primary" />
  <v-list v-else>
    <v-list-item
      v-for="customer in customers"
      :key="customer.id"
      :data-cy="`customer-${customer.id}`"
    >
      <v-list-item-title>{{ customer.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ customer.email }}</v-list-item-subtitle>
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

---

## Passo 6 — Criar testes

### Teste unitário (Vitest)

```ts
// src/test/customers/customer.service.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCustomersRequest } from '@/modules/customers/api/customer.service';
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: { get: vi.fn() },
}));

describe('customer service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna lista de clientes', async () => {
    const mockCustomers = [{ id: 1, name: 'Empresa A', email: 'a@a.com', active: true }];
    vi.mocked(httpClient.get).mockResolvedValue(mockCustomers);

    const result = await getCustomersRequest();

    expect(result).toEqual(mockCustomers);
    expect(httpClient.get).toHaveBeenCalledWith('/customers', { signal: undefined });
  });
});
```

Para testar a view, monte com `mountWithPlugins`: ele já registra o TanStack
Query com um `QueryClient` novo por teste e sem retentativas. Mocke o service e
use `flushPromises()` antes de verificar a tela.

### Teste E2E (Playwright)

```ts
// e2e/customers_page.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Página Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test('exibe a lista de clientes', async ({ page }) => {
    const customers = page.locator('[data-cy^="customer-"]');
    await expect(customers.first()).toBeVisible();
  });
});
```

> Referência: [src/test/README.md](../src/test/README.md)

---

## Passo 7 — Validar

Antes de commitar, garanta que tudo passa:

```bash
pnpm lint             # sem erros de lint
pnpm build            # typecheck + build sem erros
pnpm test             # testes unitários passando
```

---

## Checklist de conclusão

- [ ] Módulo criado em `src/modules/<nome>/`
- [ ] `routes.ts` com tipagem `RouteRecordRaw[]` e meta fields
- [ ] Tipos criados em `src/modules/<nome>/types.ts`
- [ ] Service criado em `src/modules/<nome>/api/`
- [ ] Query num composable do módulo (`useQuery`) e view container usando-a
- [ ] Componentes apresentacionais com props tipadas
- [ ] Teste unitário cobrindo o service
- [ ] Teste E2E cobrindo o fluxo principal
- [ ] `pnpm lint` sem erros
- [ ] `pnpm build` sem erros
- [ ] `pnpm test` passando
- [ ] Commit seguindo [COMMIT-CONVENTIONS.md](COMMIT-CONVENTIONS.md)

---

## Dúvidas frequentes

**Onde colocar lógica reutilizável entre módulos?**
Em `shared/` — se é pura vai em `utils/`, se interage com store/service vai
em `helpers/`, se é reativa vai em `composables/`.

**Preciso criar uma store para minha feature?**
Para dados do servidor, não: use TanStack Query (ADR-0027). Crie store só para
estado de cliente transversal ou persistente. Estado local de tela fica em
`ref`/`reactive` no componente.

**Posso importar de outro módulo?**
Não. Módulos são independentes. Se precisa compartilhar, mova para `shared/`.

**Onde ficam as variáveis de ambiente?**
Sempre em `src/core/config/index.ts` (`@core/config`). Nunca use `import.meta.env` diretamente.
