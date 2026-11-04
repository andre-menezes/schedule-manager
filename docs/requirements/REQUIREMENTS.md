# Requisitos — Agenda

- **Versão do documento:** 0.1 (levantamento inicial)
- **Data:** 2026-11-04

Voltar para o índice: [README.md](README.md)

Prioridade em MoSCoW; release conforme o [ROADMAP](../ROADMAP.md). As
histórias citadas estão em [USER-STORIES.md](USER-STORIES.md) e as entidades
em [DOMAIN-MODEL.md](DOMAIN-MODEL.md).

---

## 1. Requisitos funcionais

### 1.1 MVP (R0 + R1)

| ID    | Requisito                                                                                              | Prioridade | Release | Histórias              |
| ----- | ------------------------------------------------------------------------------------------------------ | ---------- | ------- | ---------------------- |
| RF-01 | Criar conta, entrar, sair e recuperar a senha com e-mail e senha                                       | Must       | R0      | US-001, US-002, US-003 |
| RF-02 | Entrar com conta Google                                                                                | Should     | R1      | US-004                 |
| RF-03 | Configuração inicial guiada: modo de uso (pessoal ou profissional), fuso horário e horário de trabalho | Must       | R1      | US-005                 |
| RF-04 | Exportar os próprios dados e excluir a conta (LGPD)                                                    | Must       | R1      | US-006                 |
| RF-05 | Visualizar a agenda por dia, semana, mês e lista, navegar entre períodos e voltar para hoje            | Must       | R1      | US-010 a US-014        |
| RF-06 | Filtrar a agenda por tipo de evento e status; destacar a hora atual e o horário de trabalho            | Should     | R1      | US-015, US-016         |
| RF-07 | Criar, editar, mover e excluir compromissos pessoais, inclusive de dia inteiro e de vários dias        | Must       | R1      | US-020 a US-023        |
| RF-08 | Categorizar compromissos com cores                                                                     | Should     | R1      | US-024                 |
| RF-09 | Lembrete de compromisso pessoal para o próprio usuário                                                 | Should     | R1      | US-025                 |
| RF-10 | Painel "Hoje" com a agenda do dia, próximos compromissos e pendências                                  | Must       | R1      | US-030                 |
| RF-11 | Criação rápida de evento a partir de qualquer tela e de um horário vazio da agenda                     | Must       | R1      | US-032                 |
| RF-12 | Busca global por clientes e eventos                                                                    | Should     | R1      | US-031                 |
| RF-13 | Cadastrar, listar, buscar, editar e arquivar clientes, com ficha e histórico de atendimentos           | Must       | R1      | US-040 a US-044        |
| RF-14 | Alertar cliente possivelmente duplicado                                                                | Should     | R1      | US-045                 |
| RF-15 | Cadastrar e desativar serviços com duração, preço, cor e intervalo após o atendimento                  | Must       | R1      | US-050, US-051         |
| RF-16 | Agendar, remarcar e mudar o status de atendimentos (agendado, confirmado, concluído, cancelado, falta) | Must       | R1      | US-060, US-063, US-064 |
| RF-17 | Impedir ou alertar conflito de horário e atendimento fora da disponibilidade                           | Must       | R1      | US-061                 |
| RF-18 | Sugerir os próximos horários livres para um serviço                                                    | Should     | R1      | US-062                 |
| RF-19 | Eventos recorrentes, com edição de uma ocorrência, desta em diante ou da série toda                    | Must       | R1      | US-065, US-066         |
| RF-20 | Local (endereço ou link online) e observações no atendimento                                           | Should     | R1      | US-067, US-068         |
| RF-21 | Definir horário de trabalho semanal e bloqueios (folga, férias, feriado)                               | Must       | R1      | US-070, US-071         |
| RF-22 | Intervalo e tempo de deslocamento entre atendimentos                                                   | Should     | R1      | US-072                 |
| RF-23 | Lembrete automático por e-mail ao cliente antes do atendimento                                         | Must       | R1      | US-080                 |
| RF-24 | Cliente confirma ou cancela o atendimento pelo link do lembrete, sem conta                             | Should     | R1      | US-081                 |
| RF-25 | Configurar antecedência e texto dos lembretes                                                          | Should     | R1      | US-084                 |
| RF-26 | Preferências: fuso, formato de hora, início da semana, idioma e tema                                   | Must       | R1      | US-090                 |
| RF-27 | Modo pessoal: esconder clientes, serviços e disponibilidade de quem não atende                         | Should     | R1      | US-091                 |
| RF-28 | Instalar como aplicativo (PWA)                                                                         | Should     | R1      | US-092                 |
| RF-29 | Resumo diário por e-mail para o profissional                                                           | Could      | R1      | US-082                 |
| RF-30 | Importar clientes de um CSV                                                                            | Could      | R1      | US-046                 |

### 1.2 Evolução (R2 em diante)

