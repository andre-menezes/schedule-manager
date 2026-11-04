import { describe, expect, it } from 'vitest';
import { createAppI18n } from '@app/providers/i18n';
import { SUPPORTED_LOCALES } from '@core/config';

/**
 * JSON cru dos locales. Importados normalmente, eles chegam pré-compilados
 * pelo `@intlify/unplugin-vue-i18n` (cada mensagem vira uma AST), o que
 * esconde as chaves e o texto original.
 */
const rawFiles = import.meta.glob<string>(['@/app/locales/*.json', '@/modules/*/locales/*.json'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Lista as chaves-folha do dicionário (ex.: `home.title`). */
function leafKeys(node: unknown, prefix = ''): string[] {
  if (typeof node !== 'object' || node === null) return [prefix];
  return Object.entries(node).flatMap(([key, value]) =>
    leafKeys(value, prefix ? `${prefix}.${key}` : key)
  );
}

/** Valor de uma chave-folha (ex.: `home.title`). */
function valueAt(tree: unknown, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) => (typeof node === 'object' && node !== null ? Reflect.get(node, part) : node),
      tree
    );
}

/** Placeholders e interpolações literais de uma mensagem, ordenados. */
function placeholders(message: unknown): string {
  return (String(message).match(/\{[^}]*\}/g) ?? []).sort().join(' ');
}

/** Agrupa os arquivos por pasta: `{ '<pasta>/locales': { 'pt-BR': {...} } }`. */
function groupByFolder(files: Record<string, string>): Record<string, Record<string, unknown>> {
  const groups: Record<string, Record<string, unknown>> = {};
  for (const [path, source] of Object.entries(files)) {
    const separator = path.lastIndexOf('/');
    const folder = path.slice(0, separator);
    const locale = path.slice(separator + 1).replace(/\.json$/, '');
    groups[folder] = { ...groups[folder], [locale]: JSON.parse(source) as unknown };
  }
  return groups;
}

const folders = groupByFolder(rawFiles);
const otherLocales = SUPPORTED_LOCALES.filter((locale) => locale !== 'pt-BR');

describe('paridade dos arquivos de locale', () => {
  // Os módulos com `locales/` entram no `describe.each` abaixo; sem nenhum
  // módulo com locales o teste continua válido.
  it('encontra os locales do app', () => {
    expect(Object.keys(folders).some((path) => path.endsWith('/app/locales'))).toBe(true);
  });

  describe.each(Object.entries(folders))('%s', (_folder, locales) => {
    it('tem um arquivo por locale suportado, e só deles', () => {
      expect(Object.keys(locales).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    });

    it.each(otherLocales)('%s tem exatamente as chaves do pt-BR', (locale) => {
      expect(leafKeys(locales[locale]).sort()).toEqual(leafKeys(locales['pt-BR']).sort());
    });

    it.each(otherLocales)('%s preserva os placeholders do pt-BR', (locale) => {
      const changed = leafKeys(locales['pt-BR']).filter(
        (key) =>
          placeholders(valueAt(locales['pt-BR'], key)) !==
          placeholders(valueAt(locales[locale], key))
      );

      expect(changed).toEqual([]);
    });
  });
});

describe.each(SUPPORTED_LOCALES)('mensagens %s', (locale) => {
  const keys = Object.values(folders).flatMap((locales) => leafKeys(locales[locale]));

  // Caracteres especiais do vue-i18n (ex.: `@` de mensagem vinculada) sem
  // escape quebram a tela em runtime; aqui toda mensagem é resolvida no
  // próprio locale, sem cair no fallback.
  it('resolve todas as chaves no próprio locale, sem erro', () => {
    const { t, te } = createAppI18n(locale).global;
    const errors: string[] = [];

    for (const key of keys) {
      try {
        if (!te(key, locale) || t(key) === key) errors.push(`${key}: ausente`);
      } catch (error) {
        errors.push(`${key}: ${(error as Error).message}`);
      }
    }

    expect(keys.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
});
