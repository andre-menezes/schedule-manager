# Roadmap — Agenda

Releases do produto, do MVP à evolução. As histórias estão em
[requirements/USER-STORIES.md](requirements/USER-STORIES.md); as datas
dependem das pendências em
[requirements/OPEN-QUESTIONS.md](requirements/OPEN-QUESTIONS.md).

Voltar para o índice: [README.md](README.md)

---

## Princípios

1. **O profissional primeiro.** Até o MVP estar em uso, nada de recursos para
   o cliente final além do lembrete.
2. **Histórias pequenas e testáveis.** Uma história vira uma spec
   (`docs/specs/`), uma branch e um PR; histórias `G` são quebradas antes.
3. **Sem dependência ou padrão novo sem ADR.**
4. **Medir antes de ampliar.** Cada release define a métrica que justifica a
   próxima.

## Visão geral

| Release | Tema                            | Objetivo                                            | Métrica de saída                               |
| ------- | ------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| R0      | Fundação                        | Contas, sessão, layout autenticado, contrato da API | Login ponta a ponta em homologação             |
| R1      | **MVP — agenda e atendimentos** | O profissional troca o caderno/WhatsApp pelo Agenda | 20 profissionais usando por 4 semanas seguidas |
| R2      | Agendamento online e canais     | O cliente marca sozinho; lembretes por WhatsApp     | 30% dos atendimentos vindos do link público    |
| R3      | Gestão do negócio               | Financeiro, anotações e relatórios                  | 50% dos ativos registrando pagamentos          |
| R4      | Crescimento e monetização       | Pix, sinal, lista de espera                         | Redução de faltas com sinal; receita por conta |
| R5      | Pequenas equipes                | Vários profissionais, secretária e recursos         | Contas com 2+ membros ativas                   |

## R0 — Fundação

| Item                                       | Histórias / ADR    | Camadas                         |
| ------------------------------------------ | ------------------ | ------------------------------- |
| Contrato OpenAPI inicial e API simulada    | ADR-0049           | `mock/`, `shared/api`           |
| Criar conta, entrar, sair, recuperar senha | US-001 a US-003    | `modules/auth`, guard no router |
| Layout autenticado e rotas públicas        | ADR-0050, ADR-0055 | `app/`, `shared/ui/layouts`     |
| Primeira publicação em homologação         | ADR-0041           | Docker, CI                      |

## R1 — MVP

Ordem sugerida (cada bloco libera o seguinte):

1. **Configuração e cadastros:** US-005, US-090, US-091, US-050, US-051,
   US-040 a US-043, US-070, US-071.
2. **Agenda:** US-010 a US-014, US-020 a US-022, US-032 (depende do spike da
   ADR-0052).
3. **Atendimentos:** US-060, US-061, US-063, US-064, US-065, US-066.
4. **Lembretes:** US-080, US-081, US-084.
5. **Painel e acabamento:** US-030, US-031, US-015, US-016, US-062, US-067,
   US-068, US-072, US-023, US-024, US-025, US-092.
6. **Conta e LGPD:** US-004, US-006, US-044, US-045.
7. **Se couber (Could):** US-021 (arrastar), US-046, US-082.

**Fora do MVP de propósito:** página pública, WhatsApp, sincronização com o
Google, financeiro.

## R2 — Agendamento online e canais

US-100 a US-104 (página pública), US-110 (WhatsApp), US-111 (Google Agenda),
US-083 (push), RNF-17 (agenda offline somente leitura).

## R3 — Gestão do negócio

US-120 a US-123 (financeiro), US-130 a US-132 (anotações, anexos,
relacionamento), US-140, US-141 (relatórios), US-112, US-113 (iCal, Outlook,
videochamada).

## R4 — Crescimento e monetização

US-124 (Pix e sinal), US-133 (lista de espera), planos e cobrança da
assinatura (depende da Q-02), avaliação de app nativo (Q-12).

## R5 — Pequenas equipes

US-150 a US-152: membros, perfis de acesso, agenda por profissional e
recursos. Exige revisar a ADR-0048 (conta individual → organização).
