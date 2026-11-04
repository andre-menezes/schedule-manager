/**
 * src/app/providers/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@fontsource-variable/inter';
import 'vuetify/styles';
import '@app/styles/icons.scss';
import '@app/styles/main.scss';

import { ref, watch, type Ref } from 'vue';
import { createVuetify, type LocaleMessages } from 'vuetify';
import { en, pt } from 'vuetify/locale';
import type { SupportedLocale } from '@core/config';
import { aliases, ms } from './icons';
import i18n from './i18n';
import type { AppThemeDefinition } from '@typings/theme';

/**
 * Textos internos do Vuetify (paginação, tabela, "sem dados"...) por locale
 * suportado, indexados pelo mesmo código do vue-i18n. Um locale novo sem
 * entrada aqui não compila (ADR-0038).
 */
const vuetifyMessages: Record<SupportedLocale, LocaleMessages> = {
  'pt-BR': pt,
  'en-US': en,
};

const palette = {
  primary: '#FF8066',
  secondary: '#6D8CFF',

  'primary-variant': '#ff80661a',
  'secondary-variant': '#6d8cff1a',
  'light-grey': '#f1f1f16c',
};

const lightTheme: AppThemeDefinition = {
  dark: false,
  colors: {
    ...palette,

    background: '#F4F7FB',
    surface: '#FFFFFF',

    accent: '#00B8A9',
    error: '#C1121F',
    warning: '#F4A261',
    info: '#1677FF',
    success: '#168A63',

    'accent-variant': '#00b8a905',
    'on-accent-variant': '#000000',
    'surface-variant': '#E7ECF31a',
    'error-variant': '#c1121f1a',
    'warning-variant': '#f4a2611a',
    'info-variant': '#1677ff1a',
    'success-variant': '#168a631a',

    // Tons para texto: a paleta da marca não atinge o contraste AA (4,5:1)
    // como cor de texto sobre o fundo claro. Use `text-<cor>-text` em texto e
    // a cor da marca em fundos, bordas e botões.
    'primary-text': '#D92500',
    'secondary-text': '#325EFF',
    'accent-text': '#007D73',
    'info-text': '#005FE3',
    'success-text': '#147F5B',
    'warning-text': '#B2560C',
  },
  variables: {
    // O padrão (0.6) deixa subtítulos com contraste 4,2:1 sobre o fundo.
    'medium-emphasis-opacity': 0.7,
  },
};

const darkTheme: AppThemeDefinition = {
  dark: true,
  colors: {
    ...palette,

    background: '#080D1C',
    surface: '#111A31',

    accent: '#42E8D3',
    error: '#FF6B6B',
    warning: '#FFD166',
    info: '#73A9FF',
    success: '#62D5A5',

    'accent-variant': '#42e8d31a',
    'on-accent-variant': '#FFFFFF',
    'surface-variant': '#1C2945',
    'error-variant': '#ff6b6b1a',
    'warning-variant': '#ffd1661a',
    'info-variant': '#73a9ff1a',
    'success-variant': '#62d5a51a',

    // No tema escuro a própria paleta já tem contraste suficiente como texto.
    'primary-text': '#FF8066',
    'secondary-text': '#6D8CFF',
    'accent-text': '#42E8D3',
    'info-text': '#73A9FF',
    'success-text': '#62D5A5',
    'warning-text': '#FFD166',
  },
};

/**
 * Cria a instância do Vuetify da aplicação. Exportada para que os testes
 * montem componentes com o mesmo tema, ícones e locale.
 *
 * O locale do Vuetify segue o `locale` recebido (na aplicação, o do
 * vue-i18n): os textos internos dos componentes trocam junto com os da
 * aplicação. O adapter oficial (`createVueI18nAdapter`) não serve aqui, pois
 * passaria as mensagens do Vuetify, cruas, ao vue-i18n, que roda sem o
 * compilador de mensagens (ADR-0023).
 *
 * https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
 */
export function createAppVuetify(locale: Readonly<Ref<SupportedLocale>> = ref('pt-BR')) {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'ms',
      aliases,
      sets: {
        ms,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    locale: {
      locale: locale.value,
      fallback: 'pt-BR',
      messages: vuetifyMessages,
    },
  });

  watch(locale, (next) => {
    vuetify.locale.current.value = next;
  });

  return vuetify;
}

export default createAppVuetify(i18n.global.locale);
