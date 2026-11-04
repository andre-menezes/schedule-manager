/**
 * Tipos do módulo showcase (telas de documentação do template).
 */

export interface Metric {
  label: string;
  value: string | number;
  detail: string;
  icon: string;
  color: string;
}

export interface Activity {
  title: string;
  detail: string;
  icon: string;
  color: string;
}

export interface Dependency {
  name: string;
  version: string;
}

/**
 * Contratos da tela de Arquitetura (`/arquitetura`).
 */

/** Uma camada da arquitetura (app, modules, shared, types, test). */
export interface ArchitectureLayer {
  /** Nome da camada (ex.: `app`). */
  name: string;
  /** Descrição da responsabilidade da camada. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Cor do tema associada à camada. */
  color: string;
}

/** Linha da tabela de regras de dependência entre camadas. */
export interface DependencyRule {
  /** Camada de origem. */
  layer: string;
  /** Camadas que ela pode importar. */
  canImport: string;
  /** Camadas que ela não pode importar. */
  cannotImport: string;
}

/**
 * Contratos da tela de Onboarding (`/onboarding`).
 */

/** Um passo do guia de criação de feature (exibido no stepper). */
export interface OnboardingStep {
  /** Título curto do passo (ex.: `Criar o módulo`). */
  title: string;
  /** Descrição do que fazer neste passo. */
  description: string;
  /** Código de exemplo do passo. */
  code: string;
  /** Rótulo da linguagem do código (ex.: `ts`, `vue`, `bash`). */
  language: string;
  /** Nome de arquivo opcional do exemplo. */
  filename?: string;
  /** Referência (README) relacionada ao passo. */
  reference?: string;
}

/** Uma pergunta frequente do onboarding. */
export interface OnboardingFaq {
  /** Pergunta. */
  question: string;
  /** Resposta. */
  answer: string;
}

/**
 * Contratos da tela de Convenções (`/convencoes`).
 */

/** Tipo de commit do padrão Conventional Commits adotado no projeto. */
export interface CommitType {
  /** Tipo (ex.: `feat`, `fix`). */
  type: string;
  /** Quando usar esse tipo. */
  when: string;
}

/** Escopo de commit — identifica a camada ou módulo afetado. */
export interface CommitScope {
  /** Nome do escopo (ex.: `auth`, `ui`). */
  scope: string;
  /** Exemplos de uso. */
  usage: string;
}

/** Prefixo de nomenclatura de branch. */
export interface BranchType {
  /** Prefixo da branch (ex.: `feat`, `fix`). */
  prefix: string;
  /** Quando usar esse prefixo. */
  when: string;
  /** Exemplo de nome de branch. */
  example: string;
  /** Exemplo ruim de nome de branch. */
  badExample: string;
}

/** Item de uma categoria do checklist de code review. */
export interface ChecklistItem {
  /** Texto do critério. */
  text: string;
  /** Se é bloqueante (⚠️) ou apenas sugestão (💡). */
  blocking: boolean;
}

/** Categoria do checklist de code review (agrupa vários itens). */
export interface ChecklistCategory {
  /** Nome da categoria (ex.: Arquitetura, Tipagem). */
  title: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Itens da categoria. */
  items: ChecklistItem[];
}

/** Princípio de referência citado no checklist (SRP, DRY, KISS...). */
export interface Principle {
  /** Sigla ou nome curto. */
  name: string;
  /** Descrição do princípio. */
  description: string;
}

/**
 * Contratos da tela de Decisões / ADRs (`/decisoes`).
 */

/** Status do ciclo de vida de uma ADR. */
export type AdrStatus = 'Aceita' | 'Proposta' | 'Substituída' | 'Descontinuada';

/** Uma Architecture Decision Record (ADR) registrada em `docs/decisions/`. */
export interface Adr {
  /** Identificador da ADR (ex.: `ADR-0001`). */
  id: string;
  /** Título da decisão. */
  title: string;
  /** Status atual no ciclo de vida. */
  status: AdrStatus;
  /** Nome do arquivo em `docs/decisions/` (ex.: `ADR-0001-arquitetura-em-camadas.md`). */
  file: string;
}

/** Descrição de um status do ciclo de vida (para a legenda da tela). */
export interface AdrStatusInfo {
  /** Rótulo do status. */
  status: AdrStatus;
  /** Significado do status. */
  meaning: string;
  /** Cor do tema associada. */
  color: string;
}

/**
 * Contratos dos componentes de documentação interativa (camada `shared/ui`).
 * Usados pelas telas que documentam a arquitetura do template.
 */

/** Bloco de código com botão de copiar (sem syntax highlight). */
export interface CodeBlockProps {
  /** Conteúdo do código a ser exibido. */
  code: string;
  /** Rótulo da linguagem exibido no cabeçalho (ex.: `bash`, `ts`, `vue`). */
  language?: string;
  /** Nome de arquivo opcional exibido no cabeçalho do bloco. */
  filename?: string;
}

/** Seção padronizada de documentação (título + descrição + conteúdo em slot). */
export interface DocSectionProps {
  /** Título da seção. */
  title: string;
  /** Descrição curta opcional exibida abaixo do título. */
  description?: string;
  /** Ícone opcional (ligatura do Material Symbols) exibido ao lado do título. */
  icon?: string;
  /** Identificador para âncora de navegação (ex.: `camadas`). */
  anchor?: string;
}

/**
 * Cartão de showcase: apresenta um exemplo vivo (slot `preview`) ao lado do
 * código de uso correspondente.
 */
export interface ShowcaseCardProps {
  /** Título do exemplo. */
  title: string;
  /** Descrição do que o exemplo demonstra. */
  description?: string;
  /** Código de uso exibido no bloco (via CodeBlock). */
  code: string;
  /** Rótulo da linguagem do código. */
  language?: string;
}

/**
 * Cartão de navegação do hub inicial — leva a uma seção da documentação.
 */
export interface NavCard {
  /** Título da seção de destino. */
  title: string;
  /** Descrição curta do que a seção cobre. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
  /** Cor do tema (primary, accent, info, warning, success, secondary). */
  color: string;
  /** Rota de destino. */
  route: string;
}

/** Um passo de um fluxo (inicialização, autenticação, rotas) — usado por `FlowSteps`. */
export interface FlowStep {
  /** Ordem/rótulo do passo. */
  order: number;
  /** Título do passo. */
  title: string;
  /** Descrição do que acontece. */
  description: string;
  /** Ícone (ligatura do Material Symbols). */
  icon: string;
}
