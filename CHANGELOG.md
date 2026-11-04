# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## Tipos de mudança

- **Adicionado** — para novas funcionalidades.
- **Alterado** — para mudanças em funcionalidades existentes.
- **Descontinuado** — para funcionalidades que serão removidas em breve.
- **Removido** — para funcionalidades removidas.
- **Corrigido** — para correção de bugs.
- **Segurança** — em caso de vulnerabilidades.

---

## [Não lançado]

### Adicionado

- Projeto criado a partir do `vue-template` 1.1.0 (visual original,
  ADR-0047), sem a vitrine de documentação nem o CRUD de exemplo
  (`pnpm template:clean`).
- Levantamento de requisitos em `docs/requirements/`: visão, requisitos
  funcionais e não funcionais, regras de negócio, histórias de usuário,
  modelo de domínio e pendências.
- Roadmap do produto (`docs/ROADMAP.md`) e ADRs 0048 a 0057; visual do
  produto pelo design system Schedule Manager do Figma (ADR-0057).
- Design system Schedule Manager no código (FEAT-001, ADR-0057): tema
  claro e escuro com as variáveis do Figma, cores de evento, escala
  tipográfica, padrões dos componentes e os componentes base
  `BaseEventBlock`, `BaseStatusChip`, `BaseAvatar`, `BaseConfirmDialog` e
  `BasePageHeader`.

### Alterado

- Nome do projeto: pacote `schedule-manager`, produto exibido como Agenda
  (provisório, Q-06); página inicial reduzida à boas-vindas do produto.
