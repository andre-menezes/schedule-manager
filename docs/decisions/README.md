# docs/decisions — Architecture Decision Records (ADR)

Registro das decisões arquiteturais do projeto no formato
[MADR](https://adr.github.io/madr/) (Markdown Architectural Decision Records),
com conteúdo em **português**.

Voltar para o guia geral: [../ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

## O que é uma ADR

Uma ADR documenta uma decisão arquitetural relevante: o **contexto**, as
**opções consideradas**, a **decisão** tomada e suas **consequências**. Serve
para preservar o "porquê" das escolhas ao longo do tempo, facilitando onboarding
e revisões futuras.

## Quando criar uma ADR

Crie uma ADR quando a decisão:

- introduz ou remove uma biblioteca/ferramenta relevante;
- define ou altera um padrão arquitetural (camadas, fluxo de dados, auth);
- escolhe entre mais de uma abordagem válida;
- estabelece uma convenção transversal que o time deve seguir.

Decisões triviais ou puramente locais **não** precisam de ADR.

## Como criar

1. Copie o template `agent/templates/adr.md`.
2. Renomeie para `docs/decisions/ADR-XXXX-<slug>.md`, usando o próximo número
   sequencial com 4 dígitos (ex.: `ADR-0013-cache-de-requisicoes.md`).
3. Preencha todas as seções e defina o status inicial (`Proposta`).
4. Ao ser aprovada, altere o status para `Aceita`.
5. Adicione a ADR à tabela de índice abaixo.

## Convenção de nomes

- Arquivo: `ADR-XXXX-<slug>.md` (`XXXX` = número com 4 dígitos; `<slug>` em
  kebab-case).
- `ADR-0000-template.md` é um exemplo de preenchimento (não é decisão real).

## Ciclo de status

| Status          | Significado                                       |
| --------------- | ------------------------------------------------- |
| `Proposta`      | Em discussão, ainda não vigente.                  |
| `Aceita`        | Aprovada e em vigor.                              |
| `Substituída`   | Trocada por outra ADR (referenciar a substituta). |
| `Descontinuada` | Não se aplica mais, sem substituta direta.        |

Uma ADR nunca é apagada: para reverter uma decisão, crie uma nova ADR que
substitui a anterior e atualize o status da antiga.

## Índice

| ADR                                                            | Título                                                        | Status        |
| -------------------------------------------------------------- | ------------------------------------------------------------- | ------------- |
| [ADR-0001](ADR-0001-arquitetura-em-camadas.md)                 | Arquitetura em camadas e regras de dependência                | Aceita        |
| [ADR-0002](ADR-0002-camada-http-factory-ofetch.md)             | Camada HTTP via factory `createApiInstance` + ofetch          | Aceita        |
| [ADR-0003](ADR-0003-autenticacao-no-router-guard.md)           | Autenticação OAuth centralizada no router guard               | Descontinuada |
| [ADR-0004](ADR-0004-roteamento-auto-discovery.md)              | Roteamento por auto-discovery via `import.meta.glob`          | Aceita        |
| [ADR-0005](ADR-0005-estrategia-de-testes.md)                   | Estratégia de testes (Vitest + Vue Test Utils + Cypress)      | Substituída   |
| [ADR-0006](ADR-0006-nucleo-agentico.md)                        | Núcleo de desenvolvimento agêntico em `agent/` com adapters   | Aceita        |
| [ADR-0007](ADR-0007-toolchain-eslint-prettier.md)              | Toolchain de qualidade: ESLint flat + Prettier                | Aceita        |
| [ADR-0008](ADR-0008-gestao-versao-node.md)                     | Gestão da versão do Node (22.23.2 + engine-strict + vfox)     | Substituída   |
| [ADR-0009](ADR-0009-estado-e-organizacao-shared.md)            | Padrões de estado e organização do `shared/`                  | Aceita        |
| [ADR-0010](ADR-0010-tipagem-e-aliases.md)                      | Tipagem centralizada, aliases e env em `@app/config`          | Aceita        |
| [ADR-0011](ADR-0011-fluxo-de-contribuicao.md)                  | Fluxo de contribuição: commits, hooks e CI                    | Aceita        |
| [ADR-0012](ADR-0012-vuetify-como-ui.md)                        | Vuetify 4 como framework de UI                                | Aceita        |
| [ADR-0013](ADR-0013-material-symbols-icones.md)                | Migração de ícones para o Material Symbols                    | Aceita        |
| [ADR-0014](ADR-0014-persistencia-de-sessao-em-cookie.md)       | Persistência de sessão em cookie HttpOnly                     | Descontinuada |
| [ADR-0015](ADR-0015-bff-csrf-state-logout.md)                  | Integração BFF — CSRF, state do OAuth e logout no backend     | Descontinuada |
| [ADR-0016](ADR-0016-portoes-de-qualidade-efetivos.md)          | Portões de qualidade efetivos (typecheck, cobertura, env)     | Aceita        |
| [ADR-0017](ADR-0017-autenticacao-fail-closed.md)               | Autenticação fail-closed (state, erro, 401, mock)             | Descontinuada |
| [ADR-0018](ADR-0018-camada-core-e-regras-de-camada.md)         | Camada `core` e regras de camada verificadas pelo ESLint      | Aceita        |
| [ADR-0019](ADR-0019-node-24-lts.md)                            | Atualização do Node para a linha 24 LTS (24.22.2)             | Aceita        |
| [ADR-0020](ADR-0020-e2e-com-playwright.md)                     | Testes E2E com Playwright (substitui o Cypress)               | Aceita        |
| [ADR-0021](ADR-0021-remocao-da-autenticacao-corporativa.md)    | Remoção da autenticação corporativa e páginas públicas        | Aceita        |
| [ADR-0022](ADR-0022-github-como-hospedagem-e-ci.md)            | GitHub como hospedagem e CI com GitHub Actions                | Aceita        |
| [ADR-0023](ADR-0023-otimizacao-de-fontes-e-i18n.md)            | Fontes auto-hospedadas e mensagens de i18n pré-compiladas     | Aceita        |
| [ADR-0024](ADR-0024-pnpm-como-gerenciador-de-pacotes.md)       | pnpm como gerenciador de pacotes                              | Aceita        |
| [ADR-0025](ADR-0025-colocalizacao-por-modulo.md)               | Colocalização do código de cada feature no próprio módulo     | Aceita        |
| [ADR-0026](ADR-0026-vitrine-em-modulo-removivel.md)            | Vitrine de documentação num módulo removível                  | Aceita        |
| [ADR-0027](ADR-0027-tanstack-query-para-dados-assincronos.md)  | TanStack Query para dados assíncronos                         | Aceita        |
| [ADR-0028](ADR-0028-tratamento-global-de-erros.md)             | Tratamento global de erros e remoção do analytics             | Aceita        |
| [ADR-0029](ADR-0029-acessibilidade-verificada-no-e2e.md)       | Acessibilidade verificada no E2E e tons de texto no tema      | Aceita        |
| [ADR-0032](ADR-0032-chunks-de-vendor.md)                       | Chunks de vendor com `codeSplitting.groups` do Rolldown       | Aceita        |
| [ADR-0033](ADR-0033-no-unchecked-indexed-access.md)            | `noUncheckedIndexedAccess` ativo no TypeScript                | Aceita        |
| [ADR-0034](ADR-0034-ci-com-actions-fixadas-por-sha.md)         | CI com actions fixadas por SHA, setup e timeout               | Aceita        |
| [ADR-0035](ADR-0035-dependabot.md)                             | Dependabot para atualização de dependências                   | Aceita        |
| [ADR-0036](ADR-0036-navegacao-acessivel.md)                    | Navegação acessível: título por rota, foco e link de pular    | Aceita        |
| [ADR-0037](ADR-0037-textos-de-interface-no-i18n.md)            | Textos de interface sempre no i18n, com exceções técnicas     | Aceita        |
| [ADR-0038](ADR-0038-suporte-a-multiplos-locales.md)            | Suporte a múltiplos locales, começando pelo en-US             | Aceita        |
| [ADR-0039](ADR-0039-crud-de-exemplo-e-api-simulada.md)         | CRUD de exemplo (`customers`) e API simulada no `pnpm dev`    | Aceita        |
| [ADR-0040](ADR-0040-notificacoes-e-erro-global-de-gravacao.md) | Notificações globais e erro de gravação notificado            | Aceita        |
| [ADR-0041](ADR-0041-deploy-com-docker-e-nginx.md)              | Deploy em imagem Docker com Nginx                             | Aceita        |
| [ADR-0042](ADR-0042-formularios-com-vee-validate-e-zod.md)     | Formulários com VeeValidate e Zod                             | Aceita        |
| [ADR-0043](ADR-0043-monitoramento-de-erros-com-sentry.md)      | Monitoramento de erros com o Sentry, opcional                 | Aceita        |
| [ADR-0044](ADR-0044-paleta-do-design-system-agenda.md)         | Paleta do design system Agenda                                | Descontinuada |
| [ADR-0045](ADR-0045-componentes-base-do-design-system.md)      | Componentes base e padrões do design system Agenda            | Descontinuada |
| [ADR-0046](ADR-0046-identidade-visual-do-template.md)          | Identidade visual do template                                 | Descontinuada |
| [ADR-0047](ADR-0047-retorno-ao-visual-original.md)             | Retorno ao visual original do template                        | Aceita        |
| [ADR-0048](ADR-0048-evento-unico-e-conta-individual.md)        | Evento único para compromisso e atendimento, conta individual | Aceita        |
| [ADR-0049](ADR-0049-backend-api-rest-separada.md)              | Backend como API REST separada, contrato OpenAPI primeiro     | Proposta      |
| [ADR-0050](ADR-0050-autenticacao-por-sessao-em-cookie.md)      | Autenticação e-mail/senha e Google, sessão em cookie          | Proposta      |
| [ADR-0051](ADR-0051-datas-fusos-e-recorrencia.md)              | Datas em UTC com fuso IANA e recorrência pela RFC 5545        | Proposta      |
| [ADR-0052](ADR-0052-grade-do-calendario.md)                    | Grade do calendário — decidir por spike                       | Proposta      |
| [ADR-0053](ADR-0053-lembretes-e-notificacoes.md)               | Lembretes e notificações processados pelo backend             | Proposta      |
| [ADR-0054](ADR-0054-privacidade-e-lgpd.md)                     | Privacidade e LGPD desde o MVP                                | Aceita        |
| [ADR-0055](ADR-0055-modulos-do-frontend.md)                    | Módulos do frontend do Agenda                                 | Aceita        |
| [ADR-0056](ADR-0056-pwa-instalavel.md)                         | PWA instalável no MVP, sem app nativo                         | Proposta      |

As ADRs 0001–0047 vêm do `vue-template` e explicam a base do código; as do
Agenda começam na 0048. As ADRs 0026 e 0039 falam de módulos removidos na
criação do projeto e ficam como histórico.
