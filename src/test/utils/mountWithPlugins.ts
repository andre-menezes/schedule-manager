import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { mount, type ComponentMountingOptions } from '@vue/test-utils';
import { createAppVuetify } from '@app/providers/vuetify';
import { createAppI18n } from '@app/providers/i18n';

// Mesmas factories do app: tema, ícones, locale e mensagens não divergem, e
// o locale do Vuetify acompanha o do i18n, como na aplicação.
const i18n = createAppI18n('pt-BR');
const vuetify = createAppVuetify(i18n.global.locale);

/** Cliente novo a cada montagem: sem cache entre testes e sem nova tentativa. */
function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function mountWithPlugins<T>(component: T, options: ComponentMountingOptions<T> = {}) {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [
        createPinia(),
        [VueQueryPlugin, { queryClient: createTestQueryClient() }],
        vuetify,
        i18n,
        ...(options.global?.plugins ?? []),
      ],
    },
  });
}
