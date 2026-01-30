# 17 – Padrões de Repositório, Branches, Commits e PRs

## Objetivo

Definir padrões claros para **organização do código**, **controle de versão** e **governança técnica**, garantindo escalabilidade, rastreabilidade e qualidade mesmo em um cenário de desenvolvedor solo com apoio de IA.

---

## Estrutura de Repositórios

### Opção Recomendada (Fase Inicial – MVP)

👉 **Monorepo**

**Motivo técnico**:

- Menor overhead operacional
- Versionamento sincronizado
- Facilidade de refatoração entre camadas
- Melhor uso do Cursor com contexto completo

### Estrutura sugerida

```
root/
├─ apps/
│  ├─ backend/
│  ├─ mobile/
│  └─ web/ (futuro)
│
├─ packages/
│  ├─ shared/ (DTOs, tipos, validações)
│  └─ config/ (eslint, tsconfig)
│
├─ docs/
├─ .github/
│  └─ pull_request_template.md
│
├─ package.json
├─ tsconfig.base.json
└─ README.md
```

### Quando separar repositórios

Separar apenas quando:

- Times diferentes
- Deploys totalmente independentes
- Crescimento significativo do produto

---

## Estrutura do Backend

Baseada em **Clean Architecture**.

```
backend/
├─ src/
│  ├─ domain/
│  │  ├─ entities/
│  │  ├─ value-objects/
│  │  ├─ repositories/
│  │  └─ errors/
│  │
│  ├─ application/
│  │  ├─ use-cases/
│  │  ├─ dtos/
│  │  └─ services/
│  │
│  ├─ infrastructure/
│  │  ├─ database/
│  │  ├─ http/
│  │  └─ auth/
│  │
│  ├─ presentation/
│  │  ├─ controllers/
│  │  └─ routes/
│  │
│  └─ main.ts
│
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
│
└─ prisma/
```

---

## Padrão de Branches

### Branch principal

- `main` → sempre estável e deployável

### Branch de desenvolvimento

- `develop` → integração contínua

### Branches de trabalho

```
feature/nome-da-feature
fix/descricao-do-bug
refactor/contexto
chore/tarefa-tecnica
```

**Exemplos**:

- `feature/create-appointment`
- `fix/appointment-conflict`

---

## Padrão de Commits (Conventional Commits)

### Estrutura

```
type(scope): descrição curta
```

### Tipos permitidos

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`

### Exemplos

- `feat(appointment): create scheduling use case`
- `fix(auth): handle invalid token`
- `test(appointment): add conflict validation tests`

---

## Estratégia de Pull Request (Mesmo Solo)

> PRs são checkpoints de qualidade, não burocracia.

### Quando abrir PR

- Nova feature
- Refatoração relevante
- Mudança arquitetural

---

## Template de Pull Request

```md
## Objetivo

Descreva claramente o que este PR entrega.

## O que foi feito

-
-

## Documentos Impactados

- [ ] Arquitetura
- [ ] Requisitos
- [ ] Fluxos
- [ ] Contratos de API

## Testes

- [ ] Unitários
- [ ] Integração
- [ ] E2E (se aplicável)

## Riscos

Descreva possíveis impactos.

## Checklist

- [ ] Código validado via Cursor (Doc 16)
- [ ] Testes criados/atualizados
- [ ] Nenhuma violação arquitetural
```

---

## Uso da IA no PR

Antes de mergear, usar o prompt:

> "Revise este PR conforme os Documentos 05, 14, 15 e 16. Não gere código."

---

## Critério de Qualidade

Um PR só pode ser mergeado quando:

- Está alinhado com a documentação
- Passa nos testes
- Não gera dívida técnica desnecessária
