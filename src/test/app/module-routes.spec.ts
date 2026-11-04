import { describe, expect, it } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import appRoutes from '@app/routes';
import homeRoutes from '@modules/home/routes';
import router from '@app/providers/router';
import NotFoundView from '@app/views/NotFoundView.vue';
import HomeView from '@modules/home/views/HomeView.vue';
import { loadRouteComponent } from '@test/utils/route-component';

describe('rotas de app', () => {
  it('a rota NotFound carrega a NotFoundView sob demanda', async () => {
    const [notFound] = appRoutes;

    expect(notFound?.name).toBe('NotFound');
    expect(await loadRouteComponent(notFound)).toBe(NotFoundView);
  });

  it('caminhos desconhecidos caem na rota NotFound, sem entrar no menu', () => {
    const resolved = router.resolve('/caminho/que/nao/existe');

    expect(resolved.name).toBe('NotFound');
    expect(resolved.meta.nav).toBeUndefined();
  });
});

describe('rotas do módulo home', () => {
  const [home]: (RouteRecordRaw | undefined)[] = homeRoutes;

  it('a rota Home fica na raiz e carrega a HomeView sob demanda', async () => {
    expect(home?.path).toBe('/');
    expect(home?.name).toBe('Home');
    expect(await loadRouteComponent(home)).toBe(HomeView);
  });

  it('a rota Home é o primeiro item do menu', () => {
    const orders = router
      .getRoutes()
      .flatMap(({ meta }) => (meta.nav ? [meta.nav.order] : []))
      .sort((a, b) => a - b);

    expect(home?.meta?.nav).toEqual({ titleKey: 'nav.home', icon: 'home', order: 10 });
    expect(orders[0]).toBe(home?.meta?.nav?.order);
  });
});
