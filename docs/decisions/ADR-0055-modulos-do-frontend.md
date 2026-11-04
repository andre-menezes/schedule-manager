# ADR-0055: Módulos do frontend do Agenda

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0001, ADR-0004, ADR-0018, ADR-0025, ADR-0050

## Contexto e problema

O template organiza o código em módulos por contexto, com rotas
auto-descobertas e regras de dependência verificadas pelo ESLint (um módulo
não importa outro). É preciso definir os módulos do Agenda antes das
primeiras histórias, para que as fronteiras não surjam por acaso.

## Drivers da decisão

- Fronteiras que acompanham os épicos das histórias.
- Nenhuma importação entre módulos (ADR-0018).
- Páginas públicas separadas das autenticadas.

## Opções consideradas

- **Um módulo por contexto de domínio** (abaixo) — escolhida.
- **Um módulo grande "agenda"**: menos pastas, mas mistura clientes,
  serviços e configurações e anula as regras de camada.

## Decisão

| Módulo               | Conteúdo                                                      | Histórias                    | Release |
| -------------------- | ------------------------------------------------------------- | ---------------------------- | ------- |
| `auth`               | Entrar, criar conta, recuperar senha, Google                  | US-001 a US-004              | R0/R1   |
| `onboarding`         | Configuração inicial                                          | US-005                       | R1      |
| `home`               | Painel "Hoje" (`/`)                                           | US-030                       | R1      |
| `calendar`           | Visões, navegação, filtros, formulário de evento, recorrência | US-010 a 025, 032, 060 a 068 | R1      |
| `clients`            | Lista, ficha, cadastro, arquivamento, importação              | US-040 a US-046              | R1      |
| `services`           | Serviços                                                      | US-050, US-051               | R1      |
| `availability`       | Horário de trabalho e bloqueios                               | US-070 a US-072              | R1      |
| `settings`           | Preferências, lembretes, conta e LGPD                         | US-006, 084, 090, 091        | R1      |
| `public-action`      | Página pública de confirmar/cancelar (sem login)              | US-081                       | R1      |
| `booking`            | Página pública de agendamento                                 | US-100 a US-104              | R2      |
| `finance`, `reports` | Financeiro e relatórios                                       | US-120 a 123, 140, 141       | R3      |

- O que dois módulos precisam (ex.: busca de cliente no formulário de
  atendimento, tipos de `Event`) sobe para `shared/` e `src/types/`, como o
  template orienta. O seletor de cliente é um componente de `shared/ui` que
  recebe a função de busca por prop.
- Rotas públicas (`auth`, `public-action`, `booking`) usam o `EmptyLayout` e
  `meta.public: true` (ADR-0050); as demais, o `DefaultLayout`.

## Consequências

### Positivas

- Cada épico tem um lugar claro; specs e PRs ficam pequenos.

### Negativas / trade-offs

- `calendar` concentra muitas histórias; se crescer demais, separar
  `appointments` (status e ficha do atendimento) num módulo próprio.

### Neutras

- O menu lateral é montado pelas rotas (`meta.nav`), então o modo pessoal
  (US-091) esconde `clients`, `services` e `availability` por um filtro no
  menu.

## Referências

- `src/modules/README.md`, `docs/ARCHITECTURE-GUIDE.md`
