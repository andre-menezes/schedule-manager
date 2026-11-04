import type { App, ComponentPublicInstance } from 'vue';

/**
 * Tratamento global de erros (ADR-0028).
 *
 * Erros não tratados em componentes, hooks, watchers e handlers do Vue chegam
 * ao `app.config.errorHandler`; promises rejeitadas sem `catch` fora do Vue
 * chegam ao evento `unhandledrejection`. Os dois passam por um único
 * `ErrorReporter`, que hoje só registra no console. Um serviço de
 * monitoramento entra trocando o reporter, sem tocar no resto da aplicação.
 */
export interface ErrorContext {
  source: 'vue' | 'unhandledrejection';
  /** Informação do Vue sobre onde o erro ocorreu (ex.: "setup function"). */
  info?: string;
  /** Nome do componente em que o erro ocorreu, quando houver. */
  component?: string;
}

export type ErrorReporter = (error: unknown, context: ErrorContext) => void;

export const consoleReporter: ErrorReporter = (error, context) => {
  console.error(`[${context.source}]`, context.info ?? '', error);
};

function componentName(instance: ComponentPublicInstance | null): string | undefined {
  return instance?.$options.name ?? instance?.$options.__name;
}

/**
 * Registra os handlers globais. Retorna uma função que remove o listener de
 * `unhandledrejection` (usada nos testes).
 */
export function registerErrorHandlers(app: App, report: ErrorReporter = consoleReporter) {
  app.config.errorHandler = (error, instance, info) => {
    report(error, { source: 'vue', info, component: componentName(instance) });
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    report(event.reason, { source: 'unhandledrejection' });
  };
  window.addEventListener('unhandledrejection', onUnhandledRejection);

  return () => window.removeEventListener('unhandledrejection', onUnhandledRejection);
}
