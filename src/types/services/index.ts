/**
 * Parâmetros de query string. Aceita qualquer objeto, inclusive `interface`
 * de filtro do domínio (que não tem assinatura de índice).
 */
export type QueryParams = object;

/** Corpo da requisição: objeto (serializado em JSON) ou `BodyInit` (FormData, Blob...). */
export type BodyParams = object | BodyInit | null;

/** Opções de uma requisição com corpo (`post`, `put`, `patch`). */
export interface RequestOptions<
  TQuery extends QueryParams = QueryParams,
  TBody extends BodyParams = BodyParams,
> {
  /** Parâmetros de query string. */
  query?: TQuery;
  /** Corpo da requisição. */
  body?: TBody;
  /** Headers adicionais desta chamada (somados aos da instância). */
  headers?: HeadersInit;
  /**
   * Cancela a requisição (ex.: ao sair da tela ou ao digitar de novo numa
   * busca). Combinado com o timeout padrão da instância.
   */
  signal?: AbortSignal;
}

/** Opções de uma requisição sem corpo (`get`, `delete`, `download`). */
export type ReadRequestOptions<TQuery extends QueryParams = QueryParams> = Omit<
  RequestOptions<TQuery>,
  'body'
>;

/** Resposta de um download binário: o conteúdo e o cabeçalho de disposição. */
export interface BinaryResponse {
  /** Corpo binário do arquivo. */
  blob: Blob;
  /** Cabeçalho `Content-Disposition` (contém o nome do arquivo, se informado). */
  contentDisposition: string | null;
}

/**
 * Página pedida a uma listagem paginada. `page` começa em 1; `pageSize` vai
 * de 1 a `MAX_PAGE_SIZE` (`@core/config`). Filtros de cada recurso estendem
 * esta interface (ex.: `CustomerListParams`).
 */
export interface PageParams {
  page: number;
  pageSize: number;
}

/** Uma página de resultados e o total de itens que atendem ao filtro. */
export interface PaginatedResponse<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** Valor de um campo multipart: texto, número, booleano ou arquivo. */
export type UploadFieldValue = string | number | boolean | Blob;

/**
 * Campos de um envio `multipart/form-data`. Um array vira o mesmo campo
 * repetido (vários arquivos); `null` e `undefined` ficam de fora.
 */
export type UploadFields = Record<string, UploadFieldValue | UploadFieldValue[] | null | undefined>;

/** Opções de um upload (`httpClient.upload`). */
export interface UploadRequestOptions<TQuery extends QueryParams = QueryParams> {
  /** Campos do formulário multipart, com os arquivos. */
  fields: UploadFields;
  query?: TQuery;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

/** Restrições de um arquivo antes do envio. */
export interface FileRules {
  /** Tamanho máximo em bytes. */
  maxBytes?: number;
  /**
   * Tipos aceitos, no formato do atributo `accept` do `<input type="file">`:
   * extensões (`.pdf`), MIME exato (`application/pdf`) ou curinga (`image/*`).
   */
  accept?: string[];
}

/** Motivo de um arquivo recusado pelas `FileRules`. */
export type FileRuleViolation = 'tooLarge' | 'invalidType' | 'empty';

/** Arquivo recebido pelo backend, como o exemplo de upload responde. */
export interface UploadedFile {
  id: string;
  filename: string;
  /** Tamanho em bytes. */
  size: number;
  contentType: string;
}
