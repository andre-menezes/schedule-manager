import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue'),
    meta: {
      titleKey: 'pageTitle.home',
      nav: { titleKey: 'nav.home', icon: 'home', order: 10 },
    },
  },
];

export default routes;
