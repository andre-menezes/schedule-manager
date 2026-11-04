# ADR-0015: Integração BFF — CSRF, state do OAuth e logout no backend

- **Status:** Descontinuada
- **Data:** 2026-10-26
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0021 (Remoção da autenticação corporativa)

## Contexto e problema

Definia o contrato com o BFF de autenticação corporativo: token CSRF (double-submit), `state` do OAuth e logout no backend.

## Decisão

A decisão foi descontinuada pela
[ADR-0021](ADR-0021-remocao-da-autenticacao-corporativa.md). O template passou
a ser de uso pessoal, sem integração com o provedor de identidade corporativo
para o qual esta decisão foi tomada, e todas as páginas são públicas até que um
backend de autenticação próprio seja desenvolvido.

O conteúdo original desta ADR foi removido do repositório por tratar de
detalhes de integração específicos daquele ambiente. O histórico permanece
disponível no Git.
