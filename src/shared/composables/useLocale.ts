import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SupportedLocale } from '@core/config';

/**
 * Locale ativo da aplicação e a troca dele, para componentes. Altera o
 * locale global do vue-i18n; o provider de i18n persiste a escolha
 * (STORAGE_KEYS.LOCALE) e atualiza o <html lang>, e o Vuetify, o título da
 * aba e os textos acompanham a troca (ADR-0038).
 *
 * @example
 * const { locale, setLocale } = useLocale();
 * setLocale('en-US');
 */
export function useLocale() {
  // Só o locale interessa aqui: o schema das mensagens fica em `app/` e não é
  // necessário para tipá-lo.
  const { locale: i18nLocale } = useI18n<object, SupportedLocale>({ useScope: 'global' });

  const locale = computed(() => i18nLocale.value);

  function setLocale(next: SupportedLocale): void {
    i18nLocale.value = next;
  }

  return { locale, setLocale };
}
