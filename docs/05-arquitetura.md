# 05 – Arquitetura

## Visão Geral

A arquitetura do sistema foi definida com foco em **mobile-first**, priorizando o desenvolvimento inicial para **Android**, com capacidade de expansão futura para **iOS** e **Web**, sem retrabalho estrutural. O sistema segue o princípio de **arquitetura desacoplada**, onde o backend é independente dos clientes consumidores.

---

## Visão Arquitetural Geral

```
[ Mobile App (React Native) ]
            |
            | HTTP / REST
            v
[ Backend API ]
            |
            v
[ PostgreSQL ]
```

No futuro, a arquitetura suportará múltiplos clientes:

```
[ Mobile App ]     [ Web App ]
        \              /
         \            /
          ---> [ API ]
```

---

## Frontend

### Estratégia

O frontend principal será desenvolvido como um **aplicativo mobile multiplataforma**, utilizando um único código-base.

### Stack

- React Native
- TypeScript
- Mobile-first
- Android (fase inicial)
- iOS (planejado)
- Web via reaproveitamento de lógica (planejado)

### Responsabilidades

- Interface do usuário
- Navegação entre telas
- Consumo da API REST
- Gerenciamento de estado local e global

### Organização sugerida

```
/src
 ├── screens        # Telas da aplicação
 ├── components     # Componentes reutilizáveis
 ├── navigation     # Navegação e rotas
 ├── services       # Comunicação com API
 ├── stores         # Estado global
 └── utils          # Funções utilitárias
```

---

## Backend

### Estratégia

O backend é completamente desacoplado do frontend e fornece uma **API REST** consumida por qualquer tipo de cliente (mobile, web ou outros).

### Stack

- Node.js
- TypeScript
- API REST
- Autenticação JWT
- PostgreSQL

### Responsabilidades

- Regras de negócio
- Autenticação e autorização
- Persistência de dados
- Exposição de endpoints REST

---

## Banco de Dados

- PostgreSQL
- Modelo relacional
- Normalização orientada ao domínio
- Preparado para crescimento de volume de dados

---

## Princípios Arquiteturais

- Separação de responsabilidades
- Baixo acoplamento entre camadas
- Reaproveitamento de código
- Escalabilidade futura
- Preparado para múltiplos clientes

---

## Decisão Arquitetural (ADR)

**Decisão**: Frontend mobile-first multiplataforma

**Contexto**: Produto SaaS em estágio inicial, desenvolvido por um único responsável, com necessidade de rapidez e redução de custos.

**Escolha**: React Native + TypeScript

**Justificativa**:

- Código único para múltiplas plataformas
- Melhor experiência mobile
- Redução de custo e tempo
- Backend reutilizável

**Consequências**:

- Curva inicial de aprendizado
- Ganho estratégico no médio e longo prazo
