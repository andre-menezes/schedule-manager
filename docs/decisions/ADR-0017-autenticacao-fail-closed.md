# ADR-0017: Autenticação fail-closed — state obrigatório, erro por código, 401 com autoridade única e mock bloqueado em produção

- **Status:** Descontinuada
- **Data:** 2026-10-29
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0021 (Remoção da autenticação corporativa)

## Contexto e problema

Endurecia o fluxo de autenticação corporativo: `state` obrigatório, tela de erro por código, tratamento único de 401 e mock de autenticação proibido em produção.

## Decisão

A decisão foi descontinuada pela
[ADR-0021](ADR-0021-remocao-da-autenticacao-corporativa.md). O template passou
a ser de uso pessoal, sem integração com o provedor de identidade corporativo
para o qual esta decisão foi tomada, e todas as páginas são públicas até que um
backend de autenticação próprio seja desenvolvido.

O conteúdo original desta ADR foi removido do repositório por tratar de
detalhes de integração específicos daquele ambiente. O histórico permanece
disponível no Git.
