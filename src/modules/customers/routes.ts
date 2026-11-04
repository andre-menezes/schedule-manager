import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

/**
 * CRUD de clientes, o exemplo canônico do template: listagem paginada,
 * detalhe, cadastro, edição e exclusão. Removido por `pnpm template:clean`.
 *
 * O `:id(\\d+)` só aceita números: `/customers/abc` cai na página 404. As
 * views recebem o id como prop numérica, sem ler `route.params`.
 */
const toIdProp = ({ params }: RouteLocationNormalized) => ({ id: Number(params.id) });

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
    path: '/customers/new',
    name: 'CustomerCreate',
    component: () => import('./views/CustomerFormView.vue'),
    meta: { titleKey: 'pageTitle.customerCreate' },
  },
  {
    path: '/customers/:id(\\d+)',
    name: 'CustomerDetail',
    component: () => import('./views/CustomerDetailView.vue'),
    props: toIdProp,
    meta: { titleKey: 'pageTitle.customerDetail' },
  },
  {
    path: '/customers/:id(\\d+)/edit',
    name: 'CustomerEdit',
    component: () => import('./views/CustomerFormView.vue'),
    props: toIdProp,
    meta: { titleKey: 'pageTitle.customerEdit' },
  },
];

export default routes;
