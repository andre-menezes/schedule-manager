# ADR-0007: Toolchain de qualidade — ESLint flat config + Prettier

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0011

## Contexto e problema

O projeto precisa de análise estática e formatação consistente sem que as duas
ferramentas entrem em conflito. Além disso, o ESLint 10 usa flat config, o que
afeta como plugins são registrados. Como dividir responsabilidades entre linter
e formatador?

## Drivers da decisão

- Evitar conflito entre regras de estilo do ESLint e o Prettier.
- Compatibilidade com o flat config do ESLint 10.
- Formatação determinística e automática.

## Opções consideradas

- **ESLint só para qualidade + Prettier para formatação**, com
  `eslint-config-prettier` desativando regras estilísticas e o
  `eslint-plugin-prettier` registrado **manualmente**.
- **Usar o preset `pluginPrettier.configs.recommended`** — descartada: esse
  preset ainda usa a chave `extends` (formato eslintrc), incompatível com o flat
  config do ESLint 10.

## Decisão

O ESLint (flat config, em `eslint.config.mjs`) cuida apenas de regras de
qualidade e boas práticas; a formatação fica 100% a cargo do Prettier. O
`eslint-config-prettier` desliga regras estilísticas conflitantes, e o
`eslint-plugin-prettier` é registrado manualmente (sem o preset `recommended`)
por causa da incompatibilidade com o flat config.

## Consequências

### Positivas

- Sem conflito entre linter e formatador.
- Configuração compatível com o ESLint 10.

### Negativas / trade-offs

- Registro manual do plugin do Prettier é menos óbvio que usar o preset; exige o
  comentário explicativo no arquivo de config.

### Neutras

- Regras estilísticas do `eslint-plugin-vue` foram removidas para evitar
  conflito com o Prettier.

## Referências

- `eslint.config.mjs` — configuração e comentários explicativos.
- `.prettierrc` — regras de formatação.
- `docs/ARCHITECTURE-GUIDE.md` — Estilo de código.
- `docs/COMMIT-CONVENTIONS.md` — exemplo de corpo de commit sobre essa mudança.
