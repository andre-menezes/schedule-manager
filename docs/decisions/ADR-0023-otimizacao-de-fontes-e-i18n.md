# ADR-0023: Fontes auto-hospedadas e mensagens de i18n pré-compiladas

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0012 (Vuetify), ADR-0013 (Material Symbols)

## Contexto e problema

O build de produção tinha 4,8 MB. Medido no `dist`:

- A fonte de ícones (`material-symbols-outlined.woff2`) tinha 3,96 MB. Ela é
  variável em quatro eixos (FILL, wght, GRAD, opsz), mas o template só usa
  peso 400, grade 0 e tamanho óptico 24, e alterna apenas o FILL.
- A Inter vinha do Google Fonts por um `@import` no `main.scss`. Isso cria uma
  requisição bloqueante a um terceiro, que também fica fora da política de
  conteúdo do app.
- O chunk do vue-i18n tinha 123 KB porque incluía o compilador de mensagens,
  usado em runtime para compilar o `pt-BR.json`.

Como reduzir o peso sem mudar a forma de usar ícones, fonte e traduções?

## Drivers da decisão

- Nenhuma mudança na API dos componentes: `icon="home"`, `icon="star-fill"` e
  `$t('chave')` continuam iguais.
- Todos os ícones do Material Symbols continuam disponíveis, sem lista manual.
- Nenhuma requisição a terceiros em runtime.

## Opções consideradas

Ícones:

- **Subset por nome de ícone** — menor arquivo, mas exige manter a lista dos
  ícones usados; um ícone novo fora da lista aparece como texto.
- **Ícones SVG sob demanda** — muda a API de uso e exige registrar cada ícone.
- **Fixar os eixos não usados (instancing)** — escolhida. Mantém todos os
  ícones e o eixo FILL.

Inter: `@fontsource-variable/inter` (escolhida) ou copiar os arquivos à mão.

i18n: `@intlify/unplugin-vue-i18n` (escolhida), que pré-compila os JSON de
locale em build e permite remover o compilador do bundle.

## Decisão

- A fonte de ícones é gerada por `scripts/build-icon-font.sh` (fonttools) a
  partir do pacote `material-symbols`, com `wght=400 GRAD=0 opsz=24`, e
  versionada em `src/app/styles/fonts/`. O `@font-face` e a classe
  `.material-symbols-outlined` ficam em `src/app/styles/icons.scss`, que
  substitui o import de `material-symbols/outlined.css`.
- A Inter vem de `@fontsource-variable/inter`, importada em
  `@app/providers/vuetify`. A família é `Inter Variable`.
- As variáveis SASS do Vuetify vão para `src/app/styles/settings.scss`, passado
  ao `vite-plugin-vuetify` (`styles.configFile`). Assim elas valem também para
  o CSS de cada componente, e não só para os estilos globais.
- O `@intlify/unplugin-vue-i18n` pré-compila `src/app/locales/*.json`, com
  `dropMessageCompiler: true`. Toda mensagem precisa vir desses arquivos.
- O `@intlify/eslint-plugin-vue-i18n` passa a ser usado: chave inexistente e
  chave órfã no JSON são erro; texto fixo no template é aviso.

## Consequências

### Positivas

- O `dist` caiu de 4,8 MB para 1,6 MB; a fonte de ícones, de 3,96 MB para
  458 KB; o chunk do vue-i18n, de 123 KB para 101 KB.
- O app não faz mais requisições ao Google Fonts.

### Negativas / trade-offs

- Ao atualizar o `material-symbols`, é preciso rodar
  `scripts/build-icon-font.sh`, que requer Python com `fonttools` e `brotli`.
- Ícones em outro peso, grade ou tamanho óptico deixam de ser possíveis sem
  gerar a fonte de novo.
- Mensagens criadas em runtime (fora dos JSON de locale) não são compiladas.

### Neutras

- Os 188 KB de CSS global do Vuetify são classes utilitárias (`ma-*`,
  `text-*`, `d-flex` etc.), não CSS de componentes duplicado. Desligar o
  pacote de cores economizaria 24 KB, mas removeria classes em uso, como
  `text-white`.

## Referências

- `scripts/build-icon-font.sh`, `src/app/styles/icons.scss`,
  `src/app/styles/settings.scss`, `vite.config.ts`, `eslint.config.mjs`.
- [fonttools varLib.instancer](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html)
- [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
