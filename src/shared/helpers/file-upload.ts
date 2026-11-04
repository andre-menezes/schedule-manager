/**
 * Helper de upload de arquivos: valida o arquivo (utils) e só então chama o
 * service (rede). O par do `downloadAndSave`.
 *
 * @example
 * import { uploadReportAttachmentRequest } from '@shared/api/services/report.service';
 * import { validateAndUpload } from '@shared/helpers/file-upload';
 *
 * await validateAndUpload(file, { maxBytes: 5 * 1024 ** 2, accept: ['.pdf'] }, (valid) =>
 *   uploadReportAttachmentRequest(123, valid)
 * );
 */
import { validateFile } from '@shared/utils/file-upload';
import type { FileRuleViolation, FileRules } from '@typings/services';

/**
 * Erro de um arquivo recusado antes do envio. A tela traduz o `violation`
 * (ex.: `t(\`upload.${error.violation}\`)`) e, se quiser, mostra as `rules`.
 */
export class FileValidationError extends Error {
  readonly violation: FileRuleViolation;
  readonly rules: FileRules;

  constructor(violation: FileRuleViolation, rules: FileRules) {
    super(`Arquivo recusado: ${violation}`);
    this.name = 'FileValidationError';
    this.violation = violation;
    this.rules = rules;
  }
}

/**
 * Valida o arquivo e, se ele atender às regras, envia pelo `request`. Um
 * arquivo inválido rejeita com `FileValidationError`, sem tocar na rede.
 */
export async function validateAndUpload<T>(
  file: File,
  rules: FileRules,
  request: (file: File) => Promise<T>
): Promise<T> {
  const violation = validateFile(file, rules);
  if (violation) {
    throw new FileValidationError(violation, rules);
  }
  return request(file);
}
