import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { APP_NAME } from '@core/config';

/** Separador entre o título da página e o nome da aplicação. */
const TITLE_SEPARATOR = ' · ';

/**
 * Monta o `document.title`: "<título> · <appName>", ou só o nome da
 * aplicação quando a página não tem título.
 *
 * @example
 * formatDocumentTitle('Início', 'Vue Template') // 'Início · Vue Template'
 */
export function formatDocumentTitle(title: string | undefined, appName: string): string {
  return title ? `${title}${TITLE_SEPARATOR}${appName}` : appName;
}

/**
 * Mantém o `document.title` em sincronia com o `meta.titleKey` da rota
 * atual, traduzido no locale ativo. Reage tanto à navegação quanto à troca de
 * idioma. Deve ser chamado uma vez, na raiz da aplicação (ADR-0036).
 */
export function useRouteTitle(appName: string = APP_NAME): void {
  const route = useRoute();
  const { t, locale } = useI18n();

  watchEffect(() => {
    const key = route.meta.titleKey;
    // Lido explicitamente: a troca de locale refaz o título mesmo se o `t`
    // deixar de rastreá-lo em alguma versão do vue-i18n.
    void locale.value;
    document.title = formatDocumentTitle(key ? t(key) : undefined, appName);
  });
}
