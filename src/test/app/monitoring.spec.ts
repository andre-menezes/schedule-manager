import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from 'vue';
import { consoleReporter } from '@app/providers/errors';
import { createErrorReporter, type MonitoringOptions } from '@app/providers/monitoring';
import * as Sentry from '@sentry/vue';

// O carregamento padrão (import dinâmico) recebe este SDK falso.
vi.mock('@sentry/vue', () => ({ init: vi.fn(), captureException: vi.fn() }));

const options: MonitoringOptions = {
  dsn: 'https://key@o1.ingest.sentry.io/1',
  environment: 'test',
  release: '1.0.0',
};

/** SDK falso do Sentry: só o que o monitoramento usa. */
function fakeSdk() {
  const sdk = { init: vi.fn(), captureException: vi.fn() };
  return { sdk, load: () => Promise.resolve(sdk as never) };
}

describe('createErrorReporter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sem DSN, usa o reporter do console e não carrega o SDK', async () => {
    const load = vi.fn();

    const reporter = await createErrorReporter(createApp({}), { ...options, dsn: '' }, load);

    expect(reporter).toBe(consoleReporter);
    expect(load).not.toHaveBeenCalled();
  });

  it('com DSN, inicia o Sentry sem os handlers próprios dele', async () => {
    const { sdk, load } = fakeSdk();
    const app = createApp({});

    await createErrorReporter(app, options, load);

    const config = sdk.init.mock.lastCall?.[0] as {
      integrations: (defaults: { name: string }[]) => { name: string }[];
    };
    expect(config).toMatchObject({
      app,
      dsn: options.dsn,
      environment: 'test',
      release: '1.0.0',
      attachErrorHandler: false,
      dataCollection: { userInfo: false },
    });
    expect(config.integrations([{ name: 'GlobalHandlers' }, { name: 'Breadcrumbs' }])).toEqual([
      { name: 'Breadcrumbs' },
    ]);
  });

  it('envia o erro ao Sentry com a origem e continua no console', async () => {
    const { sdk, load } = fakeSdk();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('falhou');

    const reporter = await createErrorReporter(createApp({}), options, load);
    reporter(error, { source: 'vue', info: 'setup function', component: 'CustomersView' });

    expect(sdk.captureException).toHaveBeenCalledWith(error, {
      tags: { source: 'vue' },
      extra: { info: 'setup function', component: 'CustomersView' },
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it('fica só no console se o SDK não carregar', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const reporter = await createErrorReporter(createApp({}), options, () =>
      Promise.reject(new Error('bloqueado'))
    );

    expect(reporter).toBe(consoleReporter);
    expect(consoleError).toHaveBeenCalledWith(
      '[vue]',
      'monitoring: falha ao carregar o Sentry',
      expect.any(Error)
    );
  });

  it('carrega o SDK por import dinâmico por padrão', async () => {
    await createErrorReporter(createApp({}), options);

    expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ dsn: options.dsn }));
  });

  it('usa o DSN do config por padrão (vazio nos testes)', async () => {
    expect(await createErrorReporter(createApp({}))).toBe(consoleReporter);
  });
});
