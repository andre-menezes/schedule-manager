# ADR-0049: Backend como API REST separada, com contrato OpenAPI primeiro

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0002 (camada HTTP), ADR-0027 (TanStack Query),
  ADR-0039 (API simulada)

## Contexto e problema

Este repositório é só o frontend. Lembretes programados, cálculo de horários
livres, a página pública (R2) e integrações (WhatsApp, Google) exigem um
servidor. A stack do backend ainda está em aberto (Q-01). Como o frontend
avança sem esperar o backend, e como os dois combinam o contrato?

## Drivers da decisão

- Frontend e backend evoluem em paralelo.
- Regras de agenda (conflito, horários livres) com uma fonte de verdade.
- O template já tem `createApiInstance` (ofetch), erros RFC 9457 e API
  simulada no `pnpm dev`.

## Opções consideradas

- **API REST própria, em repositório separado, com contrato OpenAPI
  versionado primeiro** — recomendada.
- **BaaS (Supabase/Firebase)**: entrega rápida de auth e CRUD, mas
  lembretes, recorrência e horários livres viram funções espalhadas, e o
  frontend ficaria acoplado ao SDK do fornecedor.
- **GraphQL**: flexível para a grade, mas acrescenta cliente, cache próprio e
  ferramentas, sem ganho claro sobre REST + TanStack Query.

## Decisão

Propomos:

- API REST JSON, versionada em `/api/v1`, erros no formato RFC 9457 (já
  tratado em `shared/utils/http-error.ts`).
- Contrato OpenAPI escrito antes da implementação de cada história e
  guardado no repositório do backend; os tipos do frontend seguem o contrato.
- Regras de agenda (conflito, horários livres, expansão da recorrência,
  lembretes) **só no backend**; o frontend valida para dar resposta rápida,
  mas o 409/422 do servidor é a palavra final.
- Enquanto o backend não existe, cada módulo simula seus endpoints em
  `mock/<contexto>.ts` (ADR-0039).
- Endpoints de leitura da agenda recebem o intervalo (`from`, `to`) e devolvem
  as ocorrências já expandidas.

Fica `Proposta` até a Q-01 (stack e hospedagem) ser respondida.

## Consequências

### Positivas

- O frontend pode entregar telas completas sobre a API simulada.
- O contrato vira a documentação da integração.

### Negativas / trade-offs

- Dois repositórios e dois deploys.
- A API simulada precisa acompanhar o contrato, ou os testes do frontend
  mentem.

### Neutras

- A escolha da linguagem do backend não muda nada no frontend.

## Referências

- `src/shared/api/`, `mock/`
- [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)
