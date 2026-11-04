# ADR-0046: Identidade visual do template

- **Status:** Descontinuada
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0026 (vitrine removível), ADR-0036 (navegação
  acessível), ADR-0044 (paleta), ADR-0045 (componentes do design system)

> Nota (ADR-0047): a mudança desta ADR foi revertida a pedido do Andre, que
> preferiu o visual original do template (coral e azul). O texto fica como
> registro da decisão.

## Contexto e problema

Com a paleta e os componentes do design system Agenda no código (ADR-0044 e
ADR-0045), a casca do template ainda tinha a aparência de um projeto de
exemplo:

- cabeçalho escuro com o logo verde do Vue, fora da marca índigo;
- conteúdo sem largura de leitura, espalhado em telas largas;
- página inicial com só um título e um botão;
- 404 com uma ilustração coral da paleta antiga;
- na vitrine, blocos de código turquesa, cartões com borda escura, camadas
  em fundos coloridos e um painel com gradiente.

Como dar ao template uma identidade profissional e consistente, que um
projeto novo herde sem retrabalho?

## Drivers da decisão

- Seguir os princípios do design system: interface quase neutra, cor nas
  ações e nos eventos, borda no lugar de sombra.
- Uma marca própria, que funcione nos dois temas.
- Contraste AA verificado pelo axe em todas as páginas.
- Nenhuma dependência ou asset de terceiros novo.

## Opções consideradas

- **Refazer a casca e as páginas sobre os componentes do design system** —
  escolhida.
- **Trocar só o logo e as cores** — mantém o layout espalhado e a página
  inicial vazia.
- **Um tema pronto de terceiros (template de admin)** — dependência grande e
  visual que não é o do Figma.

## Decisão

- **Marca:** `BaseLogo` vira um bloco na cor `primary` com três camadas
  empilhadas (a arquitetura em camadas), em SVG que segue o tema; o
  `public/favicon.svg` usa a mesma marca, no índigo do tema claro.
- **Cabeçalho:** superfície clara (`surface`) com borda inferior e sem
  sombra; logo e nome do app viram um link para o início.
- **Menu lateral:** densidade compacta, ícones de 20px, itens com raio de
  4px, e grupos pelo novo `meta.nav.groupKey` (as telas da vitrine ficam em
  "Documentação do template"); no modo rail, o título do grupo vira um
  divisor. Rodapé com a versão, discreto.
- **Largura de leitura:** o `DefaultLayout` limita o conteúdo a 1200px, com
  margens que crescem com a tela; as telas não somam padding vertical
  próprio.
- **Página inicial:** painel de boas-vindas em `primary-container`, com os
  links para a documentação e o CRUD de exemplo (quando os módulos existem),
  e três próximos passos (criar módulo, testar, publicar).
- **404:** o número em destaque na cor primária, com "Voltar para o início"
  e "Voltar". A ilustração da Storyset sai, e com ela a atribuição exigida.
- **Vitrine:** blocos de código em `surface-light` com borda e fonte
  monoespaçada do sistema; cartões com a borda padrão; camadas em cartões
  neutros com o ícone colorido; o painel de fluxo de trabalho em
  `primary-container`, sem gradiente.

## Consequências

### Positivas

- O template se apresenta com uma marca coerente com o design system.
- Projetos novos herdam cabeçalho, menu, largura e página inicial prontos.
- Menos CSS próprio: saem os gradientes e as regras de logo do `main.scss`.

### Negativas / trade-offs

- O visual de todas as telas muda de uma vez; capturas e documentação
  externas ficam desatualizadas.
- A marca é genérica de propósito: cada projeto deve trocar o `BaseLogo` pela
  própria (passo do `docs/NEW-PROJECT.md`).

### Neutras

- O `groupKey` é opcional: rotas sem ele continuam aparecendo no topo do
  menu, como antes.

## Referências

- `src/shared/ui/components/BaseLogo.vue`, `TheAppHeader.vue`,
  `TheNavigationMenu.vue`, `src/shared/ui/layouts/DefaultLayout.vue`,
  `src/modules/home/views/HomeView.vue`, `src/app/views/NotFoundView.vue`.
