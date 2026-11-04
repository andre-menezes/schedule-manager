import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import { VApp } from 'vuetify/components';
import OnboardingView from '@modules/showcase/views/OnboardingView.vue';
import { buildOnboardingFaqs, buildOnboardingSteps } from '@modules/showcase/steps';
import { createAppI18n } from '@app/providers/i18n';
import type { ThemeName } from '@typings/theme';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

const { t } = createAppI18n('pt-BR').global;
const steps = buildOnboardingSteps(t);
const faqs = buildOnboardingFaqs(t);

const Empty = defineComponent({ render: () => h('div') });

// O tema da página vem do <v-app>, como no App.vue. A rota Customers vem do
// módulo customers, que o `template:clean` remove.
function mountOnboarding(theme: ThemeName = 'light', withCustomers = true) {
  const routes: RouteRecordRaw[] = [{ path: '/onboarding', component: Empty }];
  if (withCustomers) routes.push({ path: '/customers', name: 'Customers', component: Empty });
  const router = createRouter({ history: createMemoryHistory(), routes });
  const Host = defineComponent({ render: () => h(VApp, { theme }, () => h(OnboardingView)) });
  return mountWithPlugins(Host, { global: { plugins: [router] } });
}

/** Botões "Anterior" e "Próximo" do v-stepper-actions. */
function actions(wrapper: VueWrapper) {
  const [prev, next] = wrapper.findAll('.v-stepper-actions .v-btn');
  if (!prev || !next) throw new Error('O stepper não renderizou as ações');
  return { prev, next };
}

/** Número do passo visível no stepper (pelo data-cy do item ativo). */
function visibleStep(wrapper: VueWrapper): string | undefined {
  return wrapper.get('.v-window-item--active [data-cy^=onboarding-step-]').attributes('data-cy');
}

describe('OnboardingView', () => {
  it('aponta para o exemplo canônico quando o módulo customers existe', () => {
    const section = mountOnboarding().get('#canonical-example');

    expect(section.text()).toContain('Exemplo canônico');
    expect(section.text()).toContain('api/customer.service.ts');
    expect(section.get('[data-cy=onboarding-canonical-link]').attributes('href')).toBe(
      '/customers'
    );
  });

  it('esconde o link do exemplo sem o módulo customers', () => {
    const wrapper = mountOnboarding('light', false);

    expect(wrapper.find('[data-cy=onboarding-canonical-link]').exists()).toBe(false);
  });

  it('mostra os comandos de setup em blocos de código', () => {
    const wrapper = mountOnboarding();
    const setup = wrapper.get('#setup');

    expect(setup.findAll('[data-cy=code-block]')).toHaveLength(4);
    expect(setup.text()).toContain('git clone https://github.com/andre-menezes/vue-template.git');
    expect(setup.text()).toContain('pnpm install');
    expect(setup.text()).toContain('pnpm dev');
    expect(setup.text()).toContain('pnpm test:e2e');
  });

  it('lista todos os passos no cabeçalho do stepper', () => {
    const wrapper = mountOnboarding();
    const titles = wrapper.findAll('.v-stepper-item__title').map((title) => title.text());

    expect(titles).toEqual(steps.map((step) => step.title));
  });

  it('começa no primeiro passo, com o "Anterior" desabilitado', () => {
    const wrapper = mountOnboarding();
    const { prev, next } = actions(wrapper);

    expect(visibleStep(wrapper)).toBe('onboarding-step-1');
    expect(wrapper.get('.v-window-item--active').text()).toContain(`Passo 1 de ${steps.length}`);
    expect(prev.attributes('disabled')).toBeDefined();
    expect(next.attributes('disabled')).toBeUndefined();
  });

  it('avança e volta pelos botões, marcando os passos concluídos', async () => {
    const wrapper = mountOnboarding();

    await actions(wrapper).next.trigger('click');

    expect(visibleStep(wrapper)).toBe('onboarding-step-2');
    expect(wrapper.get('.v-window-item--active').text()).toContain(steps[1]?.title);
    expect(actions(wrapper).prev.attributes('disabled')).toBeUndefined();
    expect(actions(wrapper).next.attributes('disabled')).toBeUndefined();
    expect(wrapper.findAll('.v-stepper-item--complete')).toHaveLength(1);

    await actions(wrapper).prev.trigger('click');

    expect(visibleStep(wrapper)).toBe('onboarding-step-1');
    expect(wrapper.findAll('.v-stepper-item--complete')).toHaveLength(0);
  });

  it('desabilita o "Próximo" no último passo', async () => {
    const wrapper = mountOnboarding();

    for (let step = 1; step < steps.length; step++) {
      await actions(wrapper).next.trigger('click');
    }

    expect(visibleStep(wrapper)).toBe(`onboarding-step-${steps.length}`);
    expect(actions(wrapper).next.attributes('disabled')).toBeDefined();
    expect(actions(wrapper).prev.attributes('disabled')).toBeUndefined();
  });

  it('pula direto para um passo ao clicar no cabeçalho', async () => {
    const wrapper = mountOnboarding();

    await wrapper.findAll('.v-stepper-item')[4]?.trigger('click');

    expect(visibleStep(wrapper)).toBe('onboarding-step-5');
    expect(wrapper.get('.v-window-item--active').text()).toContain(steps[4]?.reference);
  });

  it('mostra o checklist e o FAQ', () => {
    const wrapper = mountOnboarding();

    expect(wrapper.findAll('[data-cy=onboarding-checklist] .v-list-item')).toHaveLength(13);
    expect(wrapper.findAll('[data-cy=onboarding-faq] .v-expansion-panel')).toHaveLength(4);
  });

  it('abre a resposta de uma pergunta do FAQ ao clicar nela', async () => {
    const wrapper = mountOnboarding();
    const firstPanel = wrapper.get('[data-cy=onboarding-faq] .v-expansion-panel');
    expect(firstPanel.text()).not.toContain(faqs[0]?.answer);

    await firstPanel.get('.v-expansion-panel-title').trigger('click');

    expect(firstPanel.get('.v-expansion-panel-text').text()).toBe(faqs[0]?.answer);
  });

  it('adapta as cores do FAQ ao tema', () => {
    const light = mountOnboarding('light');
    const dark = mountOnboarding('dark');
    const firstPanel = (wrapper: VueWrapper) =>
      wrapper.get('[data-cy=onboarding-faq] .v-expansion-panel-title');

    expect(firstPanel(light).classes()).toContain('bg-light-grey');
    expect(firstPanel(light).find('.text-white').exists()).toBe(false);
    expect(firstPanel(dark).classes()).toContain('bg-surface-variant');
    expect(firstPanel(dark).find('.text-white').exists()).toBe(true);
  });
});
