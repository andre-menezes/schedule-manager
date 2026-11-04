# app

Camada de bootstrap e composição global da aplicação.

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Responsabilidades

- Inicializar a aplicação (`main.ts`).
- Registrar plugins globais (`providers/`).
- Configurar o Router (`providers/router.ts`): auto-discovery de rotas e
  rolagem.
- Definir rotas base da aplicação (`routes.ts`).
- Selecionar layout dinamicamente (`App.vue`).

## Subpastas

| Pasta        | Responsabilidade                                                                    |
| ------------ | ----------------------------------------------------------------------------------- |
| `locales/`   | Mensagens do app, um arquivo por locale (`pt-BR.json`, `en-US.json` — ADR-0038)     |
| `providers/` | Plugins (Pinia, TanStack Query, i18n, Router, Vuetify) e tratamento global de erros |
| `styles/`    | SCSS global                                                                         |
| `views/`     | Views de uso global (404)                                                           |

Configuração de ambiente e constantes ficam na camada `core`
([../core/README.md](../core/README.md)), que não depende de `app`.

## Registro de plugins (`providers/plugins.ts`)

Os plugins são registrados em ordem específica (Pinia primeiro para que i18n
e Router possam usar stores no setup):

```ts
import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import pinia from './pinia';
import i18n from './i18n';
import vuetify from './vuetify';
import router from './router';
import { queryPluginOptions } from './query';

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(VueQueryPlugin, queryPluginOptions);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
}
```

## Tratamento global de erros (`providers/errors.ts`)

`main.ts` chama `registerErrorHandlers(app)` antes dos plugins. Erros não
tratados em componentes (`app.config.errorHandler`) e promises rejeitadas sem
`catch` (`unhandledrejection`) vão para um único `ErrorReporter`, que por
padrão escreve no console (ADR-0028). Para ligar um serviço de monitoramento,
passe outro reporter:

```ts
registerErrorHandlers(app, (error, context) => monitoring.capture(error, context));
```

### Exemplo — bom código (adicionar novo plugin)

```ts
// 1. Criar providers/notifications.ts
export default {
  install() {
    // inicialização do plugin
  },
};

// 2. Registrar em providers/plugins.ts
import notifications from './notifications';

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(vuetify);
  app.use(notifications); // novo plugin adicionado por último
}
```

### Exemplo — mau código (plugin com side effect descontrolado)

```ts
// RUIM: plugin que executa lógica pesada no install sem contexto
export default {
  install() {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        window.__APP_CONFIG__ = data; // variável global não tipada
      });
  },
};
```

Por que é ruim: side effect assíncrono no `install` sem controle de erro,
variável global sem tipagem, impossível testar, e a app pode renderizar
antes do fetch resolver.

## Autenticação

O template não tem autenticação nem guard de rotas: todas as páginas são
públicas (ADR-0021). Um login próprio será adicionado junto com o backend de
autenticação.

## Rotas base (`routes.ts`)

Rotas que não pertencem a nenhum módulo de domínio (ex.: 404):

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    // Catch-all: qualquer rota não registrada cai na página 404.
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFoundView.vue'),
  },
];

export default routes;
```

## App.vue — Seleção de layout

```vue
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@shared/ui/layouts/DefaultLayout.vue';
import EmptyLayout from '@shared/ui/layouts/EmptyLayout.vue';

const route = useRoute();
const currentLayout = computed(() => (route.meta.layout === 'empty' ? EmptyLayout : DefaultLayout));
</script>
```
