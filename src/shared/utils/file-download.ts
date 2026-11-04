/**
 * Utilitários para download de arquivos binários no navegador.
 *
 * O backend (Java) responde a downloads com um `InputStream` — no cliente isso
 * chega como um corpo binário (`Blob`). Estas funções tratam o `Blob`, extraem
 * o nome do arquivo do cabeçalho `Content-Disposition` e disparam o salvamento.
 *
 * São funções de apresentação/browser (dependem de `document`/`URL`); a
 * requisição em si fica na camada de API (ver `httpClient.download` e
 * `downloadReportRequest`).
 */

/** Nome de arquivo usado quando o servidor não informa um. */
const DEFAULT_FILENAME = 'download';

/**
 * Extrai o nome do arquivo do cabeçalho `Content-Disposition`.
 *
 * Suporta tanto `filename="arquivo.pdf"` quanto o formato codificado
 * `filename*=UTF-8''arquivo%20final.pdf` (RFC 5987), priorizando este último.
 *
 * @example
 * parseContentDisposition('attachment; filename="relatorio.pdf"') // 'relatorio.pdf'
 */
export function parseContentDisposition(
  header: string | null | undefined,
  fallback = DEFAULT_FILENAME
): string {
  if (!header) return fallback;

  // filename*=UTF-8''nome%20codificado.ext  (tem precedência sobre filename=)
  const encoded = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(header);
  if (encoded?.[1]) {
    try {
      return decodeURIComponent(encoded[1].trim().replace(/^"|"$/g, ''));
    } catch {
      // cai para o filename simples abaixo
    }
  }

  // filename="nome com espaços.pdf" ou filename=nome.pdf
  const simple = /filename=(?:"([^"]+)"|([^;\s]+))/i.exec(header);
  const name = simple?.[1] ?? simple?.[2];
  if (name) return name.trim();

  return fallback;
}

/**
 * Dispara o download de um `Blob` no navegador criando um link temporário.
 * Cria e revoga o object URL para não vazar memória.
 *
 * @example
 * saveBlob(blob, 'relatorio.pdf')
 */
export function saveBlob(blob: Blob, filename = DEFAULT_FILENAME): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Libera o object URL após o clique (assíncrono para garantir o início do download).
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Converte o corpo binário recebido (`Blob`/`ArrayBuffer`) em `Blob`, opcionalmente
 * forçando um `type` (MIME) quando o servidor não o define corretamente.
 */
export function toBlob(data: Blob | ArrayBuffer, type?: string): Blob {
  if (data instanceof Blob) {
    return type && !data.type ? new Blob([data], { type }) : data;
  }
  return new Blob([data], type ? { type } : undefined);
}

/**
 * Salva um corpo binário como arquivo, resolvendo o nome pelo cabeçalho
 * `Content-Disposition` quando um nome explícito não é informado.
 *
 * @example
 * saveBinaryResponse(blob, response.headers.get('content-disposition'))
 */
export function saveBinaryResponse(
  data: Blob | ArrayBuffer,
  contentDisposition?: string | null,
  options: { filename?: string; type?: string } = {}
): void {
  const filename = options.filename ?? parseContentDisposition(contentDisposition);
  saveBlob(toBlob(data, options.type), filename);
}
