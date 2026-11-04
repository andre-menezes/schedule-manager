# ADR-0012: Vuetify 4 como framework de UI

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0009; ADR-0013 (atualiza a escolha do conjunto de ícones)

> **Nota:** a decisão de ícones desta ADR (`@mdi/font`) foi posteriormente
> atualizada pela [ADR-0013](ADR-0013-material-symbols-icones.md), que migra o
> projeto para o Material Symbols. As demais decisões (Vuetify 4, auto-import,
> chunking) permanecem válidas.

## Contexto e problema

O template precisa de uma biblioteca de componentes de UI consistente, com tema
e ícones padronizados, e de um bundle organizado para produção. Qual biblioteca
de UI adotar e como integrá-la ao build?

## Drivers da decisão

- Conjunto de componentes pronto e coeso.
- Uso direto dos componentes nos templates (sem imports manuais repetitivos).
- Bundle de produção organizado (separação de vendors).

## Opções consideradas

- **Vuetify 4 + `vite-plugin-vuetify` (auto-import) + `@mdi/font` + chunking
  manual de vendors.**

> Não há outra biblioteca de UI avaliada e descartada na documentação. A decisão
> foi herdada da concepção do template.

## Decisão

Adotamos o **Vuetify 4** como framework de UI, com `vite-plugin-vuetify`
(`autoImport: true`) para uso direto dos componentes nos templates. O tema é
configurado em `src/app/providers/vuetify.ts` e os ícones vêm do `@mdi/font`
(prefixo `mdi-`). O build separa vendors em chunks manuais
(`vendor-vue`, `vendor-vuetify`, `vendor-i18n`).

## Consequências

### Positivas

- Componentes prontos e consistentes, sem imports manuais.
- Bundle organizado por vendor, favorecendo cache do navegador.

### Negativas / trade-offs

- Acoplamento à API e ao ciclo de versões do Vuetify.
- Auto-import depende do plugin específico do Vite.

### Neutras

- Ícones atrelados ao conjunto Material Design Icons (`@mdi/font`).

## Referências

- `package.json` — `vuetify`, `vite-plugin-vuetify`, `@mdi/font`.
- `vite.config.ts` — plugin do Vuetify e `manualChunks`.
- `src/app/providers/vuetify.ts` — configuração de tema.
- `agent/skills/vue-vuetify-dev/SKILL.md` — convenções Vuetify.
