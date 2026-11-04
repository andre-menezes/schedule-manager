# ADR-0047: Retorno ao visual original do template

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0029 (contraste AA), ADR-0044, ADR-0045 e ADR-0046
  (descontinuadas por esta)

## Contexto e problema

Entre os PRs #39 e #41, o template trocou de visual: paleta índigo do design
system Agenda (ADR-0044), componentes e padrões desse design system
(ADR-0045) e uma nova identidade (ADR-0046). Uma terceira proposta, com o
design do kit Vora, ficou no PR #42. Depois de ver o resultado, Andre
preferiu o visual original, com o coral e o azul como cores principais.

## Drivers da decisão

- Voltar ao visual que o Andre aprovou, de forma exata e verificável.
- Manter no histórico o que foi tentado e por que saiu.

## Opções consideradas

- **Reverter os merges dos PRs #41, #40 e #39 e fechar o #42** — escolhida:
  o código volta exatamente ao estado anterior ao #39.
- **Ajustar só as cores da paleta atual** — manteria a fonte, os
  componentes e a identidade nova, que também saíram do gosto do Andre.

## Decisão

- Os merges dos PRs #41, #40 e #39 são revertidos, nessa ordem. O `src/`, os
  testes e a configuração ficam idênticos aos da `develop` antes do #39.
- O PR #42 (design Vora) é fechado sem merge.
- As ADRs 0044, 0045 e 0046 voltam ao repositório como **Descontinuadas**,
  para registrar a decisão (uma ADR nunca é apagada).

## Consequências

### Positivas

- O visual original volta inteiro: paleta coral e azul, Inter, logo, menu e
  páginas como antes.

### Negativas / trade-offs

- Saem junto melhorias que vieram nesses PRs e não eram só visuais: os
  componentes `BaseStatusChip`, `BaseAvatar`, `BasePageHeader`,
  `BaseConfirmDialog` e `BaseEventBlock`, e a escala tipográfica. As classes
  `text-h4`, `text-body-2`… voltam a não ter efeito no Vuetify 4 (as telas
  usam o tamanho padrão do navegador).
- O Figma do design system Agenda deixa de ser a referência do código.

### Neutras

- Qualquer item desses PRs pode voltar sozinho, sobre o visual original
  (ex.: a escala tipográfica ou o `BaseConfirmDialog`), com uma ADR nova.

## Referências

- PRs #39, #40, #41 (revertidos) e #42 (fechado).
