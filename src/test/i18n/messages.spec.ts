import { describe, expect, it } from 'vitest';
import { localeMessages, mergeModuleMessages } from '@app/providers/messages';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@core/config';

type Messages = Record<SupportedLocale, Record<string, unknown>>;

describe('mergeModuleMessages', () => {
  const appMessages = (): Messages => ({
    'pt-BR': { nav: { home: 'Início' } },
    'en-US': { nav: { home: 'Home' } },
  });

  it('mescla cada arquivo de módulo no locale indicado pelo nome do arquivo', () => {
    const result = mergeModuleMessages(appMessages(), {
      '/src/modules/a/locales/pt-BR.json': { nav: { docs: 'Documentação' } },
      '/src/modules/a/locales/en-US.json': { nav: { docs: 'Documentation' } },
      '/src/modules/b/locales/pt-BR.json': { other: { title: 'Outro' } },
      '/src/modules/b/locales/en-US.json': { other: { title: 'Other' } },
    });

    expect(result).toEqual({
      'pt-BR': { nav: { home: 'Início', docs: 'Documentação' }, other: { title: 'Outro' } },
      'en-US': { nav: { home: 'Home', docs: 'Documentation' }, other: { title: 'Other' } },
    });
  });

  it('as mensagens da aplicação têm uma entrada por locale suportado', () => {
    expect(Object.keys(localeMessages)).toEqual([...SUPPORTED_LOCALES]);
  });

  it('ignora arquivos cujo nome não é um locale suportado', () => {
    const result = mergeModuleMessages(appMessages(), {
      '/src/modules/a/locales/fr-FR.json': { nav: { home: 'Accueil' } },
      '/src/modules/a/locales/notes.txt': { nav: { home: 'x' } },
    });

    expect(result).toEqual(appMessages());
  });

  it('não altera as mensagens do app recebidas', () => {
    const messages = appMessages();

    mergeModuleMessages(messages, {
      '/src/modules/a/locales/pt-BR.json': { extra: { key: 'valor' } },
    });

    expect(messages).toEqual(appMessages());
  });
});
