/**
 * src/app/providers/i18n.ts
 *
 * Vue i18n configuration.
 *
 * Design decisions:
 * ─ `legacy: false`   — Use Composition API mode exclusively (t() via useI18n()).
 * ─ `globalInjection: true` — Makes $t available in templates without useI18n().
 * ─ Locale is restored from localStorage on boot (STORAGE_KEYS.LOCALE).
 * ─ Falls back to DEFAULT_LOCALE from app config (validated at boot).
 * ─ The <html lang> attribute follows the active locale from boot.
 * ─ Every locale change (setLocale or `useI18n().locale` in a component) is
 *   persisted and reflected on <html lang> by a watcher on the global locale.
 * ─ `fallbackLocale: 'pt-BR'` — the base locale; a missing translation shows
 *   the pt-BR text instead of the key.
 * ─ `missingWarn: false` in production to suppress console noise.
 *
 * @see https://vue-i18n.intlify.dev/
 */
import { watch } from 'vue';
import { createI18n } from 'vue-i18n';
import {
  DEFAULT_LOCALE,
  STORAGE_KEYS,
  isSupportedLocale,
  type SupportedLocale,
} from '@core/config';
import { localeMessages, type MessageSchema } from './messages';

export type { MessageSchema };

/** Resolves the initial locale in priority order:
 *  1. User's persisted preference (localStorage)
 *  2. App default from config (DEFAULT_LOCALE, already validated against
 *     SUPPORTED_LOCALES in @core/config)
 */
function resolveInitialLocale(): SupportedLocale {
  const persisted = localStorage.getItem(STORAGE_KEYS.LOCALE);
  return isSupportedLocale(persisted) ? persisted : DEFAULT_LOCALE;
}

const initialLocale = resolveInitialLocale();

/**
 * Creates the app's i18n instance. Exported so tests mount components with
 * the same messages and options as the app.
 */
export function createAppI18n(locale: SupportedLocale = 'pt-BR') {
  return createI18n<[MessageSchema], SupportedLocale, false>({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: 'pt-BR',
    messages: localeMessages,
    // Silence missing-key warnings in production using import.meta.env.DEV
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
  });
}

const i18n = createAppI18n(initialLocale);

document.documentElement.setAttribute('lang', initialLocale);

/**
 * Persiste cada troca de locale e atualiza o <html lang>. Fica num watch, e
 * não só no `setLocale`, porque o seletor de idioma (em `shared/`, que não
 * importa de `app/`) troca o locale pelo `useI18n()`. `flush: 'sync'` aplica
 * a troca no mesmo instante, sem esperar o próximo tick.
 */
watch(
  i18n.global.locale,
  (locale) => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    document.documentElement.setAttribute('lang', locale);
  },
  { flush: 'sync' }
);

export default i18n;

/**
 * Changes the active locale; the watcher above persists the choice and
 * updates <html lang>.
 *
 * @example
 * setLocale('en-US')
 */
export function setLocale(locale: SupportedLocale): void {
  i18n.global.locale.value = locale;
}
