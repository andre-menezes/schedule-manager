# shared/ui

Camada de interface compartilhada.

Voltar para o guia geral: [../../../docs/ARCHITECTURE-GUIDE.md](../../../docs/ARCHITECTURE-GUIDE.md)

## Subpastas

| Pasta         | Responsabilidade                                          |
| ------------- | --------------------------------------------------------- |
| `components/` | Componentes globais (header, menu, idioma, logo, estados) |
| `layouts/`    | Estruturas de página (DefaultLayout, EmptyLayout)         |
| `icons/`      | Wrappers e padrões de ícones                              |

## Layouts

A seleção de layout é dinâmica, baseada em `route.meta.layout`:

```vue
<!-- App.vue -->
<component :is="currentLayout">
  <router-view />
</component>
```

| Layout          | Quando usar                                     |
| --------------- | ----------------------------------------------- |
| `DefaultLayout` | Páginas com header + navegação lateral (padrão) |
| `EmptyLayout`   | Páginas sem chrome (ex.: telas de erro)         |

Para usar `EmptyLayout`, defina `meta: { layout: 'empty' }` na rota.

## Design system Agenda (ADR-0044, ADR-0045)

O tema, os padrões dos componentes e a tipografia seguem o
[Figma](https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z). Uma tela nova já
sai no design system usando os componentes do Vuetify e os `Base*` abaixo.

- **Tipografia:** classes do MUI (`text-h4`, `text-subtitle-1`, `text-body-2`,
  `text-caption`, `text-overline`…), definidas em
  `src/app/styles/typography.scss`, com variantes por breakpoint
  (`text-md-h3`).
- **Padrões:** botões sem elevação, cartões com borda e sem sombra, campos em
  contorno, menus e diálogos com raio de 8px e sombra
  (`componentDefaults` em `@app/providers/vuetify`). Não repita essas props
  nas telas.
- **Cores:** marca nas ações; texto colorido com `<cor>-text`; fundos de
  status com `<tom>-container`; compromissos com `event-<matiz>`.

| Componente          | Para quê                               | Principais props                                                                              |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `BasePageHeader`    | `<h1>` da tela com ações               | `title`, `subtitle?`, `overline?`; slots `prepend`, `actions`                                 |
| `BaseStatusChip`    | Situação de um item                    | `label`, `tone` (`success`…`neutral`), `icon?`                                                |
| `BaseAvatar`        | Pessoa (iniciais e cor estável)        | `name`, `size?`, `hue?`, `decorative?`                                                        |
| `BaseConfirmDialog` | Confirmar uma ação (destrutiva ou não) | `v-model`, `title`, `message`, `confirm-label`, `tone`, `loading`, `error-message`; `confirm` |
| `BaseEventBlock`    | Compromisso numa agenda                | `title`, `time`, `hue`, `subtitle?`, `compact?`, `clickable?`; `select`                       |

O módulo decide o significado e o componente só desenha: o
`CustomerStatusChip` traduz "ativo" em `tone="success"`. Exemplos vivos na
vitrine, em Componentes → Design system Agenda.

## Estados de carregamento, vazio e erro

Toda área que lê dados do servidor tem os mesmos três estados, com os mesmos
componentes (roadmap 2.4). Os textos padrão vêm de `states.*` no locale do app.

| Componente         | Quando usar                      | Props e slots                                           |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| `BaseLoadingState` | Primeira carga da área           | `label?` (padrão "Carregando…"); `role="status"`        |
| `BaseEmptyState`   | Nada a exibir, ou não encontrado | `title?`, `description?`, `icon?`; slot `actions`       |
| `BaseErrorState`   | Falha ao carregar                | `message`, `title?`, `retryable?`, `retrying?`; `retry` |

```vue
<BaseLoadingState v-if="isPending" />
<BaseErrorState
  v-else-if="error"
  :message="errorMessage(error)"
  retryable
  :retrying="isFetching"
  @retry="refetch"
/>
<BaseEmptyState v-else-if="!data?.length" :title="$t('orders.empty')" icon="inbox" />
<OrderList v-else :orders="data" />
```

A mensagem de erro chega pronta, de `useErrorMessage()`; numa tabela do
Vuetify, use o `BaseEmptyState` no slot `#no-data`. O módulo `customers` usa os
três (`CustomersView`, `CustomerDetailView`, `CustomerFormView`).

