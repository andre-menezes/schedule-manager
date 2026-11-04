/**
 * config/index.ts
 *
 * Application-wide constants and environment helpers.
 * All `import.meta.env` accesses are centralised here so the rest
 * of the codebase never references env variables directly.
 */

/**
 * Lê uma variável de ambiente; sem valor nem padrão, falha na inicialização
 * em vez de seguir com configuração incompleta. Exportada para teste.
 */
export const getEnvVar = (key: keyof AppEnv, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[Config Error]: A variável de ambiente ${key} não foi definida.`);
  }
  return value;
};

// Todas têm valor padrão: a aplicação roda sem nenhum arquivo `.env`.
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', '/api');
export const APP_NAME = getEnvVar('VITE_APP_NAME', 'Vue Template');

/**
 * Locales suportados. O primeiro (pt-BR) é o locale base: dele derivam o
 * schema das mensagens e o fallback. Cada um precisa de `locales/<locale>.json`
 * no app e em todo módulo com mensagens (ADR-0038).
 */
export const SUPPORTED_LOCALES = ['pt-BR', 'en-US'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Nome de cada locale no próprio idioma, como o seletor de idioma o exibe.
 * Não é traduzido: quem procura o próprio idioma o reconhece em qualquer tela.
 */
export const LOCALE_NATIVE_NAMES: Record<SupportedLocale, string> = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
};

export const isSupportedLocale = (value: string | null): value is SupportedLocale =>
  SUPPORTED_LOCALES.some((locale) => locale === value);

/**
 * Valida o locale padrão contra `SUPPORTED_LOCALES`; um valor fora da lista
 * falha na inicialização, como `getEnvVar` faz com variável ausente.
 * Exportada para teste.
 */
export const parseDefaultLocale = (value: string): SupportedLocale => {
  if (!isSupportedLocale(value)) {
    throw new Error(
      `[Config Error]: VITE_APP_DEFAULT_LOCALE="${value}" não está entre os locales suportados (${SUPPORTED_LOCALES.join(', ')}).`
    );
  }
  return value;
};

export const DEFAULT_LOCALE = parseDefaultLocale(getEnvVar('VITE_APP_DEFAULT_LOCALE', 'pt-BR'));

/** localStorage keys (apenas preferências de UX). */
export const STORAGE_KEYS = {
  LOCALE: 'app_locale',
  THEME: 'app_theme',
} as const;

/**
 * `id` do `<main>` dos layouts: alvo do link "Pular para o conteúdo" e do
 * foco movido após cada navegação (ADR-0036).
 */
export const MAIN_CONTENT_ID = 'main-content';

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * DSN do Sentry. Opcional: vazio deixa o monitoramento desligado e os erros
 * só no console (ADR-0043).
 */
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

/** timeouts */
export const HTTP_TIMEOUT_MS = 10_000;
