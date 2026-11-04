/**
 * Helper de download de arquivos: orquestra o service (rede) e o salvamento
 * no navegador (utils). Tem efeito lateral (rede + DOM), por isso fica em
 * `helpers/` e não em `utils/`.
 *
 * @example
 * import { downloadReportRequest } from '@shared/api/services/report.service';
 * import { downloadAndSave } from '@shared/helpers/file-download';
 *
 * async function handleDownload() {
 *   await downloadAndSave(downloadReportRequest(123));
 * }
 */
import { saveBinaryResponse } from '@shared/utils/file-download';
import type { BinaryResponse } from '@typings/services';

interface SaveOptions {
  /** Nome do arquivo; se omitido, usa o do cabeçalho `Content-Disposition`. */
  filename?: string;
  /** Força o MIME quando o servidor não o define. */
  type?: string;
}

/**
 * Recebe a Promise de um service de download, aguarda a resposta binária e
 * dispara o salvamento do arquivo no navegador.
 *
 * @param request Promise retornada por um service de download (ex.: `downloadReportRequest(id)`).
 * @param options Opções de salvamento (nome e MIME opcionais).
 *
 * @example
 * await downloadAndSave(downloadReportRequest(123));
 * await downloadAndSave(downloadReportRequest(45), { filename: 'relatorio.pdf' });
 */
export async function downloadAndSave(
  request: Promise<BinaryResponse>,
  options: SaveOptions = {}
): Promise<void> {
  const { blob, contentDisposition } = await request;

  saveBinaryResponse(blob, contentDisposition, {
    filename: options.filename,
    type: options.type,
  });
}
