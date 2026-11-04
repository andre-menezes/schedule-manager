import type { RouteRecordRaw } from 'vue-router';

/**
 * Fixture: um `routes.ts` fora de `app/` e `modules/`. O router do app não
 * deve registrá-lo (ver router.spec.ts).
 */
export default [
  {
    path: '/rota-fora-dos-modulos',
    name: 'StrayFixtureRoute',
    component: () => import('@app/views/NotFoundView.vue'),
  },
] satisfies RouteRecordRaw[];
