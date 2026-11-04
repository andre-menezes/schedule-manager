import { describe, expect, it } from 'vitest';
import type { MockHandler, MockMethod, MockResponse } from './api-mock.ts';
import { createCustomerHandlers, createSeed } from './customers.ts';

/** Chama o handler de `method path` como o middleware faria. */
function client(handlers: MockHandler[] = createCustomerHandlers()) {
  return (
    method: MockMethod,
    path: string,
    params: Record<string, string> = {},
    body?: unknown
  ) => {
    const handler = handlers.find((item) => item.method === method && item.path === path);
    if (!handler) throw new Error(`sem handler para ${method} ${path}`);
    return handler.handle({ params, query: new URLSearchParams(), body });
  };
}

function list(query: string, handlers = createCustomerHandlers()): MockResponse {
  const handler = handlers.find((item) => item.method === 'GET' && item.path === '/customers');
  return handler!.handle({ params: {}, query: new URLSearchParams(query), body: undefined });
}

const valid = { name: ' Nova Cliente ', email: 'nova@example.com', phone: ' ', active: false };

describe('seed de clientes', () => {
  it('gera 32 clientes com ids e e-mails únicos', () => {
    const seed = createSeed();

    expect(seed).toHaveLength(32);
    expect(new Set(seed.map(({ id }) => id)).size).toBe(32);
    expect(new Set(seed.map(({ email }) => email)).size).toBe(32);
    expect(seed[5]?.email).toBe('fabio.souza@example.com');
  });
});

describe('GET /customers', () => {
  it('pagina a lista e informa o total', () => {
    expect(list('page=4&pageSize=10').body).toMatchObject({ total: 32, page: 4, pageSize: 10 });
    expect((list('page=4&pageSize=10').body as { items: unknown[] }).items).toHaveLength(2);
  });

  it('usa página 1 com 10 itens quando os parâmetros são inválidos', () => {
    expect(list('page=x&pageSize=-1').body).toMatchObject({ page: 1, pageSize: 10 });
  });

  it('filtra por nome ou e-mail, sem diferenciar maiúsculas', () => {
    expect(list('search=COSTA').body).toMatchObject({ total: 8 });
    expect(list('search=heitor.lima@').body).toMatchObject({ total: 1 });
  });
});

describe('CRUD de /customers/:id', () => {
  it('busca um cliente pelo id, ou responde 404', () => {
    const request = client();

    expect(request('GET', '/customers/:id', { id: '1' }).body).toMatchObject({ name: 'Ana Souza' });
    expect(request('GET', '/customers/:id', { id: '999' }).status).toBe(404);
  });

  it('cadastra no início da lista com os campos limpos', () => {
    const handlers = createCustomerHandlers();
    const created = client(handlers)('POST', '/customers', {}, valid);

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      id: 33,
      name: 'Nova Cliente',
      phone: null,
      active: false,
    });
    const page = list('', handlers).body as { total: number; items: { id: number }[] };
    expect(page.total).toBe(33);
    expect(page.items[0]?.id).toBe(33);
  });

  it('recusa cadastro sem nome ou e-mail e com e-mail repetido', () => {
    const request = client();

    expect(request('POST', '/customers', {}, { name: 'Só nome' }).status).toBe(400);
    expect(request('POST', '/customers', {}, null).status).toBe(400);
    expect(
      request('POST', '/customers', {}, { name: 'Outra', email: 'ANA.souza@example.com' }).status
    ).toBe(409);
  });

  it('atualiza mantendo id e data de cadastro', () => {
    const request = client();
    const before = request('GET', '/customers/:id', { id: '2' }).body as { createdAt: string };
    const updated = request('PUT', '/customers/:id', { id: '2' }, { ...valid, phone: '3199' });

    expect(updated).toMatchObject({
      status: 200,
      body: { id: 2, name: 'Nova Cliente', phone: '3199', createdAt: before.createdAt },
    });
  });

  it('recusa atualização de cliente inexistente, inválida ou com e-mail de outro', () => {
    const request = client();

    expect(request('PUT', '/customers/:id', { id: '999' }, valid).status).toBe(404);
    expect(request('PUT', '/customers/:id', { id: '2' }, { name: '' }).status).toBe(400);
    expect(
      request('PUT', '/customers/:id', { id: '2' }, { ...valid, email: 'ana.souza@example.com' })
        .status
    ).toBe(409);
    // O próprio e-mail continua válido.
    expect(
      request('PUT', '/customers/:id', { id: '2' }, { ...valid, email: 'bruno.souza@example.com' })
        .status
    ).toBe(200);
  });

  it('exclui o cliente e responde 404 numa segunda exclusão', () => {
    const handlers = createCustomerHandlers();
    const request = client(handlers);

    expect(request('DELETE', '/customers/:id', { id: '1' })).toEqual({ status: 204 });
    expect(request('DELETE', '/customers/:id', { id: '1' }).status).toBe(404);
    expect(list('', handlers).body).toMatchObject({ total: 31 });
  });

  it('começa os ids em 1 com uma base vazia', () => {
    const created = client(createCustomerHandlers([]))('POST', '/customers', {}, valid);

    expect(created.body).toMatchObject({ id: 1 });
  });
});
