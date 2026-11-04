# ADR-0038: Suporte a múltiplos locales, começando pelo en-US

- **Status:** Aceita
- **Data:** 2026-11-03
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0018 (regras de camada), ADR-0023 (mensagens
  pré-compiladas), ADR-0025 (colocalização por módulo), ADR-0036 (título por
  rota), ADR-0037 (textos de interface no i18n)

## Contexto e problema

O template nasceu com um locale só, o `pt-BR`. A infraestrutura já previa
outros (`SUPPORTED_LOCALES`, `setLocale`, `<html lang>`), mas:

- o `messages.ts` buscava apenas `locales/pt-BR.json` no app e nos módulos;
- o Vuetify estava fixo em `pt`, então paginação, tabela e demais textos
  internos dos componentes não acompanhariam a troca de idioma;
- `formatDate` e `formatCurrency` fixavam `'pt-BR'` no `Intl`;
- não havia como o usuário escolher o idioma, e o `setLocale` fica em `app/`,
  que o cabeçalho (em `shared/`) não pode importar (ADR-0018);
- o ESLint só acusa chave ausente em todos os locales, não numa tradução.

Como suportar um segundo idioma (en-US) de forma que um terceiro seja só
"mais um arquivo por pasta", sem perder a checagem de chaves?

## Drivers da decisão

- Um locale novo não pode ficar com chave faltando, nem no app nem nos
  módulos; o erro aparece no `tsc`, no lint ou no teste, e não em runtime.
- Cada módulo continua trazendo e levando as próprias traduções (ADR-0025).
- Os textos do Vuetify trocam junto com os da aplicação.
- O bundle segue sem o compilador de mensagens (ADR-0023).
- Nenhuma dependência nova.

## Opções consideradas

Estrutura das mensagens:

- **Um arquivo por locale em cada pasta `locales/`** (`pt-BR.json`,
  `en-US.json`), agrupados pelo nome do arquivo, que foi a escolha;
- uma pasta por locale (`locales/en-US/*.json`), que quebra o `localeDir` do
  ESLint e o glob atual sem ganho;
- um JSON com todos os locales por pasta, que mistura idiomas no mesmo
  arquivo e dificulta revisar uma tradução.

Locale do Vuetify:

- **Mensagens do próprio Vuetify (`vuetify/locale`) e um `watch` que copia o
  locale do vue-i18n para o Vuetify**, que foi a escolha;
- o adapter oficial `createVueI18nAdapter`: ele passa as mensagens do Vuetify
  ao vue-i18n como strings cruas, e sem o compilador de mensagens o vue-i18n
  devolve a string sem interpolar (`{0}-{1} of {2}` apareceria assim);
- manter o Vuetify em `pt`, o que deixaria a tela misturando idiomas.

Troca de idioma a partir de `shared/`:

- **Um `watch` no locale global do vue-i18n, em `app/providers/i18n.ts`,
  persiste a escolha e atualiza o `<html lang>`**; o cabeçalho troca o locale
  pelo `useLocale()` (`useI18n()` global), que foi a escolha;
- injetar o `setLocale` do app por `provide`/`inject`, mais código para o
  mesmo efeito;
- duplicar a persistência no composable, com dois pontos de escrita.

## Decisão

- `SUPPORTED_LOCALES = ['pt-BR', 'en-US']` em `@core/config`. O `pt-BR` é o
  locale base: padrão do `VITE_APP_DEFAULT_LOCALE`, `fallbackLocale` do
  vue-i18n e do Vuetify, e origem do `MessageSchema`. O
  `VITE_APP_DEFAULT_LOCALE` aceita qualquer locale da lista.
- Estrutura: `src/app/locales/<locale>.json` e
  `src/modules/<módulo>/locales/<locale>.json`. O `messages.ts` descobre os
  arquivos dos módulos por glob (`@/modules/*/locales/*.json`), agrupa pelo
  nome do arquivo e mescla com as mensagens do app daquele locale. Arquivo
  com nome fora da lista é ignorado.
- Tipagem: as mensagens do app ficam num mapa tipado por `SupportedLocale`
  contra o `MessageSchema`. Cada tradução entra com `satisfies` contra o schema e um
  tipo que transforma em `never` toda chave a mais, então o `vue-tsc` acusa
  chave faltando ou sobrando. Os JSON dos módulos chegam pelo glob, sem tipo
  estático; quem os verifica é o teste de paridade.
