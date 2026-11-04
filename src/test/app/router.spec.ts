import { describe, expect, it } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import router from '@app/providers/router';

/** Resolve `path` no router do app como a rota normalizada de uma navegação. */
function resolveRoute(path: string): RouteLocationNormalized {
  const { name, ...location } = router.resolve(path);
  // Toda rota tem nome; o catch-all `NotFound` captura os caminhos desconhecidos.
  if (name === null) throw new Error(`Nenhuma rota nomeada para ${path}`);
  return { ...location, name };
}

/** Chama o `scrollBehavior` do router do app indo de `/` para `path`. */
function scrollTo(path: string, savedPosition: { left: number; top: number } | null = null) {
  const { scrollBehavior } = router.options;
  if (!scrollBehavior) throw new Error('O router do app não define scrollBehavior');
  return scrollBehavior(resolveRoute(path), resolveRoute('/'), savedPosition);
}

describe('router', () => {
  it('restaura a posição salva ao voltar ou avançar no histórico', () => {
    const savedPosition = { left: 0, top: 480 };

    expect(scrollTo('/pagina#secao', savedPosition)).toEqual(savedPosition);
  });

  it('rola até o elemento do hash quando a rota tem hash', () => {
    expect(scrollTo('/pagina#secao')).toEqual({ el: '#secao', behavior: 'smooth' });
  });

  it('rola para o topo quando não há posição salva nem hash', () => {
    expect(scrollTo('/pagina')).toEqual({ top: 0, behavior: 'smooth' });
  });

  it('registra só as rotas de app/ e modules/', () => {
    // src/test/fixtures/stray-routes/routes.ts existe, mas fica fora do glob.
    expect(router.hasRoute('StrayFixtureRoute')).toBe(false);
    expect(router.hasRoute('Home')).toBe(true);
    expect(router.hasRoute('NotFound')).toBe(true);
  });
});
