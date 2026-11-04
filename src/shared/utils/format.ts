/**
 * Funções utilitárias puras de formatação.
 * Não dependem de stores, services ou qualquer camada externa.
 */

/**
 * Locale usado quando quem chama não informa um. Componentes passam o locale
 * ativo (`useLocale().locale.value`); o padrão mantém o formato brasileiro.
 */
const DEFAULT_FORMAT_LOCALE = 'pt-BR';

/**
 * Formata um valor numérico como moeda, no formato do `locale`. A moeda não
 * muda com o idioma: é um dado do valor (padrão BRL).
 *
 * @example
 * formatCurrency(1234.5) // 'R$ 1.234,50'
 * formatCurrency(1234.5, 'en-US') // 'R$1,234.50'
 * formatCurrency(1234.5, 'en-US', 'USD') // '$1,234.50'
 */
export function formatCurrency(
  value: number,
  locale: string = DEFAULT_FORMAT_LOCALE,
  currency = 'BRL'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/** Data sem horário (`YYYY-MM-DD`), que o `Date` interpretaria como UTC. */
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Formata uma data ISO no formato curto do `locale` (padrão pt-BR).
 *
 * Datas sem horário (`2025-03-15`) são tratadas como data local: o `Date`
 * as interpretaria como meia-noite UTC, exibindo o dia anterior em fusos
 * negativos (ex.: 14/03 em UTC-3).
 *
 * @example
 * formatDate('2025-03-15') // '15/03/2025'
 * formatDate('2025-03-15T10:30:00Z') // '15/03/2025'
 * formatDate('2025-03-15', 'en-US') // '3/15/2025'
 */
export function formatDate(isoDate: string, locale: string = DEFAULT_FORMAT_LOCALE): string {
  const dateOnly = DATE_ONLY_PATTERN.exec(isoDate);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(isoDate);

  return new Intl.DateTimeFormat(locale).format(date);
}

/**
 * Trunca um texto com reticências se exceder o limite de caracteres.
 *
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
