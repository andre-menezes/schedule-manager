import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VDataTable } from 'vuetify/components';
import { createAppVuetify } from '@app/providers/vuetify';
import type { SupportedLocale } from '@core/config';
import { mountWithPlugins } from '@test/utils/mountWithPlugins';

/** Chave do próprio Vuetify (não do vue-i18n) para "sem dados". */
const NO_DATA_KEY = '$vuetify.noDataText';

describe('locale do Vuetify', () => {
  it('começa no locale recebido', () => {
    const { locale } = createAppVuetify(ref('en-US'));

    expect(locale.current.value).toBe('en-US');
    expect(locale.t(NO_DATA_KEY)).toBe('No data available');
  });

  it('acompanha a troca do locale recebido', async () => {
    const source = ref<SupportedLocale>('en-US');
    const { locale } = createAppVuetify(source);

    source.value = 'pt-BR';
    await nextTick();

    expect(locale.current.value).toBe('pt-BR');
    expect(locale.t(NO_DATA_KEY)).toBe('Não há dados disponíveis');
  });

  it('sem locale, usa o pt-BR', () => {
    expect(createAppVuetify().locale.current.value).toBe('pt-BR');
  });

  describe('na aplicação', () => {
    afterEach(() => {
      localStorage.clear();
    });

    it('a instância do app segue o setLocale do vue-i18n', async () => {
      vi.resetModules();
      const { setLocale } = await import('@app/providers/i18n');
      const { default: vuetify } = await import('@app/providers/vuetify');
      expect(vuetify.locale.current.value).toBe('pt-BR');

      setLocale('en-US');
      await nextTick();

      expect(vuetify.locale.current.value).toBe('en-US');
    });

    it('os textos internos dos componentes trocam junto com os do app', async () => {
      const Host = defineComponent({
        setup() {
          const { locale } = useI18n({ useScope: 'global' });
          return { locale };
        },
        render() {
          return h(VDataTable, { items: [], headers: [{ title: 'Nome', key: 'name' }] });
        },
      });
      const wrapper = mountWithPlugins(Host);
      expect(wrapper.text()).toContain('Não há dados disponíveis');

      wrapper.vm.locale = 'en-US';
      await nextTick();

      expect(wrapper.text()).toContain('No data available');
      expect(wrapper.text()).toContain('Items per page:');

      wrapper.vm.locale = 'pt-BR';
      await nextTick();
      expect(wrapper.text()).toContain('Não há dados disponíveis');
    });
  });
});
