# ADR-0029: Acessibilidade verificada no E2E e tons de texto no tema

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0020 (Testes E2E com Playwright)

## Contexto e problema

Nada verificava acessibilidade. A primeira varredura com o axe nas páginas do
template encontrou violações WCAG 2.1 A/AA em todas elas:

- o menu lateral tinha `role=list` com links como filhos;
- os tooltips do bloco de código não tinham nome acessível;
- o `<pre>` com rolagem não recebia foco pelo teclado;
- os textos coloridos não tinham contraste suficiente. A paleta da marca
  usada como cor de texto sobre o fundo claro fica abaixo de 4,5:1; o primary
  `#FF8066`, por exemplo, fica em 2,3:1.

## Drivers da decisão

- Regressões de acessibilidade devem falhar no CI, como as de comportamento.
- A identidade visual (paleta da marca em botões, fundos e bordas) deve ser
  mantida.

## Opções consideradas

- Checagem: **axe no E2E (`@axe-core/playwright`, devDependency)**, que foi a
  escolha, ou nenhuma checagem automática.
- Contraste:
  - **tons de texto separados no tema**, que foi a escolha;
  - escurecer a paleta inteira do tema claro;
  - desligar a regra `color-contrast`.

## Decisão

- `e2e/support/a11y.ts` expõe `expectNoA11yViolations(page)`, que roda o axe
  com as tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`. Toda página com E2E
  usa o helper.
- O tema ganha as cores `primary-text`, `secondary-text`, `accent-text`,
  `info-text`, `success-text` e `warning-text`:
  - No tema claro, são tons com contraste AA sobre o fundo e a superfície.
  - No tema escuro, repetem a paleta, que já tem contraste suficiente.
- Texto colorido usa `text-<cor>-text` (ou `color="<cor>-text"` em chips de
  texto). A cor da marca fica para fundos, bordas e botões.
- A opacidade de média ênfase do tema claro sobe de 0,6 para 0,7.

## Consequências

### Positivas

- Contraste, nomes acessíveis e foco viram parte do CI.
- A marca não muda em botões e superfícies.

### Negativas / trade-offs

- Mais uma devDependency, e o E2E fica alguns segundos mais lento.
- Quem escreve texto colorido precisa lembrar do sufixo `-text`; o axe aponta
  quando esquece.

### Neutras

- O axe cobre só o que é automatizável; navegação por teclado e leitores de
  tela ainda pedem revisão manual.

## Referências

- `e2e/support/a11y.ts`, `src/app/providers/vuetify.ts`.
- [axe-core rules](https://dequeuniversity.com/rules/axe/)
