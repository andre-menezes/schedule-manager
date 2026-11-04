# Visão do produto — Agenda

- **Versão do documento:** 0.1 (levantamento inicial)
- **Data:** 2026-11-04
- **Responsável:** Andre Menezes (dono do produto)

Voltar para o índice: [README.md](README.md)

---

## 1. Problema

Profissionais autônomos (psicólogos, nutricionistas, personal trainers,
cabeleireiros, manicures, professores particulares, fisioterapeutas,
consultores...) organizam a agenda com uma mistura de caderno, WhatsApp e
calendário genérico. Daí vêm:

- **Conflitos e esquecimentos:** dois clientes no mesmo horário, ou o
  compromisso pessoal que "comeu" um atendimento.
- **Faltas (no-show):** o cliente esquece, o profissional perde a hora e a
  receita. Lembrar cada cliente à mão toma tempo.
- **Vida pessoal misturada com a profissional sem controle:** o calendário
  genérico não sabe o que é atendimento, o que é pessoal, nem quanto cada
  atendimento rende.
- **Ferramentas de mercado pensadas para clínicas e salões:** caras,
  complexas, cheias de cadastro, com foco em equipe e não no indivíduo.

## 2. Proposta de valor

> **Uma agenda só, para a vida pessoal e para os atendimentos, simples como um
> calendário e esperta como um sistema de agendamento.**

- Compromissos pessoais e atendimentos convivem na mesma visão, com cores e
  regras diferentes.
- O sistema conhece clientes, serviços, durações e horário de trabalho, e por
  isso evita conflitos e sugere horários livres.
- Lembretes automáticos reduzem faltas.
- (Evolução) O cliente agenda sozinho por um link, e o profissional acompanha
  quanto faturou.

## 3. Público-alvo

| Segmento                         | Descrição                                                                                  | Prioridade    |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ------------- |
| Profissional autônomo de serviço | Atende clientes com hora marcada, sozinho ou com até 1–2 ajudantes. Uso diário, no celular | Primário      |
| Usuário pessoal                  | Organiza compromissos, tarefas com hora e lembretes da própria rotina                      | Secundário    |
| Cliente do profissional          | Não usa o sistema como conta; recebe lembretes e (R2) agenda pelo link público             | Indireto      |
| Pequena equipe (2–5 pessoas)     | Estúdio ou consultório compartilhado                                                       | Evolução (R5) |

## 4. Personas

### P1 — Ana, psicóloga autônoma (primária)

- 34 anos, atende 25 pacientes por semana, presencial e online.
- Maioria dos atendimentos **semanais recorrentes** no mesmo horário.
- Dores: remarcações frequentes, pacientes que esquecem a sessão, controlar
  quem já pagou o mês.
- Usa: celular entre sessões, notebook à noite.
- Precisa: recorrência fácil de editar, lembrete automático, visão da semana.

### P2 — Carlos, personal trainer (primária)

- 28 anos, atende em academias e na casa dos alunos, em bairros diferentes.
- Precisa de **tempo de deslocamento** entre atendimentos e do **local** de
  cada um.
- Dores: encaixes de última hora, aulas canceladas em cima da hora.
- Usa: quase só o celular, com pressa.

### P3 — Juliana, uso pessoal (secundária)

- 41 anos, gerente, mãe de dois filhos. Não atende clientes.
- Quer compromissos, consultas médicas, aniversários e lembretes num lugar só,
  com lembrete por e-mail/notificação.
- Não quer ver nada de "clientes" ou "serviços" se não usar.

### P4 — Marcos, cliente do Carlos (indireta)

- Recebe lembrete com data, hora e local; quer confirmar ou cancelar com um
  toque, sem criar conta.
- (R2) Quer ver os horários livres e marcar sozinho.

## 5. Escopo

### Dentro do MVP (R1)

Agenda com visões de dia, semana, mês e lista; compromissos pessoais;
cadastro de clientes e serviços; atendimentos com status; horário de trabalho
e bloqueios; prevenção de conflitos; recorrência; lembretes por e-mail; painel
"Hoje"; busca; configurações de conta, fuso e preferências; uso responsivo no
celular (PWA instalável).

### Fora do MVP (evolução)

Agendamento online pelo cliente, WhatsApp/SMS, sincronização com Google e
Outlook, financeiro, pacotes, anotações de atendimento, relatórios, equipe,
pagamento online, app nativo. Detalhes e ordem no [ROADMAP](../ROADMAP.md).

### Fora do produto (não objetivos)

- Prontuário eletrônico com validade legal (CFM/CFP) — o Agenda guarda
  anotações simples, não substitui um prontuário regulado.
- Emissão de nota fiscal (pode virar integração, não funcionalidade própria).
- Gestão de estoque, folha de pagamento, CRM de vendas.

## 6. Métricas de sucesso

| Métrica                                      | Meta inicial (6 meses após o MVP)  |
| -------------------------------------------- | ---------------------------------- |
| Profissionais ativos semanais                | `[PENDENTE]` definir com o negócio |
| Atendimentos criados por profissional/semana | ≥ 10                               |
| Redução de faltas relatada (pesquisa)        | ≥ 30%                              |
| Tempo para criar um atendimento              | ≤ 20 s (3 toques após abrir o app) |
| Retenção D30                                 | ≥ 40%                              |
| NPS                                          | ≥ 40                               |

## 7. Premissas e restrições

- **Frontend:** este repositório, criado a partir do `vue-template`
  (Vue 3 + TypeScript + Vuetify 4 + TanStack Query — ADRs 0001–0046).
- **Backend:** API própria, em repositório separado (ADR-0049). Stack
  `[PENDENTE]`. Até ela existir, o frontend usa a API simulada do `pnpm dev`
  (ADR-0039).
- **Idioma principal:** pt-BR; en-US já suportado pelo template (ADR-0038).
- **Mercado inicial:** Brasil (LGPD, telefone com DDD, Pix na evolução).
- **Design:** o visual original do template (ADR-0047, que descontinuou o
  design system Agenda). Identidade visual própria do produto e cores de
  evento `[PENDENTE]` (Q-13).
- **Time:** pequeno, com apoio de agentes de IA (`agent/`, ADR-0006): as
  histórias precisam ser pequenas e testáveis.
