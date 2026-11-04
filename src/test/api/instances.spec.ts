import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ofetch, type FetchOptions } from 'ofetch';
import { API_BASE_URL, HTTP_TIMEOUT_MS } from '@core/config';
import { httpClient } from '@shared/api/instances';

interface FakeInstance {
  options: FetchOptions;
  fetch: Mock;
  raw: Mock;
}

const { instances } = vi.hoisted(() => ({
  instances: new Map<string, FakeInstance>(),
}));

// Captura cada `ofetch.create` (uma instância por base URL) sem rede real.
vi.mock('ofetch', () => ({
  ofetch: {
    create: vi.fn((options: FetchOptions) => {
      const raw = vi.fn();
      const fetch = Object.assign(vi.fn().mockResolvedValue({ ok: true }), { raw });
      instances.set(options.baseURL as string, { options, fetch, raw });
      return fetch;
    }),
  },
}));

function instanceFor(baseURL: string): FakeInstance {
  const instance = instances.get(baseURL);
  if (!instance) throw new Error(`Instância não criada para ${baseURL}`);
  return instance;
}

/** Opções recebidas pelo ofetch na última chamada da instância. */
function lastCallOptions(mock: Mock): FetchOptions {
  return mock.mock.lastCall?.[1] as FetchOptions;
}

describe('instâncias HTTP', () => {
  beforeEach(() => {
    instances.forEach(({ fetch, raw }) => {
      fetch.mockClear();
      raw.mockReset();
    });
  });

  it('cria uma única instância do ofetch por base URL, reutilizada nas chamadas', async () => {
    const created = vi.mocked(ofetch.create).mock.calls.length;

    await httpClient.get('/clientes');
    await httpClient.post('/clientes', { body: { nome: 'Ana' } });
    await httpClient.delete('/clientes/1');

    expect(vi.mocked(ofetch.create).mock.calls.length).toBe(created);
    expect([...instances.keys()]).toEqual([API_BASE_URL]);
    expect(instanceFor(API_BASE_URL).fetch).toHaveBeenCalledTimes(3);
  });

  it('repassa método, query e headers da chamada, com o timeout padrão', async () => {
    interface ClienteFiltro {
      nome?: string;
      pagina: number;
    }
    const query: ClienteFiltro = { nome: 'Ana', pagina: 2 };

    await httpClient.get<unknown, ClienteFiltro>('/clientes', {
      query,
      headers: { 'Accept-Language': 'pt-BR' },
    });

    const { fetch } = instanceFor(API_BASE_URL);
    expect(fetch).toHaveBeenCalledWith('/clientes', {
      method: 'GET',
      query,
      body: undefined,
      headers: { 'Accept-Language': 'pt-BR' },
      timeout: HTTP_TIMEOUT_MS,
    });
  });

  it('envia o corpo nas requisições mutantes', async () => {
    await httpClient.put('/clientes/1', { body: { nome: 'Ana' } });

    expect(lastCallOptions(instanceFor(API_BASE_URL).fetch)).toMatchObject({
      method: 'PUT',
      body: { nome: 'Ana' },
    });
  });

  it('combina o signal da chamada com o timeout (cancelar a chamada aborta a requisição)', async () => {
    const controller = new AbortController();

    await httpClient.get('/clientes', { signal: controller.signal });

    const options = lastCallOptions(instanceFor(API_BASE_URL).fetch);
    expect(options.timeout).toBeUndefined();
    expect(options.signal?.aborted).toBe(false);

    controller.abort();
    expect(options.signal?.aborted).toBe(true);
  });

  it('repassa só o signal da chamada quando o navegador não tem AbortSignal.any', async () => {
    const original = Object.getOwnPropertyDescriptor(AbortSignal, 'any');
    Object.defineProperty(AbortSignal, 'any', { value: undefined, configurable: true });
    const controller = new AbortController();

    try {
      await httpClient.get('/clientes', { signal: controller.signal });
    } finally {
      if (original) Object.defineProperty(AbortSignal, 'any', original);
    }

    const options = lastCallOptions(instanceFor(API_BASE_URL).fetch);
    expect(options.signal).toBe(controller.signal);
    expect(options.timeout).toBeUndefined();
  });

  it('envia PATCH com o corpo parcial', async () => {
    await httpClient.patch('/clientes/1', { body: { ativo: false } });

    expect(lastCallOptions(instanceFor(API_BASE_URL).fetch)).toMatchObject({
      method: 'PATCH',
      body: { ativo: false },
      timeout: HTTP_TIMEOUT_MS,
    });
  });

  it('baixa arquivo devolvendo o blob e o Content-Disposition', async () => {
    const blob = new Blob(['pdf']);
    instanceFor(API_BASE_URL).raw.mockResolvedValue({
      _data: blob,
      headers: new Headers({ 'content-disposition': 'attachment; filename="r.pdf"' }),
    });

    const result = await httpClient.download('/reports/1/pdf', { query: { versao: 2 } });

    expect(result).toEqual({ blob, contentDisposition: 'attachment; filename="r.pdf"' });
    expect(lastCallOptions(instanceFor(API_BASE_URL).raw)).toMatchObject({
      method: 'GET',
      query: { versao: 2 },
      responseType: 'blob',
    });
  });

  it('falha o download quando a resposta não traz conteúdo binário', async () => {
    instanceFor(API_BASE_URL).raw.mockResolvedValue({ _data: undefined, headers: new Headers() });

    await expect(httpClient.download('/reports/1/pdf')).rejects.toThrow(
      'Download sem conteúdo binário'
    );
  });

  it('envia arquivos em multipart por POST, sem fixar o Content-Type', async () => {
    const file = new File(['pdf'], 'contrato.pdf', { type: 'application/pdf' });

    await httpClient.upload('/reports/1/attachments', {
      fields: { file, description: 'Contrato' },
      query: { versao: 2 },
    });

    const options = lastCallOptions(instanceFor(API_BASE_URL).fetch);
    expect(options).toMatchObject({ method: 'POST', query: { versao: 2 } });
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('description')).toBe('Contrato');
    expect(options.headers).toBeUndefined();
  });
});