- Paridade: `src/test/i18n/locale.spec.ts` lê o JSON cru (`?raw`) de cada
  pasta `locales/` e exige um arquivo por locale suportado, as mesmas chaves
  do pt-BR e os mesmos placeholders. No ESLint, o
  `no-missing-keys-in-other-locales` é erro nos JSON de locale.
- Fallback: chave sem tradução no locale ativo mostra o texto do pt-BR. Na
  prática não acontece, porque a paridade é exigida.
- Precedência no boot (inalterada): preferência salva
  (`STORAGE_KEYS.LOCALE`), depois `VITE_APP_DEFAULT_LOCALE`. O idioma do
  navegador não é consultado. O locale inicial não é gravado; só uma escolha
  do usuário vai para o `localStorage`, como no tema.
- Troca: o `useLocale()` (`@shared/composables`) expõe o locale ativo e o
  `setLocale`, tipados como `SupportedLocale`. O `watch` do provider de i18n
  (`flush: 'sync'`) grava a escolha e atualiza o `<html lang>`. O
  `useRouteTitle` e os `$t` já reagem ao locale.
- Vuetify: o `createAppVuetify(locale)` recebe o ref do locale do vue-i18n,
  com as mensagens de `vuetify/locale` num mapa tipado por `SupportedLocale`
  e indexado pelo mesmo código (`pt-BR`, `en-US`).
- Seletor: botão `translate` no cabeçalho (`TheLocaleMenu`) com menu
  (`role="menu"`/`menuitemradio`), idiomas pelo nome nativo
  (`LOCALE_NATIVE_NAMES`), o `lang` de cada um, o ativo marcado com
  `aria-checked` e aria-label traduzido.
- Formatação: `formatDate` e `formatCurrency` recebem o locale por parâmetro
  (padrão pt-BR) e continuam puras. A moeda não muda com o idioma.

### Como adicionar um locale

1. Acrescente o código a `SUPPORTED_LOCALES` e o nome nativo a
   `LOCALE_NATIVE_NAMES` (`src/core/config/index.ts`).
2. Crie `src/app/locales/<locale>.json` e o mesmo arquivo em cada módulo que
   tenha `locales/`, com todas as chaves do pt-BR.
3. Inclua o JSON do app no mapa de `src/app/providers/messages.ts` (com o
   `satisfies`) e as mensagens do Vuetify em `src/app/providers/vuetify.ts`.
4. Rode `pnpm build`, `pnpm lint` e `pnpm test`: o `tsc` acusa o que falta
   nos mapas, e o lint e o teste de paridade, o que falta nos JSON.

Só vale adicionar um locale com a tradução completa e revisada por quem fala
o idioma: o fallback existe para não quebrar a tela, não para publicar uma
tradução pela metade.

## Consequências

### Positivas

- A interface inteira, inclusive os textos internos do Vuetify, troca de
  idioma sem recarregar, e a escolha sobrevive ao recarregamento.
- Tradução incompleta quebra o build, o lint ou o teste, nunca a tela.
- Um módulo novo com `locales/` precisa de todos os locales desde o início, e
  o `template:clean` continua removendo a vitrine com as traduções dela.

### Negativas / trade-offs

- Todo texto novo precisa ser escrito em todos os locales no mesmo PR.
- O `MessageSchema` cobre só as mensagens do app; as dos módulos são
  verificadas por teste e lint, não pelo `tsc`.
- Trechos técnicos (snippets, caminhos) e os títulos das ADRs na vitrine
  continuam em português, pois vêm do código e da documentação.

### Neutras

- O locale dos componentes e o do vue-i18n usam o mesmo código; não há
  tabela de conversão (`pt-BR` → `pt`).
- `LOCALE_NATIVE_NAMES` não é traduzido: cada idioma aparece no próprio
  idioma, em qualquer tela.

## Referências

- `src/core/config/index.ts`, `src/app/providers/messages.ts`,
  `src/app/providers/i18n.ts`, `src/app/providers/vuetify.ts`.
- `src/shared/composables/useLocale.ts`,
  `src/shared/ui/components/TheLocaleMenu.vue`, `src/shared/utils/format.ts`.
- `src/test/i18n/locale.spec.ts`, `e2e/locale.spec.ts`, `eslint.config.mjs`.
- [Vuetify — Internationalization](https://vuetifyjs.com/en/features/internationalization/)
- [no-missing-keys-in-other-locales](https://eslint-plugin-vue-i18n.intlify.dev/rules/no-missing-keys-in-other-locales.html)
- [WCAG 3.1.2 Language of Parts](https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts)
