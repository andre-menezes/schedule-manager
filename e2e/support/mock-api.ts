import type { Page } from '@playwright/test';
import { matchPath, type MockHandler } from '../../mock/api-mock.ts';

/**
 * Atende as requisições da API com os mesmos handlers da API simulada do
 * `pnpm dev` (`mock/`), via `page.route`. Cada teste passa handlers novos,
 * então os dados em memória não vazam de um teste para outro.
 */
export async function routeMockApi(page: Page, handlers: MockHandler[], base = '/api') {
  await page.route(
    (url) => url.pathname.startsWith(`${base}/`),
    async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.slice(base.length);
      const match = handlers
        .filter((handler) => handler.method === request.method())
        .map((handler) => ({ handler, params: matchPath(handler.path, path) }))
        .find(({ params }) => params !== null);

      if (!match?.params) {
        await route.fulfill({ status: 404 });
        return;
      }

      const body = request.postData();
      const { status, body: responseBody } = match.handler.handle({
        params: match.params,
        query: url.searchParams,
        body: body ? (JSON.parse(body) as unknown) : undefined,
      });
      await route.fulfill(
        responseBody === undefined
          ? { status }
          : {
              status,
              json: responseBody,
              contentType: status >= 400 ? 'application/problem+json' : 'application/json',
            }
      );
    }
  );
}
