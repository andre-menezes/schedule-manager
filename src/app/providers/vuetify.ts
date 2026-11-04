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
import type { AppThemeDefinition, EventHue } from '@typings/theme';

/**
 * Textos internos do Vuetify (paginação, tabela, "sem dados"...) por locale
 * suportado, indexados pelo mesmo código do vue-i18n. Um locale novo sem
 * entrada aqui não compila (ADR-0038).
 */
const vuetifyMessages: Record<SupportedLocale, LocaleMessages> = {
  'pt-BR': pt,
  'en-US': en,
};

/**
 * Cores de evento do calendário, por matiz: `event-<matiz>` para borda e
 * destaque, `event-<matiz>-bg` para o fundo do bloco e
 * `on-event-<matiz>-bg` para o texto sobre ele (ADR-0044).
 */
type EventTone = readonly [event: string, background: string, text: string];

function eventColors(tones: Record<EventHue, EventTone>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tones).flatMap(([hue, [event, background, text]]) => [
      [`event-${hue}`, event],
      [`event-${hue}-bg`, background],
      [`on-event-${hue}-bg`, text],
    ])
  );
}

const lightTheme: AppThemeDefinition = {
  dark: false,
  colors: {
    primary: '#4162D9',
    secondary: '#0A7F7A',
    accent: '#0A7F7A',
    background: '#F4F7FB',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#E8EBF0',
    border: '#D4D8DE',

    error: '#C42D31',
    warning: '#996105',
    info: '#0676AE',
    success: '#05844B',

    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-warning': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',

    'primary-container': '#E3EBFF',
    'on-primary-container': '#263C8D',
    // Fundos tonais de status: tokens `<tom>/container` do Figma Schedule
    // Manager, usados pelo `BaseStatusChip` (ADR-0045, ADR-0057).
    'success-container': '#CCF8DA',
    'on-success-container': '#00532D',
    'warning-container': '#FFE7CC',
    'on-warning-container': '#613C02',
    'error-container': '#FFE4E1',
    'on-error-container': '#7E181B',
    'info-container': '#D9EFFF',
    'on-info-container': '#024A6F',
    'neutral-container': '#E8EBF0',
    'on-neutral-container': '#1D1F23',
    'primary-variant': '#E3EBFF',
    'secondary-variant': '#C4F7F3',
    'accent-variant': '#C4F7F3',
    'on-accent-variant': '#01504D',
    'surface-variant': '#E8EBF0',
    'error-variant': '#FFE4E1',
    'warning-variant': '#FFE7CC',
    'info-variant': '#D9EFFF',
    'success-variant': '#CCF8DA',
    'light-grey': '#E8EBF0',

    // Tons para texto: as cores base já passam no contraste AA (4,5:1) como
    // texto sobre a superfície (só `success` fica abaixo sobre o fundo, em
    // 4,4:1). Os tons `-text`, mais escuros, passam com folga nos dois:
    // prefira `text-<cor>-text` em texto e a cor base em fundos e botões.
    'primary-text': '#3450B5',
    'secondary-text': '#046965',
    'accent-text': '#046965',
    'info-text': '#036190',
    'success-text': '#056D3D',
    'warning-text': '#7E4F03',

    ...eventColors({
      indigo: ['#567BF5', '#E3EBFF', '#263C8D'],
      teal: ['#0C9A94', '#C4F7F3', '#01504D'],
      violet: ['#976ADB', '#EEE7FE', '#50317C'],
      pink: ['#C95893', '#FEE2EE', '#70244E'],
      orange: ['#CF6310', '#FEE6D9', '#6E3101'],
      amber: ['#B87504', '#FFE7CC', '#613C02'],
      green: ['#269E5F', '#CCF8DA', '#00532D'],
      sky: ['#0A8FD1', '#D9EFFF', '#024A6F'],
    }),
  },
  variables: {
    // O padrão (0.6) deixa subtítulos com contraste 4,2:1 sobre o fundo.
    'medium-emphasis-opacity': 0.7,
  },
};

const darkTheme: AppThemeDefinition = {
  dark: true,
  colors: {
    primary: '#7A9CFE',
    secondary: '#44B6AF',
    accent: '#44B6AF',
    background: '#111316',
    surface: '#1D1F23',
    'surface-bright': '#2E3035',
    'surface-light': '#2E3035',
    border: '#41454C',

    error: '#F4756E',
    warning: '#D3923F',
    info: '#54ABE3',
    success: '#5FB781',

    // No escuro as cores base são claras: o conteúdo sobre elas é escuro.
    'on-primary': '#0E1A48',
    'on-secondary': '#012523',
    'on-error': '#3F0608',
    'on-warning': '#2E1A00',
    'on-info': '#002236',
    'on-success': '#002712',

    'primary-container': '#192967',
    'on-primary-container': '#E3EBFF',
    'success-container': '#003B1E',
    'on-success-container': '#CCF8DA',
    'warning-container': '#452901',
    'on-warning-container': '#FFE7CC',
    'error-container': '#5C0E10',
    'on-error-container': '#FFE4E1',
    'info-container': '#013450',
    'on-info-container': '#D9EFFF',
    'neutral-container': '#2E3035',
    'on-neutral-container': '#F4F7FB',
    'primary-variant': '#192967',
    'secondary-variant': '#003936',
    'accent-variant': '#003936',
    'on-accent-variant': '#C4F7F3',
    'surface-variant': '#2E3035',
    'error-variant': '#5C0E10',
    'warning-variant': '#452901',
    'info-variant': '#013450',
    'success-variant': '#003B1E',
    'light-grey': '#2E3035',

    // No tema escuro as cores base já passam como texto; os tons `-text`,
    // mais claros, dão folga extra sobre o fundo e a superfície.
    'primary-text': '#A2BCFE',
    'secondary-text': '#7BCFC9',
    'accent-text': '#7BCFC9',
    'info-text': '#83C6F5',
    'success-text': '#8BD0A3',
    'warning-text': '#E8B274',

    ...eventColors({
      indigo: ['#7A9CFE', '#192967', '#E3EBFF'],
      teal: ['#44B6AF', '#003936', '#C4F7F3'],
      violet: ['#AF8CEC', '#39215A', '#EEE7FE'],
      pink: ['#DF7DAD', '#511737', '#FEE2EE'],
      orange: ['#E38750', '#4F2100', '#FEE6D9'],
      amber: ['#D3923F', '#452901', '#FFE7CC'],
      green: ['#5FB781', '#003B1E', '#CCF8DA'],
      sky: ['#54ABE3', '#013450', '#D9EFFF'],
    }),
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
/**
 * Padrões dos componentes do Vuetify pelo design system Agenda (ADR-0045):
 * raio de 4px, borda de 1px no lugar de sombra e sombra só no que flutua
 * (menus e diálogos, com raio de 8px). Campos em contorno, botões sem
 * elevação. Uma prop explícita no componente continua prevalecendo.
 */
export const componentDefaults = {
  VBtn: { variant: 'flat' },
  VCard: { elevation: 0, border: true },
  VAlert: { variant: 'tonal' },
  VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  VCheckbox: { color: 'primary' },
  VSwitch: { color: 'primary', inset: true },
  VMenu: { VList: { rounded: 'lg', elevation: 2 } },
  VDialog: { VCard: { rounded: 'lg', elevation: 3, border: false } },
};

export function createAppVuetify(locale: Readonly<Ref<SupportedLocale>> = ref('pt-BR')) {
  const vuetify = createVuetify({
    defaults: componentDefaults,
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
