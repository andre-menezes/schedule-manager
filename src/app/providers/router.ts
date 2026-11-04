import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Só `app/` e `modules/` declaram rotas; um `routes.ts` em outra pasta (como
// um helper em `src/test/`) não deve virar rota do app.
const modules = import.meta.glob('@/{app,modules}/**/routes.ts', { eager: true });

const routes = [
  ...Object.values(modules as Record<string, { default: RouteRecordRaw[] }>).flatMap(
    (module) => module.default
  ),
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
