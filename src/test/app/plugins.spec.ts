import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { getActivePinia } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { useQueryClient } from '@tanstack/vue-query';
import { registerPlugins } from '@app/providers/plugins';
import pinia from '@app/providers/pinia';
import router from '@app/providers/router';
import { queryPluginOptions } from '@app/providers/query';

describe('registerPlugins', () => {
  it('registra no app as instâncias de Pinia, TanStack Query, i18n, router e Vuetify', () => {
    const injected: Record<string, unknown> = {};
    const Probe = defineComponent({
      setup() {
        injected.router = useRouter();
        injected.queryClient = useQueryClient();
        injected.translated = useI18n().t('nav.home');
        injected.theme = useTheme().global.name.value;
        return () => h('div');
      },
    });
    const app = createApp(Probe);

    registerPlugins(app);
    app.mount(document.createElement('div'));

    expect(getActivePinia()).toBe(pinia);
    expect(injected.router).toBe(router);
    expect(injected.queryClient).toBe(
      'queryClient' in queryPluginOptions ? queryPluginOptions.queryClient : undefined
    );
    expect(injected.queryClient).toBeDefined();
    expect(injected.translated).toBe('Início');
    expect(injected.theme).toBe('light');

    app.unmount();
  });
});
