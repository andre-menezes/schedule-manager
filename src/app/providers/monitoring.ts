/**
 * Monitoramento de erros com o Sentry (ADR-0043).
 *
 * Opcional: sem `VITE_SENTRY_DSN`, o reporter é o do console e o SDK nem é
 * baixado (import dinâmico, num chunk à parte). Com o DSN, os erros que o
 * `registerErrorHandlers` captura (ADR-0028) vão também para o Sentry.
 *
 * O SDK não registra os próprios handlers: o `errorHandler` do Vue e o
 * `unhandledrejection` continuam com o `registerErrorHandlers`, para cada
 * erro ser enviado uma vez só.
 */
import type { App } from 'vue';
import { SENTRY_DSN } from '@core/config';
import { consoleReporter, type ErrorReporter } from './errors';

type SentrySdk = typeof import('@sentry/vue');

export interface MonitoringOptions {
  dsn: string;
  /** Ambiente no Sentry (o modo do Vite: `development`, `staging`, `production`). */
  environment: string;
  /** Versão do app (do `package.json`). */
  release: string;
}

const defaultOptions: MonitoringOptions = {
  dsn: SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: __APP_META__.version,
};

/**
 * Cria o reporter de erros: o do console e, com DSN, também o Sentry. Se o
 * SDK não carregar (rede, bloqueador), fica só o console.
 */
export async function createErrorReporter(
  app: App,
  options: MonitoringOptions = defaultOptions,
  loadSdk: () => Promise<SentrySdk> = () => import('@sentry/vue')
): Promise<ErrorReporter> {
  if (!options.dsn) {
    return consoleReporter;
  }

  let Sentry: SentrySdk;
  try {
    Sentry = await loadSdk();
  } catch (error) {
    consoleReporter(error, { source: 'vue', info: 'monitoring: falha ao carregar o Sentry' });
    return consoleReporter;
  }

  Sentry.init({
    app,
    dsn: options.dsn,
    environment: options.environment,
    release: options.release,
    // Sem dados do usuário (IP, cookies de sessão) nos eventos.
    dataCollection: { userInfo: false },
    attachErrorHandler: false,
    integrations: (defaults) => defaults.filter(({ name }) => name !== 'GlobalHandlers'),
  });

  return (error, context) => {
    consoleReporter(error, context);
    Sentry.captureException(error, {
      tags: { source: context.source },
      extra: { info: context.info, component: context.component },
    });
  };
}
