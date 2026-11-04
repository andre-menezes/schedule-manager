import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VDataTable } from 'vuetify/components';
import { componentDefaults, createAppVuetify } from '@app/providers/vuetify';
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

/** Contraste WCAG 2.1 entre duas cores `#RRGGBB`. */
function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const [r = 0, g = 0, bl = 0] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

describe('tema do design system Agenda', () => {
  const themes = createAppVuetify().theme.themes.value;
  const light: Record<string, unknown> = { ...themes.light?.colors };
  const dark: Record<string, unknown> = { ...themes.dark?.colors };
  const hues = ['indigo', 'teal', 'violet', 'pink', 'orange', 'amber', 'green', 'sky'];
  const textTones = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];

  it('os dois temas definem os mesmos nomes de cor', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it.each(['light', 'dark'] as const)(
    'tem as três cores de evento por matiz no tema %s',
    (name) => {
      const colors = name === 'light' ? light : dark;

      for (const hue of hues) {
        for (const key of [`event-${hue}`, `event-${hue}-bg`, `on-event-${hue}-bg`]) {
          expect(colors[key], key).toMatch(/^#[0-9A-F]{6}$/);
        }
        expect(
          contrast(String(colors[`on-event-${hue}-bg`]), String(colors[`event-${hue}-bg`])),
          hue
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  );

  it.each(['light', 'dark'] as const)('os tons -text passam no AA no tema %s', (name) => {
    const colors = name === 'light' ? light : dark;

    for (const tone of textTones) {
      for (const base of ['background', 'surface']) {
        expect(
          contrast(String(colors[`${tone}-text`]), String(colors[base])),
          `${tone}-text sobre ${base}`
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it.each(['light', 'dark'] as const)(
    'o texto dos chips de status passa no AA no tema %s',
    (name) => {
      const colors = name === 'light' ? light : dark;

      for (const tone of ['success', 'warning', 'error', 'info', 'neutral']) {
        expect(
          contrast(String(colors[`on-${tone}-container`]), String(colors[`${tone}-container`])),
          tone
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  );
});

describe('padrões dos componentes (ADR-0045)', () => {
  it('são os da instância do Vuetify', () => {
    const vuetify = createAppVuetify();

    expect(vuetify.defaults.value).toMatchObject(componentDefaults);
  });

  it('campos em contorno, botões sem elevação e sombra só no que flutua', () => {
    expect(componentDefaults.VTextField.variant).toBe('outlined');
    expect(componentDefaults.VBtn.variant).toBe('flat');
    expect(componentDefaults.VCard).toEqual({ elevation: 0, border: true });
    expect(componentDefaults.VDialog.VCard).toMatchObject({ rounded: 'lg', elevation: 3 });
  });
});
