# ADR-0003: Autenticação OAuth centralizada no router guard

- **Status:** Descontinuada
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0021 (Remoção da autenticação corporativa)

## Contexto e problema

Definia a autenticação OAuth com o provedor de identidade corporativo, centralizada no guard do Vue Router (rotas com `meta.requiresAuth`).

## Decisão

A decisão foi descontinuada pela
[ADR-0021](ADR-0021-remocao-da-autenticacao-corporativa.md). O template passou
a ser de uso pessoal, sem integração com o provedor de identidade corporativo
para o qual esta decisão foi tomada, e todas as páginas são públicas até que um
backend de autenticação próprio seja desenvolvido.

O conteúdo original desta ADR foi removido do repositório por tratar de
detalhes de integração específicos daquele ambiente. O histórico permanece
disponível no Git.
