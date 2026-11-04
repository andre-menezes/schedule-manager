# ADR-0019: Atualização do Node para a linha 24 LTS (24.22.2)

- **Status:** Aceita
- **Data:** 2026-10-29
- **Decisores:** Time de frontend / Arquitetura
- **Relacionadas:** ADR-0008 (substituída por esta), ADR-0011 (Fluxo de contribuição)

> Nota (2026-10-30): o campo `engines` do `package.json` passou a aceitar a
> linha 24 inteira a partir da 24.22.2 (`>=24.22.2 <25`). A versão exata
> continua em `.nvmrc` e `.tool-versions`, que definem o que o vfox, o nvm e o
> CI instalam. Com a versão exata em `engines`, qualquer outro patch da linha
> 24 bloqueava o `npm install` sem ganho de reprodutibilidade.
>
> Nota (ADR-0024): o gerenciador passou a ser o pnpm, que também respeita o
> `engine-strict` do `.npmrc`.

## Contexto e problema

A ADR-0008 fixou o Node em **22.23.2**. A linha 24 (Krypton) é a LTS ativa,
com suporte mais longo que a 22, e os tipos do projeto (`@types/node` 24.x) já
seguiam essa linha, divergindo do runtime. Qual versão o template deve fixar
para que novos projetos nasçam numa LTS com o maior suporte disponível?

## Drivers da decisão

- Partir de uma LTS ativa, com a janela de suporte mais longa possível.
- Alinhar runtime e tipos (`@types/node` 24.x).
- Manter a reprodutibilidade da ADR-0008: versão exata, `engine-strict` e vfox.

## Opções consideradas

- **Node 24.22.2 (última release LTS da linha 24)** — LTS ativa, alinhada aos
  tipos; mantém todo o mecanismo de travamento da ADR-0008.
- **Manter Node 22.23.2** — sem custo de migração, mas a 22 está em
  manutenção, com suporte mais curto, e continua divergindo de `@types/node`.
- **Node 26** — linha mais nova, ainda não LTS; não indicada como base de
  projetos.

## Decisão

Fixamos o Node na versão exata **24.22.2** em `.nvmrc`, `.tool-versions`,
`engines` do `package.json` e na imagem do CI (`node:24.22.2`). Todo o resto
da ADR-0008 continua valendo: `engine-strict=true`, `save-exact=true` e vfox
como gerenciador recomendado.

## Consequências

### Positivas

- Template baseado na LTS ativa, com suporte mais longo.
- Runtime e `@types/node` na mesma linha.

### Negativas / trade-offs

- Cada desenvolvedor precisa instalar o Node 24.22.2 (`vfox install nodejs`)
  antes do próximo `npm install`, que falha com `EBADENGINE` em outra versão.

### Neutras

- Patches futuros da linha 24 seguem o mesmo processo: alterar os arquivos de
  versão e a imagem do CI.

## Referências

- `.nvmrc`, `.tool-versions`, `.npmrc`, `package.json` (`engines`), `.github/workflows/ci.yml`.
- `CONTRIBUTING.md` — seção sobre vfox e `engine-strict`.
- [Calendário de releases do Node.js](https://nodejs.org/en/about/previous-releases).
