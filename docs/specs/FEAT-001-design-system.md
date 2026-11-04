# [FEAT-001] Design system Schedule Manager no código

## Contexto

A ADR-0057 definiu que o visual do Agenda segue o design system
**Schedule Manager** do Figma
(https://www.figma.com/design/6FDGyIeX9bSEEn0mU3un7Z) e as telas da página
**Telas · MVP**. O projeto nasceu com o visual original do template
(ADR-0047), sem as cores de evento, a escala tipográfica nem os componentes
de agenda. Esta feature leva a base do design system ao código para que as
telas do MVP já nasçam com ele.

Item do R0 no [ROADMAP](../ROADMAP.md): "Design system no código".

## Requisitos funcionais

- [x] RF01: Tema claro e escuro do Vuetify com as variáveis da coleção
      **Color** do Figma (fundo, superfície, bordas, texto, marca, status,
      `*/container` e as oito cores de evento).
- [x] RF02: Escala tipográfica Inter com os estilos `text/*` do Figma
      (`text-h1`…`text-overline`, com variantes por breakpoint).
- [x] RF03: Padrões dos componentes do Vuetify conforme o design system
      (botão sem elevação, cartão com borda, campos em contorno, raios de 4
      e 8 px, elevações `elevation/1`–`4`).
- [x] RF04: Componentes base em `shared/ui/components`, mapeados ao Figma:

  | Figma            | Código              |
  | ---------------- | ------------------- |
  | `Calendar event` | `BaseEventBlock`    |
  | `Chip`           | `BaseStatusChip`    |
  | `Avatar`         | `BaseAvatar`        |
  | `Dialog`         | `BaseConfirmDialog` |
  | barra das telas  | `BasePageHeader`    |

## Regras de negócio

| Código | Regra                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------- |
| RN01   | Toda cor de texto sobre fundo passa no contraste AA (4,5:1) nos dois temas, verificada em teste e no axe. |
| RN02   | A cor do avatar é estável pelo nome da pessoa (mesmo nome, mesma cor em todas as telas).                  |

## Critérios de aceite

- [x] CA01: Dado o Figma atual, quando comparo as variáveis Color (Light e
      Dark) com `src/app/providers/vuetify.ts`, então os valores coincidem.
- [x] CA02: Dado o Figma atual, quando comparo os estilos `text/*` com
      `src/app/styles/typography.scss`, então tamanho, altura de linha, peso e
      espaçamento coincidem.
- [x] CA03: Os componentes base têm testes (`design-system.spec.ts`,
      `avatar.spec.ts`) e o tema tem teste de nomes e contraste
      (`vuetify.spec.ts`).
- [x] CA04: E2E com axe sem violações WCAG A/AA nas páginas existentes.
- [x] CA05: `pnpm lint`, `pnpm build` e `pnpm test:coverage` (piso
      100/98/100/100) passando.

## Layout / Wireframe

Referência: Figma, páginas **Fundamentos**, **Componentes** e **Padrões**.
Esta feature não muda telas: as telas do Agenda chegam com as histórias.

## Endpoints envolvidos

Nenhum.

## Dependências

- [x] ADR-0057 aceita.

## Observações

- **Ponto de partida:** o código das ADRs 0044–0046 no `vue-template`
  (PRs #39–#41, revertidos pela ADR-0047), reaplicado sem a vitrine nem o
  CRUD de exemplo e conferido com o Figma atual. A conferência mudou os
  fundos de status (`*-container`) do tema claro e o texto do tom neutro
  para os valores das variáveis `*/container` e `text/primary`.
- **Fora do escopo:** o layout autenticado como no protótipo (marca no menu
  lateral, barra de título por tela, sem cabeçalho global) fica com o item
  "Layout autenticado e rotas públicas" do R0, junto com a autenticação.
- O nome exibido continua "Agenda" (Q-06).

---

## Checklist do agente (preenchido pela IA)

- [x] Spec lida e compreendida (sem dúvidas pendentes)
- [x] Branch criada: `feat/FEAT-001-design-system`
- [x] Componentes em `src/shared/ui/components/`
- [x] Tipos em `src/types/theme` e `src/types/components`
- [x] Testes unitários criados e passando
- [x] E2E passando (acessibilidade)
- [x] `pnpm lint` sem erros
- [x] `pnpm build` sem erros
- [x] `pnpm test` passando
- [x] Commits seguindo COMMIT-CONVENTIONS.md
- [ ] PR aberto com descrição completa
