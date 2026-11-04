/**
 * Funções puras do avatar do design system (ADR-0045): iniciais de um nome e
 * uma cor de evento estável para ele.
 */
import { EVENT_HUES, type EventHue } from '@typings/theme';

/**
 * Até duas iniciais: a primeira e a última palavra do nome.
 *
 * @example
 * getInitials('Maria da Silva Souza') // 'MS'
 * getInitials('ana') // 'A'
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : '';
  return `${first}${last}`.toLocaleUpperCase();
}

/**
 * Matiz de evento derivado do texto: o mesmo nome tem sempre a mesma cor, e
 * nomes diferentes se espalham pelas oito cores.
 *
 * @example
 * hueFor('Maria Souza') // 'violet' (sempre o mesmo para o mesmo texto)
 */
export function hueFor(text: string): EventHue {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  }
  return EVENT_HUES[hash % EVENT_HUES.length]!;
}
