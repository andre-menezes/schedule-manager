import { API_BASE_URL, HTTP_TIMEOUT_MS } from '@core/config';
import { ofetch, type FetchOptions } from 'ofetch';
import type {
  QueryParams,
  BodyParams,
  RequestOptions,
  ReadRequestOptions,
  BinaryResponse,
  UploadRequestOptions,
} from '@typings/services';
import { toFormData } from '@shared/utils/file-upload';

/**
 * Cancelamento da requisição. Sem `signal`, vale o timeout padrão do ofetch.
 * Com `signal`, o ofetch ignoraria o timeout; por isso os dois são combinados
 * (o que acontecer primeiro cancela). Navegadores sem `AbortSignal.any` usam só
 * o `signal` do chamador.
 */
function abortOptions(signal?: AbortSignal): Pick<FetchOptions, 'signal' | 'timeout'> {
  if (!signal) {
    return { timeout: HTTP_TIMEOUT_MS };
  }
  if (typeof AbortSignal.any !== 'function') {
    return { signal };
  }
  return { signal: AbortSignal.any([signal, AbortSignal.timeout(HTTP_TIMEOUT_MS)]) };
}

/** Converte as opções do template para as do ofetch. */
function toFetchOptions(
  method: string,
  { query, body, headers, signal }: RequestOptions = {}
): FetchOptions<'json'> {
  return { method, query, body, headers, ...abortOptions(signal) };
}

/**
 * Cria o cliente HTTP de uma base URL. A instância do ofetch é criada uma vez
 * e reutilizada por todas as chamadas; o método vem de cada chamada.
 */
export function createApiInstance(baseURL: string) {
  const $fetch = ofetch.create({ baseURL });

  return {
    get<T = unknown, TQuery extends QueryParams = QueryParams>(
      url: string,
      options?: ReadRequestOptions<TQuery>
    ): Promise<T> {
      return $fetch<T>(url, toFetchOptions('GET', options));
    },

    post<
      T = unknown,
      TQuery extends QueryParams = QueryParams,
      TBody extends BodyParams = BodyParams,
    >(url: string, options?: RequestOptions<TQuery, TBody>): Promise<T> {
      return $fetch<T>(url, toFetchOptions('POST', options));
    },

    put<
      T = unknown,
      TQuery extends QueryParams = QueryParams,
      TBody extends BodyParams = BodyParams,
    >(url: string, options?: RequestOptions<TQuery, TBody>): Promise<T> {
      return $fetch<T>(url, toFetchOptions('PUT', options));
    },

    patch<
      T = unknown,
      TQuery extends QueryParams = QueryParams,
      TBody extends BodyParams = BodyParams,
    >(url: string, options?: RequestOptions<TQuery, TBody>): Promise<T> {
      return $fetch<T>(url, toFetchOptions('PATCH', options));
    },

    delete<T = unknown, TQuery extends QueryParams = QueryParams>(
      url: string,
      options?: ReadRequestOptions<TQuery>
    ): Promise<T> {
      return $fetch<T>(url, toFetchOptions('DELETE', options));
    },

    /**
     * Baixa um arquivo binário (corpo `InputStream` do backend).
     * Retorna o `Blob` e o cabeçalho `Content-Disposition` para resolver o nome.
     */
    async download<TQuery extends QueryParams = QueryParams>(
      url: string,
      options?: ReadRequestOptions<TQuery>
    ): Promise<BinaryResponse> {
      const { query, headers, signal } = options ?? {};
      const response = await $fetch.raw<Blob, 'blob'>(url, {
        method: 'GET',
        query,
        headers,
        ...abortOptions(signal),
        responseType: 'blob',
      });

      if (!(response._data instanceof Blob)) {
        throw new Error(`Download sem conteúdo binário: ${url}`);
      }

      return {
        blob: response._data,
        contentDisposition: response.headers.get('content-disposition'),
      };
    },

    /**
     * Envia arquivos em `multipart/form-data` (POST). O navegador define o
     * `Content-Type` com o boundary do `FormData`; não o informe nos headers.
     */
    upload<T = unknown, TQuery extends QueryParams = QueryParams>(
      url: string,
      { fields, query, headers, signal }: UploadRequestOptions<TQuery>
    ): Promise<T> {
      return $fetch<T>(
        url,
        toFetchOptions('POST', { query, headers, signal, body: toFormData(fields) })
      );
    },
  };
}

/** Cliente HTTP retornado por `createApiInstance`. */
export type ApiInstance = ReturnType<typeof createApiInstance>;

// API Instances
export const httpClient = createApiInstance(API_BASE_URL);
