import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';
import routes from '@modules/showcase/routes';
import ArchitectureView from '@modules/showcase/views/ArchitectureView.vue';
import ComponentsView from '@modules/showcase/views/ComponentsView.vue';
import ConventionsView from '@modules/showcase/views/ConventionsView.vue';
import DecisionsView from '@modules/showcase/views/DecisionsView.vue';
import DocsHomeView from '@modules/showcase/views/DocsHomeView.vue';
import OnboardingView from '@modules/showcase/views/OnboardingView.vue';
import { createAppI18n } from '@app/providers/i18n';
import { loadRouteComponent } from '@test/utils/route-component';

const expected: { name: string; path: string; view: Component }[] = [
  { name: 'DocsHome', path: '/docs', view: DocsHomeView },
  { name: 'Architecture', path: '/arquitetura', view: ArchitectureView },
  { name: 'Onboarding', path: '/onboarding', view: OnboardingView },
  { name: 'Components', path: '/componentes', view: ComponentsView },
  { name: 'Conventions', path: '/convencoes', view: ConventionsView },
  { name: 'Decisions', path: '/decisoes', view: DecisionsView },
];

describe('rotas do módulo showcase', () => {
  it('registra as telas de documentação nos caminhos esperados', () => {
    expect(routes.map(({ name, path }) => ({ name, path }))).toEqual(
      expected.map(({ name, path }) => ({ name, path }))
    );
  });

  it.each(expected)('a rota $name carrega a view certa sob demanda', async ({ name, view }) => {
    const route = routes.find((candidate) => candidate.name === name);

    expect(await loadRouteComponent(route)).toBe(view);
  });

  it('todas entram no menu depois da Home, em ordem crescente e sem repetir', () => {
    const orders = routes.map((route) => route.meta?.nav?.order ?? 0);

    expect(orders.every((order) => order > 10)).toBe(true);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('o rótulo de menu de cada rota existe nas mensagens do locale', () => {
    const { te } = createAppI18n('pt-BR').global;
    const missing = routes
      .map((route) => route.meta?.nav?.titleKey ?? `sem nav: ${String(route.name)}`)
      .filter((key) => !te(key));

    expect(missing).toEqual([]);
  });
});
