import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    // Catch-all: qualquer rota não registrada cai na página 404.
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFoundView.vue'),
    meta: { titleKey: 'pageTitle.notFound' },
  },
];

export default routes;
