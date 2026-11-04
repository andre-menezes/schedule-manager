import { describe, expect, it } from 'vitest';
import router from '@app/providers/router';
import { createAppI18n } from '@app/providers/i18n';

describe('títulos das rotas', () => {
  const { te } = createAppI18n('pt-BR').global;
  const routes = router.getRoutes();

  it('toda rota registrada declara meta.titleKey', () => {
    const withoutTitle = routes.filter((route) => !route.meta.titleKey).map(({ path }) => path);

    expect(routes.length).toBeGreaterThan(0);
    expect(withoutTitle).toEqual([]);
  });

  it('toda meta.titleKey existe nas mensagens do locale', () => {
    const missing = routes
      .map((route) => route.meta.titleKey)
      .filter((key): key is string => Boolean(key) && !te(key as string));

    expect(missing).toEqual([]);
  });
});
