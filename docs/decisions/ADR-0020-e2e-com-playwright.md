# ADR-0020: Testes E2E com Playwright (substitui o Cypress)

- **Status:** Aceita
- **Data:** 2026-10-29
- **Decisores:** Time de frontend / Arquitetura
- **Relacionadas:** ADR-0005 (substituída por esta), ADR-0011 (Fluxo de contribuição), ADR-0016 (Portões de qualidade), ADR-0017 (Autenticação fail-closed)

## Contexto e problema

A ADR-0005 adotou o Cypress para os testes E2E. Algumas equipes que partem do
template já usam o Playwright, e manter duas ferramentas de E2E na empresa
duplica conhecimento, exemplos e configuração de CI. Além disso, a suíte
Cypress do template:

- dependia de o desenvolvedor subir o `npm run dev` antes, na porta 9081, que
  pode estar ocupada por outro projeto;
- herdava o `.env.development.local` de cada máquina (com o mock de auth
  desligado, o fluxo de login falhava);
- não rodava no pipeline.

Qual ferramenta de E2E o template deve adotar, e como torná-la reproduzível?

## Drivers da decisão

- Uma única ferramenta de E2E entre as equipes.
- Suíte reproduzível: mesmo resultado na máquina do desenvolvedor e no CI.
- E2E como portão de qualidade no pipeline.
- Manter os seletores `data-cy` existentes, sem reescrever componentes.

## Opções consideradas

- **Playwright (`@playwright/test`), só Chromium, com `webServer`** — runner
  próprio com espera automática, sobe o Vite sozinho e roda no CI.
- **Manter o Cypress** — sem custo de migração, mas mantém a divergência com
  as equipes e os problemas de ambiente acima.
- **Playwright nos três motores (Chromium, Firefox, WebKit)** — mais cobertura
  de navegador, porém suíte cerca de 3x mais lenta e download maior; cada
  projeto pode ativar os outros motores no `playwright.config.ts`.

## Decisão

Substituímos o Cypress pelo **Playwright** (`@playwright/test`) nos testes E2E,
rodando no **Chromium**:

- Specs em `e2e/**/*.spec.ts`; helpers compartilhados em `e2e/support/`
  (ex.: `mockUserSession(page)` substitui o `cy.userLogin()`).
- `testIdAttribute: 'data-cy'`: os atributos `data-cy` continuam valendo e são
  lidos por `page.getByTestId(...)`.
- O `webServer` sobe o Vite na porta **9091**, no modo `test` (variáveis
  fictícias do `.env.test`) e com `VITE_AUTH_MOCK=true`. O modo `test` não é
  `production`, então o bloqueio do mock (ADR-0017) não é acionado.
- Job `e2e` no estágio `test` do CI: instala o Chromium
  (`npx playwright install --with-deps chromium`) e publica o relatório HTML
  como artefato.

A estratégia de testes unitários e de integração da ADR-0005 continua valendo:
Vitest + Vue Test Utils + happy-dom em `src/test/**/*.spec.ts`, Pinia real e
mock apenas do service/HTTP. Os pisos de cobertura seguem a ADR-0016.

## Consequências

### Positivas

- Mesma ferramenta de E2E que as equipes já usam.
- Suíte independente do `.env` local e de portas ocupadas.
- E2E passa a ser verificado no pipeline de todo MR.
- Asserções com espera automática e trace/screenshot em falhas.

### Negativas / trade-offs

- Cada desenvolvedor precisa baixar o Chromium uma vez
  (`npm run test:e2e:install`, cerca de 150 MB).
- O job `e2e` do CI baixa o Chromium a cada execução e precisa de acesso à
  internet no runner.
- Testes só no Chromium não detectam diferenças de Firefox/Safari.

### Neutras

- O atributo continua `data-cy` por compatibilidade; renomeá-lo para
  `data-testid` seria uma mudança separada nos componentes.

## Referências

- `playwright.config.ts`, `e2e/`, `.gitlab-ci.yml` (job `e2e`).
- `src/test/README.md` — seção "Testes E2E (Playwright)".
- `agent/skills/testing/SKILL.md`.
- [Documentação do Playwright](https://playwright.dev/docs/intro).
