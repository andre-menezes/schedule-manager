/**
 * Service de relatórios — exemplo de download e de upload de arquivo via API.
 *
 * O backend (Java) responde com um `InputStream` e o cabeçalho
 * `Content-Disposition: attachment; filename="relatorio.pdf"`.
 * O service chama `httpClient.download` e retorna o `BinaryResponse`
 * para que o helper/view faça o salvamento.
 */
import { httpClient } from '../instances';
import type { BinaryResponse, UploadedFile } from '@typings/services';

/**
 * Baixa o relatório de um recurso específico.
 *
 * @param id Identificador do recurso.
 * @returns O blob do arquivo e o cabeçalho Content-Disposition.
 *
 * @example
 * const response = await downloadReportRequest(123);
 */
export function downloadReportRequest(id: number): Promise<BinaryResponse> {
  return httpClient.download(`/reports/${id}/pdf`);
}

/**
 * Anexa um arquivo a um relatório, em `multipart/form-data` (campo `file`).
 * Valide o arquivo antes com `validateAndUpload` (`@shared/helpers/file-upload`).
 *
 * @example
 * const attachment = await uploadReportAttachmentRequest(123, file);
 */
export function uploadReportAttachmentRequest(
  id: number,
  file: File,
  { signal }: { signal?: AbortSignal } = {}
): Promise<UploadedFile> {
  return httpClient.upload<UploadedFile>(`/reports/${id}/attachments`, {
    fields: { file },
    signal,
  });
}
