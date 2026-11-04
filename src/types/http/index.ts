/**
 * Contratos de resposta de erro HTTP.
 */

/**
 * Corpo de erro no padrão RFC 9457 (Problem Details for HTTP APIs),
 * servido com Content-Type `application/problem+json`.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457
 */
export interface ProblemDetails {
  /** URI que identifica o tipo do problema. Default `about:blank`. */
  type?: string;
  /** Resumo curto e legível do tipo do problema. */
  title?: string;
  /** Código de status HTTP gerado pela origem. */
  status?: number;
  /** Explicação específica desta ocorrência do problema. */
  detail?: string;
  /** URI que identifica a ocorrência específica do problema. */
  instance?: string;
  /** Campos de extensão adicionais definidos pela API. */
  [extension: string]: unknown;
}

/**
 * Textos usados por `getErrorMessage` quando o erro não traz mensagem
 * própria. Vêm do i18n (ver `useErrorMessage`), nunca fixos no código.
 */
export interface ErrorMessageFallbacks {
  /** Erro sem corpo Problem Details, sem status e sem mensagem. */
  unexpected: string;
  /** Erro HTTP sem `statusText` (o status é anexado: "<texto> (HTTP 500)"). */
  requestFailed: string;
}
