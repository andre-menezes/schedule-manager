# ADR-0036: Navegação acessível: título por rota, foco e link de pular

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0004 (rotas por auto-discovery), ADR-0029 (axe no E2E)

## Contexto e problema

Numa SPA, trocar de página não recarrega o documento. Por isso:

- o título da aba ficava fixo no nome da aplicação, em todas as páginas;
- depois de clicar num link do menu, o foco ficava no link, e o leitor de
  tela não anunciava a página nova;
- quem usa teclado passava pelo header e por todo o menu antes de chegar ao
  conteúdo.

O axe não aponta nenhum desses problemas, porque eles dependem da navegação.
Como dar às trocas de rota o mesmo retorno que uma página nova daria?

## Drivers da decisão

- Um módulo novo declara o título da página na própria rota, como já faz com
  o `meta.nav`, sem editar arquivos centrais.
- O título é traduzido e acompanha a troca de idioma.
- A rolagem continua a cargo do `scrollBehavior` do router, inclusive até o
  hash.
- Nenhuma dependência nova.

## Opções consideradas

- Título:
  - **`meta.titleKey` (chave i18n) na rota, aplicado por um composable na
    raiz**, que foi a escolha;
  - cada view define o próprio título (`document.title` no `setup`), o que
    repete código e deixa páginas sem título;
  - biblioteca de head (`@unhead/vue`), que é mais do que o template precisa.
- Foco:
  - **focar o `<main>` (`tabindex="-1"`) depois de cada navegação**, que foi
    a escolha;
  - focar o `<h1>` de cada view, o que exige marcar o heading em todas as
    páginas;
  - uma região `aria-live` que anuncia o título, que não tira o foco do link
    antigo.

## Decisão

- O `RouteMeta` ganha `titleKey?: string`. Toda rota declara a sua, no
  namespace `pageTitle` do locale do módulo. Um teste exige que toda rota do
  app tenha `titleKey` e que a chave exista no locale.
- O `useRouteTitle()` (`@shared/composables`), chamado no `App.vue`, grava
  `"<título traduzido> · <APP_NAME>"` no `document.title`, ou só o
  `APP_NAME` quando a rota não tem `titleKey`. Ele reage à navegação e à troca
  de locale.
- O `useRouteFocus()`, também no `App.vue`, foca o elemento de id
  `MAIN_CONTENT_ID` (`@core/config`) depois de cada navegação, com
  `preventScroll`. Não move o foco no carregamento inicial nem quando muda só
  o hash ou a query da mesma página.
- Os dois layouts dão ao `<v-main>` esse id e `tabindex="-1"`.
- O `DefaultLayout` começa com o link "Pular para o conteúdo". Ele fica fora da
  tela até receber foco e então leva o foco ao `<main>`. Usa as cores de
  superfície do tema, com contraste nos dois temas.

## Consequências

### Positivas

- Cada página tem título próprio na aba, no histórico e nos favoritos.
- Leitores de tela começam a página nova pelo conteúdo, e o teclado pula o
  menu com um Tab e um Enter.
- O E2E cobre o título, o foco e o link de pular.

### Negativas / trade-offs

- Toda rota nova precisa de uma chave em `pageTitle`. O lint não rastreia
  chaves usadas por variável (`pageTitle.*` está nas exceções do
  `no-unused-keys`); o teste de rotas cobre essa lacuna.
- O `<main>` focado não mostra contorno, para não destacar a página inteira.

### Neutras

- O título não é renderizado no servidor; para SEO de SPA, isso não muda.

## Referências

- `src/shared/composables/useRouteTitle.ts`,
  `src/shared/composables/useRouteFocus.ts`,
  `src/shared/ui/layouts/DefaultLayout.vue`.
- `e2e/navigation.spec.ts`, `e2e/showcase/navigation.spec.ts`.
- [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks)
  e [2.4.2 Page Titled](https://www.w3.org/WAI/WCAG21/Understanding/page-titled).
