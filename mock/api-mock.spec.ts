import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { describe, expect, it, vi } from 'vitest';
import { apiMock, createMockMiddleware, matchPath, problem, type MockHandler } from './api-mock.ts';

/** Requisição falsa: um stream com o corpo, o método e a URL. */
function fakeRequest(method: string, url: string, body?: string): IncomingMessage {
  return Object.assign(Readable.from(body === undefined ? [] : [body]), {
    method,
    url,
  }) as unknown as IncomingMessage;
}

/** Resposta falsa que guarda status, cabeçalhos e corpo. */
function fakeResponse() {
  const headers: Record<string, string> = {};
  const response = {
    statusCode: 0,
    body: undefined as string | undefined,
    headers,
    setHeader: (name: string, value: string) => (headers[name] = value),
    end: (chunk?: string) => (response.body = chunk),
  };
  return response;
}

const echo: MockHandler = {
  method: 'POST',
  path: '/items/:id',
  handle: ({ params, query, body }) => ({
    status: 200,
    body: { id: params.id, filter: query.get('filter'), body },
  }),
};
const remove: MockHandler = {
  method: 'DELETE',
  path: '/items/:id',
  handle: () => ({ status: 204 }),
};

async function call(method: string, url: string, body?: string) {
  const middleware = createMockMiddleware({ base: '/api/', handlers: [echo, remove] });
  const response = fakeResponse();
  const next = vi.fn();
  await middleware(fakeRequest(method, url, body), response as unknown as ServerResponse, next);
  return { response, next };
}

describe('matchPath', () => {
  it('extrai os segmentos dinâmicos', () => {
    expect(matchPath('/customers/:id', '/customers/7')).toEqual({ id: '7' });
    expect(matchPath('/customers', '/customers/')).toEqual({});
  });

  it('recusa caminhos com outros segmentos ou outro tamanho', () => {
    expect(matchPath('/customers/:id', '/orders/7')).toBeNull();
    expect(matchPath('/customers/:id', '/customers')).toBeNull();
  });
});

describe('problem', () => {
  it('monta um corpo RFC 9457, com detail opcional', () => {
    expect(problem(404, 'Not Found', 'Sem cliente.')).toEqual({
      status: 404,
      body: { type: 'about:blank', title: 'Not Found', status: 404, detail: 'Sem cliente.' },
    });
    expect(problem(500, 'Erro').body).not.toHaveProperty('detail');
  });
});

describe('createMockMiddleware', () => {
  it('deixa seguir o que não está sob a base da API', async () => {
    const { response, next } = await call('GET', '/customers');

    expect(next).toHaveBeenCalled();
    expect(response.statusCode).toBe(0);
  });

  it('entrega params, query e corpo JSON ao handler', async () => {
    const { response, next } = await call('POST', '/api/items/3?filter=x', '{"name":"a"}');

    expect(next).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body ?? '')).toEqual({ id: '3', filter: 'x', body: { name: 'a' } });
  });

  it('responde sem corpo quando o handler não devolve um', async () => {
    const { response } = await call('DELETE', '/api/items/3');

    expect(response.statusCode).toBe(204);
    expect(response.body).toBeUndefined();
  });

  it('responde 404 em Problem Details para rota não simulada', async () => {
    const { response } = await call('GET', '/api/items/3');

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/problem+json');
  });

  it('responde 400 para corpo que não é JSON', async () => {
    const { response } = await call('POST', '/api/items/3', '{quebrado');

    expect(response.statusCode).toBe(400);
  });

  it('espera o atraso configurado antes de responder', async () => {
    vi.useFakeTimers();
    const middleware = createMockMiddleware({ base: '/api', handlers: [remove], delayMs: 300 });
    const response = fakeResponse();
    const done = middleware(
      fakeRequest('DELETE', '/api/items/1'),
      response as unknown as ServerResponse,
      vi.fn()
    );

    await vi.advanceTimersByTimeAsync(299);
    expect(response.statusCode).toBe(0);
    await vi.advanceTimersByTimeAsync(1);
    await done;
    expect(response.statusCode).toBe(204);
    vi.useRealTimers();
  });
});

describe('apiMock', () => {
  it('só se aplica ao servidor de desenvolvimento e registra o middleware', () => {
    const plugin = apiMock({ base: '/api', handlers: [] });
    const use = vi.fn();
    const configureServer = plugin.configureServer as (server: unknown) => void;

    configureServer({ middlewares: { use } });

    expect(plugin.apply).toBe('serve');
    expect(use).toHaveBeenCalledWith(expect.any(Function));
  });
});