| ID    | Requisito                                                                     | Prioridade | Release | Histórias       |
| ----- | ----------------------------------------------------------------------------- | ---------- | ------- | --------------- |
| RF-40 | Página pública de agendamento online, com serviços e horários livres          | Must       | R2      | US-100 a US-102 |
| RF-41 | Cliente cancela ou remarca pelo link, dentro das regras do profissional       | Should     | R2      | US-103          |
| RF-42 | Personalizar a página pública (foto, bio, endereço, endereço da página)       | Should     | R2      | US-104          |
| RF-43 | Notificações push (navegador e PWA)                                           | Should     | R2      | US-083          |
| RF-44 | Lembretes por WhatsApp                                                        | Must       | R2      | US-110          |
| RF-45 | Sincronização com o Google Agenda                                             | Should     | R2      | US-111          |
| RF-46 | Assinatura iCal e integração com Outlook                                      | Could      | R3      | US-112          |
| RF-47 | Link de videochamada gerado no atendimento online                             | Could      | R3      | US-113          |
| RF-48 | Registrar pagamentos, pacotes de sessões e mensalidades                       | Must       | R3      | US-120, US-121  |
| RF-49 | Recebíveis, inadimplência e faturamento por período e serviço                 | Should     | R3      | US-122, US-123  |
| RF-50 | Anotações privadas por atendimento e anexos na ficha do cliente               | Should     | R3      | US-130, US-131  |
| RF-51 | Relatórios de ocupação e faltas; exportação em CSV/PDF                        | Should     | R3      | US-140, US-141  |
| RF-52 | Aniversariantes e mensagens de retorno                                        | Could      | R3      | US-132          |
| RF-53 | Cobrança por Pix e sinal no agendamento online                                | Could      | R4      | US-124          |
| RF-54 | Lista de espera para horários concorridos                                     | Could      | R4      | US-133          |
| RF-55 | Equipe: membros, perfis de acesso, agenda por profissional e recursos (salas) | Must       | R5      | US-150 a US-152 |

---

## 2. Requisitos não funcionais

| ID     | Categoria           | Requisito                                                                                                                                   | Release |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| RNF-01 | Usabilidade         | Mobile-first: todas as telas usáveis a partir de 360px de largura; alvos de toque de 44px no mínimo.                                        | R1      |
| RNF-02 | Usabilidade         | Criar um atendimento em até 3 interações a partir da agenda (tocar no horário → escolher cliente/serviço → salvar).                         | R1      |
| RNF-03 | Acessibilidade      | WCAG 2.1 AA, verificado pelo axe no E2E (ADR-0029) e navegação por teclado na grade da agenda (ADR-0036).                                   | R1      |
| RNF-04 | Desempenho          | Agenda da semana interativa em até 2,5 s (LCP) em 4G; troca de período em até 300 ms com dados em cache (TanStack Query, ADR-0027).         | R1      |
| RNF-05 | Desempenho          | Bundle inicial ≤ 250 kB gzip; telas carregadas sob demanda por rota (ADR-0004).                                                             | R1      |
| RNF-06 | Segurança           | Sessão em cookie `HttpOnly`/`Secure`/`SameSite`, proteção CSRF, senha com hash forte no backend e limite de tentativas de login (ADR-0050). | R0      |
| RNF-07 | Segurança           | Isolamento por conta: nenhum dado de uma conta é visível a outra; autorização checada no backend a cada requisição.                         | R0      |
| RNF-08 | Privacidade         | Conformidade com a LGPD: base legal, consentimento para lembretes, exportação e exclusão de dados, anonimização de clientes (ADR-0054).     | R1      |
| RNF-09 | Confiabilidade      | Lembretes enviados no horário com tolerância de ±5 min; falhas de envio registradas e reprocessadas (ADR-0053).                             | R1      |
| RNF-10 | Correção            | Datas guardadas em UTC com o fuso IANA do profissional; recorrência e horário de verão corretos (ADR-0051).                                 | R1      |
| RNF-11 | Disponibilidade     | 99,5% mensal para a API e a página pública (meta; depende da hospedagem `[PENDENTE]`).                                                      | R1      |
| RNF-12 | Observabilidade     | Erros do frontend no Sentry (ADR-0043); logs estruturados e métricas de envio de lembretes no backend.                                      | R1      |
| RNF-13 | Internacionalização | Textos no i18n (ADR-0037), pt-BR como base e en-US (ADR-0038); datas, horas e moeda pelo locale.                                            | R1      |
| RNF-14 | Compatibilidade     | Duas últimas versões de Chrome, Edge, Firefox e Safari (desktop e mobile).                                                                  | R1      |
| RNF-15 | Manutenibilidade    | Arquitetura em camadas do template (ADR-0001, ADR-0018), piso de cobertura 100/98/100/100 (ADR-0016), lint e E2E no CI (ADR-0022).          | R0      |
| RNF-16 | Backup              | Backup diário do banco com retenção de 30 dias e teste de restauração trimestral.                                                           | R1      |
| RNF-17 | Offline             | Abrir a agenda já carregada sem conexão (somente leitura) no PWA.                                                                           | R2      |

