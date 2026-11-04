import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, h, type ComponentPublicInstance } from 'vue';
import { consoleReporter, registerErrorHandlers, type ErrorReporter } from '@app/providers/errors';

describe('registerErrorHandlers', () => {
  let unregister: (() => void) | undefined;

  afterEach(() => {
    unregister?.();
    unregister = undefined;
    vi.restoreAllMocks();
  });

  it('envia ao reporter o erro lançado por um componente', () => {
    const report = vi.fn<ErrorReporter>();
    const failure = new Error('falha no setup');
    const Broken = defineComponent({
      name: 'BrokenWidget',
      setup() {
        throw failure;
      },
    });
    const app = createApp({ render: () => h(Broken) });
    unregister = registerErrorHandlers(app, report);

    app.mount(document.createElement('div'));

    expect(report).toHaveBeenCalledWith(
      failure,
      expect.objectContaining({ source: 'vue', component: 'BrokenWidget' })
    );
    app.unmount();
  });

  it('envia ao reporter as promises rejeitadas sem catch', () => {
    const report = vi.fn<ErrorReporter>();
    unregister = registerErrorHandlers(createApp({}), report);
    const reason = new Error('rejeitada');
    const event = new Event('unhandledrejection') as PromiseRejectionEvent;
    Object.defineProperty(event, 'reason', { value: reason });

    window.dispatchEvent(event);

    expect(report).toHaveBeenCalledWith(reason, { source: 'unhandledrejection' });
  });

  it('para de ouvir unhandledrejection depois de removido', () => {
    const report = vi.fn<ErrorReporter>();
    registerErrorHandlers(createApp({}), report)();

    window.dispatchEvent(new Event('unhandledrejection'));

    expect(report).not.toHaveBeenCalled();
  });

  it('o reporter padrão registra no console', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('x');

    consoleReporter(error, { source: 'vue', info: 'setup function' });

    expect(consoleError).toHaveBeenCalledWith('[vue]', 'setup function', error);
  });

  it('o reporter padrão registra sem info quando o erro vem de fora do Vue', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('rejeitada');

    consoleReporter(error, { source: 'unhandledrejection' });

    expect(consoleError).toHaveBeenCalledWith('[unhandledrejection]', '', error);
  });

  it('usa o nome inferido do arquivo para componentes de <script setup>', () => {
    const report = vi.fn<ErrorReporter>();
    const app = createApp({ render: () => h('div') });
    unregister = registerErrorHandlers(app, report);
    // Componentes SFC sem `name` explícito expõem o nome do arquivo em `__name`.
    const instance = { $options: { __name: 'CustomerList' } } as ComponentPublicInstance;

    app.config.errorHandler?.(new Error('x'), instance, 'render function');

    expect(report).toHaveBeenCalledWith(expect.any(Error), {
      source: 'vue',
      info: 'render function',
      component: 'CustomerList',
    });
  });

  it('informa componente indefinido quando o erro não vem de um componente', () => {
    const report = vi.fn<ErrorReporter>();
    const app = createApp({ render: () => h('div') });
    unregister = registerErrorHandlers(app, report);

    app.config.errorHandler?.(new Error('x'), null, 'app errorHandler');

    expect(report).toHaveBeenCalledWith(expect.any(Error), {
      source: 'vue',
      info: 'app errorHandler',
      component: undefined,
    });
  });
});