## Componente apresentacional vs container

| Tipo             | Responsabilidade                                   | Onde fica              |
| ---------------- | -------------------------------------------------- | ---------------------- |
| Apresentacional  | Renderizar UI com base em props/emits              | `shared/ui/` ou módulo |
| Container (view) | Orquestrar dados (services, stores) e passar props | `modules/*/views/`     |

**Regra fundamental**: componentes em `shared/ui/` devem ser **agnósticos de
domínio**. Se um componente precisa conhecer regras de negócio específicas de
um módulo, ele pertence ao módulo (não ao shared).

## Convenções

- Props tipadas com `defineProps<T>()` (nunca `defineProps({ ... })` runtime).
- Emits tipados com `defineEmits<T>()`.
- Eventos customizados em **camelCase** (`switchTheme`, não `switch-theme`).
- Ordem dos blocos: `<template>` → `<script>` → `<style>`.
- Componentes compartilhados com prefixo `The` para singletons (`TheAppHeader`)
  ou `Base` para componentes base reutilizáveis (`BaseLogo`).
- Slots para composição flexível; evitar props complexas que poderiam ser slots.
- Texto colorido usa os tons `<cor>-text` do tema (`text-primary-text`); a cor
  da marca não tem contraste AA como texto e fica para fundos, bordas e botões
  (ADR-0029).

## Exemplo — bom código (componente apresentacional)

```vue
<template>
  <v-card class="h-100" variant="outlined">
    <v-card-text class="pa-5">
      <span class="text-overline font-weight-bold">{{ metric.label }}</span>
      <strong class="text-h4 font-weight-bold">{{ metric.value }}</strong>
      <span class="text-caption text-medium-emphasis">{{ metric.detail }}</span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Metric } from '@typings/metric';

defineProps<{ metric: Metric }>();
</script>
```

Por que é bom: componente puro — recebe dados via props, sem fetch interno,
sem store, sem efeito colateral. Facilmente testável, reutilizável e
compreensível apenas lendo a interface de props.

## Exemplo — mau código (componente que faz fetch e acessa store)

```vue
<template>
  <div :class="{ 'bg-grey-darken-4': appStore.theme === 'dark' }">
    <p v-if="loading">Carregando...</p>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.nome }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ofetch } from 'ofetch';
import { useAppStore } from '@shared/stores/app.store';

const appStore = useAppStore();
const users = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  users.value = await ofetch('/api/users');
  loading.value = false;
});
</script>
```

Por que é ruim: viola SRP — um componente "apresentacional" está buscando
dados, lendo store e gerenciando loading. Isso deveria estar na view
container ou num composable. O componente se torna impossível de reutilizar
em outro contexto sem arrastar toda essa lógica.

**Correção**: separar em view container + componente apresentacional:

```vue
<!-- View container (modules/users/views/UsersView.vue) -->
<template>
  <UserList :users="data ?? []" :loading="isPending" />
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUsersRequest } from '../api/user.service';
import UserList from '../components/UserList.vue';

const { data, isPending } = useQuery({
  queryKey: ['users'],
  queryFn: ({ signal }) => getUsersRequest({ signal }),
});
</script>
```

```vue
<!-- Componente apresentacional (modules/users/components/UserList.vue) -->
<template>
  <p v-if="loading">Carregando...</p>
  <ul>
    <li v-for="user in users" :key="user.id">{{ user.nome }}</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ users: User[]; loading: boolean }>();
</script>
```

## Exemplo — mau código (lógica de negócio no template)

```vue
<template>
  <v-chip v-if="user.roles.includes('ADMIN') && user.unidade.codigo === '001'" color="success">
    Administrador da unidade central
  </v-chip>
</template>
```

Por que é ruim: lógica de regra de negócio (quem é admin da central) está
acoplada ao template. Dificulta manutenção, teste e reuso. Extraia para um
computed ou para um helper:

```vue
<template>
  <v-chip v-if="isCentralAdmin" color="success"> Administrador da unidade central </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ user: User }>();

const isCentralAdmin = computed(
  () => props.user.roles.includes('ADMIN') && props.user.unidade.codigo === '001'
);
</script>
```
