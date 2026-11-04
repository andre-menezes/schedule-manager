/**
 * Utilitários para upload de arquivos: o par do `file-download.ts`.
 *
 * Funções puras: montam o `FormData` do envio, validam um arquivo contra as
 * restrições da tela e formatam tamanhos para mensagens. A requisição fica na
 * camada de API (`httpClient.upload`) e a orquestração, no helper
 * `validateAndUpload`.
 */
import type {
  FileRuleViolation,
  FileRules,
  UploadFieldValue,
  UploadFields,
} from '@typings/services';

function appendField(formData: FormData, name: string, value: UploadFieldValue): void {
  if (value instanceof Blob) {
    // Um `File` mantém o próprio nome; um `Blob` solto recebe o nome do campo.
    formData.append(name, value, value instanceof File ? value.name : name);
  } else {
    formData.append(name, String(value));
  }
}

/**
 * Monta o `FormData` de um envio multipart. Arrays viram o mesmo campo
 * repetido; `null` e `undefined` são ignorados.
 *
 * @example
 * toFormData({ file, description: 'Contrato', tags: ['a', 'b'] })
 */
export function toFormData(fields: UploadFields): FormData {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    if (value === null || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      appendField(formData, name, item);
    }
  }
  return formData;
}

/** Verifica um tipo do `accept` (`.pdf`, `application/pdf`, `image/*`). */
function matchesAccept(file: File, accepted: string): boolean {
  const rule = accepted.trim().toLowerCase();
  if (rule.startsWith('.')) {
    return file.name.toLowerCase().endsWith(rule);
  }
  const type = file.type.toLowerCase();
  return rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule;
}

/**
 * Valida um arquivo antes do envio. Devolve o motivo da recusa, ou `null`
 * quando o arquivo atende às regras. O backend continua validando: isto só
 * evita um envio que já se sabe inválido.
 *
 * @example
 * validateFile(file, { maxBytes: 5 * 1024 ** 2, accept: ['.pdf', 'image/*'] }) // 'tooLarge'
 */
export function validateFile(file: File, rules: FileRules = {}): FileRuleViolation | null {
  if (file.size === 0) return 'empty';
  if (rules.maxBytes !== undefined && file.size > rules.maxBytes) return 'tooLarge';
  if (rules.accept?.length && !rules.accept.some((rule) => matchesAccept(file, rule))) {
    return 'invalidType';
  }
  return null;
}

const SIZE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

/**
 * Formata um tamanho em bytes na maior unidade cabível (base 1024), no
 * formato do `locale`, para mensagens como "máximo de 5 MB".
 *
 * @example
 * formatFileSize(5 * 1024 ** 2) // '5 MB'
 * formatFileSize(1536, 'en-US') // '1.5 kB'
 */
export function formatFileSize(bytes: number, locale = 'pt-BR'): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: SIZE_UNITS[unit],
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}
