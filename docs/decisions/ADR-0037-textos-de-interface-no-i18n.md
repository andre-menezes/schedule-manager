# ADR-0037: Textos de interface sempre no i18n, com exceções técnicas

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0023 (mensagens de i18n pré-compiladas)

## Contexto e problema

A ADR-0023 ativou as regras do vue-i18n, mas deixou o `no-raw-text` como
aviso, para não bloquear trechos técnicos da documentação. Com o tempo, o
`pnpm lint` acumulou 25 avisos que ninguém olhava:

- textos de interface fixos no template (cabeçalhos de tabela);
- trechos técnicos (caminhos, nomes de branch, uma versão de exemplo);
- placeholders como `<nome>` nos locales, que o `no-html-messages` toma por
  HTML;
- avisos de `localeDir` em JSON que não é locale (`e2e/tsconfig.json`).

Além disso, o `getErrorMessage` tinha fallbacks fixos em português. Como
manter o lint sem avisos e o texto de interface sempre traduzível?

## Drivers da decisão

- O lint termina sem avisos: um aviso novo não se perde entre os antigos.
- Texto que o usuário lê vem do locale, inclusive mensagens de erro.
- Trecho técnico não vira chave de tradução.
- As exceções são poucas e explícitas.

## Opções consideradas

- **`no-raw-text` como erro, com `ignoreNodes`, `ignorePattern` e
  `ignoreText` estreitos**, que foi a escolha;
- manter como aviso, o que não resolve o acúmulo;
- mover também os trechos técnicos para o locale, o que cria chaves que nunca
  seriam traduzidas;
- desligar a regra nos arquivos da documentação, o que deixa passar texto de
  interface real.

## Decisão

- `@intlify/vue-i18n/no-raw-text` passa a `error`, com exceções:
  - `ignoreNodes: ['code']`: o que está num `<code>` é técnico;
  - `ignorePattern`: texto feito só de pontuação (`:`, `.`, `—`);
  - `ignoreText`: lista curta de nomes técnicos exibidos como estão.
- Nova exceção exige motivo no comentário do `eslint.config.mjs`. Para um
  trecho técnico novo, prefira envolvê-lo em `<code>`.
- Nos locales, `<` e `>` de placeholders usam a interpolação literal do
  vue-i18n (`{'<'}nome{'>'}`), e o `no-html-messages` segue ativo.
- As configurações do vue-i18n (`localeDir`) valem para todos os arquivos.
- O `getErrorMessage` recebe os fallbacks (`ErrorMessageFallbacks`) por
  parâmetro e continua puro. O `useErrorMessage()` entrega a função com os
  textos de `errors.*` do locale ativo.

## Consequências

### Positivas

- `pnpm lint` sem erros nem avisos, e texto fixo novo quebra o CI.
- Mensagens de erro de API passam a ser traduzíveis.

### Negativas / trade-offs

- A interpolação literal deixa alguns textos do locale menos legíveis no
  JSON.
- O segundo parâmetro do `getErrorMessage` mudou de string opcional para
  objeto obrigatório. Quem chama de componente usa o `useErrorMessage()`.

### Neutras

- O `ignoreText` compara o texto inteiro (sem espaços nas pontas): `main`
  passa, `mainline` não.

## Referências

- `eslint.config.mjs`, `src/shared/utils/http-error.ts`,
  `src/shared/composables/useErrorMessage.ts`.
- [no-raw-text](https://eslint-plugin-vue-i18n.intlify.dev/rules/no-raw-text.html)