---

## 3. Regras de negócio

| ID    | Regra                                                                                                                                                                                                                                                                             | Histórias              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| RN-01 | Dois **atendimentos** não ativos (status diferente de cancelado e falta) não podem se sobrepor. A sobreposição com **compromisso pessoal** é permitida, com aviso.                                                                                                                | US-060, US-061, US-063 |
| RN-02 | O período ocupado por um atendimento é a duração **mais** o intervalo do serviço e o deslocamento (quando houver). O intervalo não aparece como evento, mas conta para conflito e para horários livres.                                                                           | US-050, US-061, US-072 |
| RN-03 | Atendimento fora do horário de trabalho ou num bloqueio é permitido só como **encaixe**, com confirmação explícita do profissional. A página pública (R2) nunca oferece esses horários.                                                                                           | US-061, US-071, US-101 |
| RN-04 | A duração e o preço do atendimento vêm do serviço no momento do agendamento e podem ser alterados no próprio atendimento; mudar o serviço depois não altera atendimentos já criados.                                                                                              | US-050, US-060         |
| RN-05 | Ciclo de vida do atendimento: `scheduled → confirmed → completed`; `scheduled`/`confirmed → canceled`; `scheduled`/`confirmed → no_show` (só depois do horário de início). `completed`, `canceled` e `no_show` podem voltar a `scheduled` dentro de 7 dias, para corrigir erro.   | US-064                 |
| RN-06 | Cancelar não apaga: o atendimento fica no histórico, com quem cancelou (profissional ou cliente), quando e o motivo opcional. Excluir é permitido só para compromissos pessoais.                                                                                                  | US-022, US-064         |
| RN-07 | Data e hora são guardadas em UTC; exibidas no fuso da conta. Eventos de dia inteiro são datas locais, sem fuso.                                                                                                                                                                   | US-005, US-023, US-090 |
| RN-08 | Recorrência segue a RFC 5545 (diária, semanal em dias escolhidos, mensal, com fim por data ou por número de ocorrências). Alterar "esta" cria uma exceção; "esta e as próximas" divide a série; "todas" altera a série inteira, sem mexer nas ocorrências passadas já concluídas. | US-065, US-066         |
| RN-09 | Lembrete ao cliente é enviado só se houver e-mail (R1) ou telefone (R2), consentimento registrado e o atendimento estiver `scheduled` ou `confirmed`. Antecedência padrão: 24 h; configurável entre 1 h e 72 h.                                                                   | US-080, US-084         |
| RN-10 | Atendimento criado com início a menos tempo que a antecedência do lembrete recebe o lembrete imediatamente, se ainda faltar mais de 1 h; caso contrário, não recebe.                                                                                                              | US-080                 |
| RN-11 | Atendimentos no passado podem ser registrados (retroativos), mas não disparam lembretes e já nascem `completed`, se o profissional quiser.                                                                                                                                        | US-060                 |
| RN-12 | Cliente exige só o **nome**. Telefone e e-mail são opcionais, mas validados quando informados. Mesmo telefone ou e-mail de outro cliente ativo gera alerta de duplicidade (não bloqueia).                                                                                         | US-040, US-045         |
| RN-13 | Cliente com atendimentos não é excluído: é **arquivado** (some das listas e da busca) ou **anonimizado** a pedido (nome vira "Cliente removido", contatos são apagados; os atendimentos continuam para as métricas).                                                              | US-044                 |
| RN-14 | O link de confirmação/cancelamento do lembrete é de uso individual, expira no início do atendimento e não expõe dados de outros atendimentos.                                                                                                                                     | US-081                 |
| RN-15 | Serviço desativado não aparece para novos agendamentos, mas continua nos atendimentos existentes. Serviço com atendimentos não é excluído.                                                                                                                                        | US-051                 |
| RN-16 | A semana da agenda começa no dia configurado (padrão: domingo, pt-BR). O horário de trabalho admite vários intervalos por dia (ex.: 8h–12h e 14h–18h).                                                                                                                            | US-070, US-090         |
| RN-17 | (R2) A página pública respeita antecedência mínima (padrão 2 h) e máxima (padrão 60 dias); o profissional pode exigir aprovação manual, e o atendimento nasce `pending_approval`.                                                                                                 | US-102                 |
| RN-18 | (R2) O cliente cancela ou remarca pelo link até X horas antes (padrão 12 h, configurável). Depois disso, só falando com o profissional.                                                                                                                                           | US-103                 |
| RN-19 | (R3) Um atendimento pode ter vários pagamentos; está "pago" quando a soma ≥ preço. Pacote de N sessões abate uma sessão a cada atendimento `completed` ou `no_show` (configurável).                                                                                               | US-120, US-121         |
| RN-20 | (R3) Anotações de atendimento são privadas do profissional: nunca aparecem em lembretes, exportações para o cliente ou na página pública.                                                                                                                                         | US-130                 |
