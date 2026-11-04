import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router';
import customerRoutes from '@modules/customers/routes';

const Stub = defineComponent({ render: () => h('div') });

/**
 * Router em memória com as rotas do módulo, já na rota `path`. As views são
 * trocadas por um stub: o teste monta a view que quer, e a navegação não
 * espera o `import()` lazy de cada rota.
 */
export async function createCustomersRouter(path = '/customers'): Promise<Router> {
  // Todas as rotas do módulo são de view única, então trocar `component` basta.
  const routes = customerRoutes.map((route) => ({ ...route, component: Stub }) as RouteRecordRaw);
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();
  return router;
}
