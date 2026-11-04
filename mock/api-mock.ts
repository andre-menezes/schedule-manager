/**
 * API simulada do `pnpm dev` (ADR-0039).
 *
 * Plugin do Vite que responde, no próprio servidor de desenvolvimento, às
 * rotas declaradas em `mock/handlers.ts`, sob a base da API
 * (`VITE_API_BASE_URL`, padrão `/api`). O front chama o `httpClient` como
 * chamaria o backend real: nada no `src/` sabe que a API é simulada.
 *
 * Só roda no `vite` de desenvolvimento (`apply: 'serve'`, modo `development`):
 * o build de produção, o E2E (modo `test`, que intercepta a API com
 * `page.route`) e o `vite preview` não o carregam.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

export type MockMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MockRequest {
  /** Segmentos dinâmicos do caminho (`/customers/:id` → `{ id: '7' }`). */
  params: Record<string, string>;
  query: URLSearchParams;
  /** Corpo JSON já interpretado; `undefined` sem corpo. */
  body: unknown;
}

export interface MockResponse {
  status: number;
  /** Serializado em JSON; sem corpo (ex.: 204) quando ausente. */
  body?: unknown;
}

export interface MockHandler {
  method: MockMethod;
  /** Caminho relativo à base da API, com `:param` para segmentos dinâmicos. */
  path: string;
  handle: (request: MockRequest) => MockResponse;
}

export interface ApiMockOptions {
  /** Base da API, como em `VITE_API_BASE_URL` (ex.: `/api`). */
  base: string;
  handlers: MockHandler[];
  /** Atraso artificial de cada resposta, para o loading aparecer. */
  delayMs?: number;
}

/** Corpo de erro no padrão RFC 9457, como o backend real responderia. */
export function problem(status: number, title: string, detail?: string): MockResponse {
  return { status, body: { type: 'about:blank', title, status, ...(detail ? { detail } : {}) } };
}

/** Compara um caminho com o padrão do handler e extrai os `:params`. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (const [index, part] of patternParts.entries()) {
    const value = decodeURIComponent(pathParts[index] ?? '');
    if (part.startsWith(':')) {
      params[part.slice(1)] = value;
    } else if (part !== value) {
      return null;
    }
  }
  return params;
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  const text = Buffer.concat(chunks).toString('utf-8');
  return text ? (JSON.parse(text) as unknown) : undefined;
}

function send(response: ServerResponse, { status, body }: MockResponse): void {
  response.statusCode = status;
  if (body === undefined) {
    response.end();
    return;
  }
  const type = status >= 400 ? 'application/problem+json' : 'application/json';
  response.setHeader('Content-Type', type);
  response.end(JSON.stringify(body));
}

/**
 * Middleware do mock: atende o que está sob `base` e deixa o resto (páginas,
 * assets) seguir para o Vite. Exportado para teste.
 */
export function createMockMiddleware({ base, handlers, delayMs = 0 }: ApiMockOptions) {
  const prefix = base.replace(/\/$/, '');

  return async (
    request: IncomingMessage,
    response: ServerResponse,
    next: () => void
  ): Promise<void> => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`)) {
      next();
      return;
    }

    const path = url.pathname.slice(prefix.length);
    const method = request.method ?? 'GET';
    const route = handlers
      .filter((handler) => handler.method === method)
      .map((handler) => ({ handler, params: matchPath(handler.path, path) }))
      .find(({ params }) => params !== null);

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (!route) {
      send(response, problem(404, 'Not Found', `Nenhuma rota simulada para ${method} ${path}.`));
      return;
    }

    let body: unknown;
    try {
      body = await readBody(request);
    } catch {
      send(response, problem(400, 'Bad Request', 'O corpo da requisição não é um JSON válido.'));
      return;
    }

    send(
      response,
      route.handler.handle({ params: route.params ?? {}, query: url.searchParams, body })
    );
  };
}

/** Plugin do Vite que registra o middleware no servidor de desenvolvimento. */
export function apiMock(options: ApiMockOptions): Plugin {
  return {
    name: 'api-mock',
    apply: 'serve',
    configureServer(server) {
      const middleware = createMockMiddleware(options);
      server.middlewares.use((request, response, next) => {
        void middleware(request, response, next);
      });
    },
  };
}
