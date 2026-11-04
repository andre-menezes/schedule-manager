import { describe, expect, it } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import router from '@app/providers/router';
import customerRoutes from '@modules/customers/routes';
import CustomerDetailView from '@modules/customers/views/CustomerDetailView.vue';
import CustomerFormView from '@modules/customers/views/CustomerFormView.vue';
import CustomersView from '@modules/customers/views/CustomersView.vue';
import { loadRouteComponent } from '@test/utils/route-component';

const byName = (name: string) => customerRoutes.find((route) => route.name === name);

describe('rotas do módulo customers', () => {
  it('cada rota carrega a view certa sob demanda', async () => {
    expect(await loadRouteComponent(byName('Customers'))).toBe(CustomersView);
    expect(await loadRouteComponent(byName('CustomerCreate'))).toBe(CustomerFormView);
    expect(await loadRouteComponent(byName('CustomerDetail'))).toBe(CustomerDetailView);
    expect(await loadRouteComponent(byName('CustomerEdit'))).toBe(CustomerFormView);
  });

  it('só a listagem entra no menu', () => {
    const inMenu = customerRoutes.filter((route) => route.meta?.nav).map(({ name }) => name);

    expect(inMenu).toEqual(['Customers']);
  });

  it('resolve /customers/new como cadastro e ids numéricos como detalhe e edição', () => {
    expect(router.resolve('/customers/new').name).toBe('CustomerCreate');
    expect(router.resolve('/customers/7').name).toBe('CustomerDetail');
    expect(router.resolve('/customers/7/edit').name).toBe('CustomerEdit');
  });

  it('um id que não é número cai na página 404', () => {
    expect(router.resolve('/customers/abc').name).toBe('NotFound');
  });

  it('entrega o id da URL às views como número', () => {
    const route = { params: { id: '7' } } as unknown as RouteLocationNormalized;
    const props = byName('CustomerDetail')?.props;

    expect(typeof props === 'function' ? props(route) : undefined).toEqual({ id: 7 });
  });
});
