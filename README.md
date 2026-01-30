# SaaS Monorepo

Este repositório contém a base completa do desenvolvimento do SaaS, organizado em **monorepo**, com múltiplas aplicações (backend, mobile e web) e pacotes compartilhados.

O objetivo desta estrutura é **centralizar governança técnica, padronização, reutilização de código e automações**, mantendo ao mesmo tempo **independência de build, dependências e deploy** entre os apps.

---

## 🧱 Visão Geral da Arquitetura

```
root/
├── apps/
│   ├── backend/        # API, regras de negócio, acesso a dados
│   ├── mobile/         # App mobile (Android inicialmente, iOS futuramente)
│   └── web/            # Aplicação web
│
├── packages/
│   ├── shared/         # Tipos, DTOs, validações, utils comuns
│   ├── eslint-config/  # Configuração ESLint compartilhada
│   └── tsconfig/       # Configurações base de TypeScript
│
├── docs/               # Documentação estratégica e técnica do SaaS
│
├── package.json        # Orquestração do monorepo (scripts globais)
├── tsconfig.base.json  # Base comum de TypeScript
└── README.md
```

---

## 🎯 Por que um Monorepo?

### Benefícios principais:

- **Single Source of Truth** para regras, tipos e contratos
- **Padronização arquitetural** entre frontend e backend
- **Reutilização real de código** (DTOs, validações, enums, schemas)
- **Facilidade de refactor cross-app**
- **Governança técnica centralizada** (lint, tsconfig, convenções)

Mesmo sendo um desenvolvedor solo, o monorepo reduz erros, inconsistências e retrabalho conforme o produto cresce.

---

## 📦 Dependências

- Cada app possui seu próprio `package.json`
- O `package.json` da raiz **não contém dependências de runtime**
- Ele é responsável apenas por:
  - Scripts globais
  - Ferramentas de padronização
  - Orquestração de tarefas

Exemplo:

- `apps/backend/package.json`
- `apps/mobile/package.json`
- `apps/web/package.json`

---

## 🧠 TypeScript

- `tsconfig.base.json` define regras comuns
- Cada app estende esse arquivo

Benefícios:

- Tipagem consistente
- Menos duplicação
- Evolução segura da base

---

## 🧪 Qualidade e Governança

Este repositório segue princípios de:

- Clean Architecture
- SOLID
- Código orientado a testes
- Contratos explícitos (API e domínio)
- Evolução incremental guiada por documentação

A IA (Copilot) atua como **agente orientador**, validando decisões contra a documentação existente.

---

## 🌱 Fluxo de Desenvolvimento

1. Definição e validação via documentação (`/docs`)
2. Criação de branch seguindo padrão
3. Implementação orientada a testes
4. Pull Request com checklist técnico
5. Revisão (humana + IA)

---

## 📚 Documentação

Toda a base de decisão do produto está documentada em `/docs`, incluindo:

- Visão de negócio
- MVP
- Requisitos
- Arquitetura
- Contratos de API
- Estratégia de testes
- Playbooks de desenvolvimento

---

## 🚀 Objetivo Final

Permitir que **uma única pessoa opere como uma empresa completa**, com:

- Clareza de produto
- Velocidade de execução
- Qualidade técnica
- Escalabilidade real

---

Se você acabou de chegar neste projeto: **leia os documentos antes de escrever código.**
