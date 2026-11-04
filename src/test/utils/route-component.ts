import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

type LazyComponent = () => Promise<{ default: Component }>;

/**
 * Executa o `import()` lazy de uma rota e devolve o componente carregado,
 * para o teste comparar com a view esperada.
 */
export async function loadRouteComponent(route: RouteRecordRaw | undefined): Promise<Component> {
  const component = route && 'component' in route ? route.component : undefined;
  if (typeof component !== 'function') {
    throw new Error(`A rota ${String(route?.path)} não declara um componente lazy`);
  }
  const loaded = await (component as LazyComponent)();
  return loaded.default;
}
