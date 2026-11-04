# Novo projeto a partir do template

Passo a passo para começar um projeto em cima do Vue Template: criar o
repositório, limpar os exemplos, dar nome ao projeto e validar. Leva cerca de
15 minutos.

Voltar para o índice: [README.md](README.md)

---

## 1. Criar o repositório

No GitHub, abra o repositório do template e clique em **Use this template →
Create a new repository**. O projeto novo nasce sem o histórico do template.

Sem acesso ao botão, clone e recomece o histórico:

```bash
git clone https://github.com/andre-menezes/vue-template.git meu-projeto
cd meu-projeto
rm -rf .git && git init -b main
```

Depois, crie a `develop` (toda mudança entra por PR nela; ver o
[CONTRIBUTING](../CONTRIBUTING.md)):

```bash
git checkout -b develop
```

## 2. Instalar e conferir

Siga os pré-requisitos do [CONTRIBUTING](../CONTRIBUTING.md#pré-requisitos)
(Node da `.nvmrc` e pnpm via `corepack`), depois:

```bash
pnpm install
pnpm test:e2e:install
pnpm lint && pnpm build && pnpm test
```

Tudo passando aqui confirma que o ambiente está certo antes de mexer em algo.

## 3. Remover os exemplos

```bash
pnpm template:clean
```

O script apaga:

| O que                              | Onde                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Vitrine de documentação (ADR-0026) | `src/modules/showcase`, `src/test/showcase`, `e2e/showcase`            |
| CRUD de exemplo (ADR-0039)         | `src/modules/customers`, `src/test/customers`, `e2e/customers.spec.ts` |
| Endpoints simulados de clientes    | `mock/customers.ts` e o teste dele; `mock/handlers.ts` fica sem rotas  |
| O próprio script                   | `scripts/template-clean.mjs` e o `template:clean` do `package.json`    |

Continuam: a página inicial (`modules/home`), a 404, toda a infraestrutura
(`app`, `core`, `shared`, `types`), a API simulada sem rotas (`mock/`), os
testes dela e a documentação em `docs/`.

## 4. Dar nome ao projeto

| Arquivo                               | O que trocar                                                         |
| ------------------------------------- | -------------------------------------------------------------------- |
| `package.json`                        | `name` (ex.: `meu-projeto`) e `version` (`0.1.0`)                    |
| `index.html`                          | `<title>` (aparece até o app carregar)                               |
| `src/core/config/index.ts`            | Padrão do `APP_NAME` (ou defina `VITE_APP_NAME` em cada ambiente)    |
| `src/app/locales/*.json`              | `welcome.*`: texto da página inicial, nos dois locales               |
| `src/modules/home/views/HomeView.vue` | A página inicial do projeto                                          |
| `public/favicon.svg`, `BaseLogo.vue`  | Ícone e logo                                                         |
| `src/app/providers/vuetify.ts`        | Cores do tema (mantenha os tons `-text` com contraste AA — ADR-0029) |
| `LICENSE.md`                          | Titular e tipo de licença                                            |
| `README.md`, `CONTRIBUTING.md`        | Nome e descrição do projeto                                          |
| `.github/workflows/ci.yml`            | Comentário com o nome do projeto                                     |

Os testes que conferem o nome padrão (`HomeView.spec.ts`, `config.spec.ts`,
`route-title.spec.ts`) acompanham a troca: rode `pnpm test` e ajuste os textos
esperados.

## 5. Limpar a documentação do template

- `CHANGELOG.md`: apague as versões do template e comece em
  `## [Não lançado]`.
- `docs/ROADMAP.md`: é o roadmap do template. Troque pelo do projeto ou apague
  (e tire do `docs/README.md`).
- `docs/specs/`: apague o `FEAT-001` do CRUD de exemplo; as specs do projeto
  entram aqui.
- `docs/decisions/`: **mantenha** as ADRs. Elas explicam por que o código é
  como é; as do projeto continuam a numeração. As ADRs 0026 e 0039 falam de
  módulos removidos e ficam como histórico.
- `docs/I18N-MIGRATION-PLAN.md`: histórico da migração do template; pode
  apagar.
- `agent/`: mantenha se o time usa Claude Code, Cursor ou Kiro (ADR-0006).
  Apague os adapters das ferramentas que ninguém usa (`.cursorrules`, `.kiro/`).

## 6. Configurar o ambiente

Todas as variáveis têm valor padrão: o projeto roda sem `.env`. Para mudar,
copie o [.env.example](../.env.example) para `.env.development.local`.

| Variável                  | Quando definir                                                     |
| ------------------------- | ------------------------------------------------------------------ |
| `VITE_APP_NAME`           | Nome no cabeçalho e no título da aba                               |
| `VITE_API_BASE_URL`       | URL da API real; com uma URL absoluta, a API simulada não atua     |
| `VITE_APP_DEFAULT_LOCALE` | Idioma inicial (`pt-BR` ou `en-US`)                                |
| `API_MOCK`                | `false` para desligar a API simulada com uma base relativa (proxy) |
| `VITE_SENTRY_DSN`         | Liga o envio de erros ao Sentry (ADR-0043)                         |

## 7. Configurar o repositório

- Proteja a `main` e a `develop`: PR obrigatório e os jobs do CI (`lint`,
  `build`, `test`, `e2e`) como checks obrigatórios.
- Crie as labels de `.github/labels.md`.
- Confira o `.github/dependabot.yml` (ADR-0035).

## 8. Preparar o deploy

A imagem de produção (Docker + Nginx) já vem pronta: veja o
[DEPLOY.md](DEPLOY.md). Defina as `VITE_*` de cada ambiente por
`--build-arg` e, se a API estiver em outro domínio, a `CSP_CONNECT_SRC`.

## 9. Validar e fazer o primeiro commit

```bash
pnpm lint && pnpm build && pnpm test:coverage && pnpm test:e2e
git add -A
git commit -m "chore: iniciar o projeto a partir do vue-template"
```

O piso de cobertura (`vite.config.ts`, ADR-0016) continua em
100/98/100/100: código novo entra com teste.

## Próximo passo

Crie o primeiro módulo seguindo o [ONBOARDING.md](ONBOARDING.md). Antes do
`template:clean`, o módulo `customers` é o exemplo completo a copiar; depois,
ele continua no repositório do template.
