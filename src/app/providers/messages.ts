/**
 * Mensagens de i18n da aplicação, por locale suportado: o locale de
 * `app/locales` mais os `locales/<locale>.json` de cada módulo, descobertos
 * por glob e agrupados pelo nome do arquivo. Um módulo traz e leva as próprias
 * traduções; remover a pasta remove as mensagens junto.
 */
import ptBR from '@app/locales/pt-BR.json';
import enUS from '@app/locales/en-US.json';
import { isSupportedLocale, type SupportedLocale } from '@core/config';

/**
 * Schema das mensagens, derivado do locale base (pt-BR). Fica junto do
 * provider (e não em `types/`) porque depende do JSON da camada `app` —
 * `types` não importa de nenhuma camada (ADR-0018).
 */
export type MessageSchema = typeof ptBR;

type MessageTree = { [key: string]: unknown };

const isTree = (value: unknown): value is MessageTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Junta dois dicionários; namespaces repetidos (ex.: `nav`) são mesclados. */
function mergeMessages(base: MessageTree, extra: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const current = result[key];
    result[key] = isTree(current) && isTree(value) ? mergeMessages(current, value) : value;
  }
  return result;
}

/** Locale de um arquivo pelo nome: `.../locales/en-US.json` → `en-US`. */
const LOCALE_FILE_PATTERN = /\/locales\/([^/]+)\.json$/;

/**
 * Mescla às mensagens do app as de cada arquivo de locale dos módulos,
 * agrupadas pelo nome do arquivo. Um arquivo cujo nome não é um locale
 * suportado fica de fora (o teste de paridade aponta esse caso). Exportada
 * para teste.
 */
export function mergeModuleMessages(
  appMessages: Record<SupportedLocale, MessageTree>,
  moduleFiles: Record<string, MessageTree>
): Record<SupportedLocale, MessageTree> {
  const result = { ...appMessages };
  for (const [path, messages] of Object.entries(moduleFiles)) {
    const locale = LOCALE_FILE_PATTERN.exec(path)?.[1] ?? null;
    if (isSupportedLocale(locale)) {
      result[locale] = mergeMessages(result[locale], messages);
    }
  }
  return result;
}

/**
 * Marca como `never` toda chave de `T` que não existe em `S`, em qualquer
 * nível. Somado a `S`, exige exatamente as chaves do schema.
 */
type NoExtraKeys<T, S> = {
  [K in keyof T]: K extends keyof S
    ? T[K] extends object
      ? NoExtraKeys<T[K], S[K]>
      : T[K]
    : never;
};

/** Formato exigido de um locale: as chaves do pt-BR, nem mais nem menos. */
type LocaleMessagesOf<T> = MessageSchema & NoExtraKeys<T, MessageSchema>;

/**
 * Mensagens do app por locale. Um locale suportado sem entrada aqui não
 * compila, e o `satisfies` acusa no `tsc` a chave que falta ou sobra no JSON
 * de cada tradução.
 */
const appMessages: Record<SupportedLocale, MessageSchema> = {
  'pt-BR': ptBR,
  'en-US': enUS satisfies LocaleMessagesOf<typeof enUS>,
};

/** Arquivos de locale dos módulos, indexados pelo caminho. */
const moduleLocaleFiles = import.meta.glob<MessageTree>('@/modules/*/locales/*.json', {
  eager: true,
  import: 'default',
});

export const localeMessages = mergeModuleMessages(appMessages, moduleLocaleFiles) as Record<
  SupportedLocale,
  MessageSchema
>;
