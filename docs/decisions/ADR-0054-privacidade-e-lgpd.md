# ADR-0054: Privacidade e LGPD desde o MVP

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0043 (Sentry), ADR-0048, ADR-0053

## Contexto e problema

O Agenda guarda dados pessoais do usuário e, principalmente, de terceiros: os
clientes do profissional, que não têm conta. Em alguns segmentos (psicologia,
nutrição), até o fato de alguém ser cliente é sensível. A LGPD se aplica
desde o primeiro usuário. Que regras o produto segue desde o MVP?

## Drivers da decisão

- Conformidade com a LGPD (RNF-08).
- Confiança do profissional para cadastrar clientes.
- Não depender de retrabalho depois.

## Opções consideradas

- **Privacidade por padrão desde o MVP** (regras abaixo) — escolhida.
- **Tratar LGPD depois do MVP**: mais rápido agora, mas exige migração de
  dados e reescrever fluxos de exclusão.

## Decisão

- **Papéis:** para os dados dos clientes, o profissional é o controlador e o
  Agenda, o operador; para os dados da conta, o Agenda é o controlador. Os
  termos de uso dizem isso.
- **Mínimo necessário:** cliente exige só o nome (RN-12).
- **Consentimento para lembretes:** registrado com data no cliente
  (`reminderConsentAt`); sem ele, não há envio (RN-09). Todo e-mail ao
  cliente tem link para deixar de receber.
- **Direitos do titular:** exportação e exclusão da conta (US-006);
  arquivamento e anonimização de clientes (US-044, RN-13).
- **Frontend:** nenhum dado pessoal em `localStorage` além de preferências;
  nada de dados de cliente em logs do console; o Sentry (ADR-0043) sem
  PII (`sendDefaultPii` desligado, que é o padrão) e sem corpo de
  requisições.
- **Anotações (R3):** privadas do profissional (RN-20), criptografadas em
  repouso no backend.

## Consequências

### Positivas

- Fluxos de exclusão e consentimento existem desde o início.

### Negativas / trade-offs

- Mais telas e regras no MVP (US-006, US-044).

### Neutras

- Termos de uso e política de privacidade precisam de revisão jurídica antes
  do lançamento.

## Referências

- [Lei 13.709/2018 (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
