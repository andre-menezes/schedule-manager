# Histórias de usuário — Agenda

- **Versão do documento:** 0.1 (levantamento inicial)
- **Data:** 2026-11-04

Voltar para o índice: [README.md](README.md)

Formato: **Como** <persona>, **quero** <ação>, **para** <benefício>. Critérios
de aceite em Dado/Quando/Então; regras de negócio (`RN-XX`) em
[REQUIREMENTS.md](REQUIREMENTS.md#3-regras-de-negócio). Tamanho relativo:
`P` (até 2 dias), `M` (até 1 semana), `G` (mais que isso — quebrar antes de
implementar).

Telas e protótipo: Figma, página **Telas · MVP** (ADR-0057); a legenda
de cada tela cita as histórias que ela cobre.

Personas (ver [VISION.md](VISION.md#4-personas)): **profissional** (Ana,
Carlos), **usuário pessoal** (Juliana), **cliente** (Marcos), **usuário**
(qualquer conta).

---

## Mapa de histórias

| Épico                               | R0           | R1 — MVP              | R2           | R3+          |
| ----------------------------------- | ------------ | --------------------- | ------------ | ------------ |
| EP01 Conta e acesso                 | US-001 a 003 | US-004 a 006          |              |              |
| EP02 Visualização da agenda         |              | US-010 a 016          |              |              |
| EP03 Compromissos pessoais          |              | US-020 a 025          |              |              |
| EP04 Painel, busca e criação rápida |              | US-030 a 032          |              |              |
| EP05 Clientes                       |              | US-040 a 046          |              |              |
| EP06 Serviços                       |              | US-050, 051           |              |              |
| EP07 Atendimentos                   |              | US-060 a 068          |              |              |
| EP08 Disponibilidade                |              | US-070 a 072          |              |              |
| EP09 Lembretes e notificações       |              | US-080, 081, 082, 084 | US-083       |              |
| EP10 Configurações                  |              | US-090 a 092          |              |              |
| EP11 Agendamento online             |              |                       | US-100 a 104 |              |
| EP12 Canais e integrações           |              |                       | US-110, 111  | US-112, 113  |
| EP13 Financeiro                     |              |                       |              | US-120 a 124 |
| EP14 Registros e relacionamento     |              |                       |              | US-130 a 133 |
| EP15 Relatórios                     |              |                       |              | US-140, 141  |
| EP16 Equipe                         |              |                       |              | US-150 a 152 |

---

## EP01 — Conta e acesso

### US-001 — Criar conta

**Como** usuário, **quero** criar uma conta com nome, e-mail e senha, **para**
ter a minha agenda protegida e acessível em qualquer dispositivo.

- Prioridade: Must · Release: R0 · Tamanho: M · RF-01

**Critérios de aceite**

- **CA1:** Dado que preenchi nome, e-mail válido e senha com 8+ caracteres,
  quando confirmo, então a conta é criada e recebo um e-mail de verificação.
- **CA2:** Dado um e-mail já cadastrado, quando tento criar a conta, então vejo
  uma mensagem genérica ("verifique seu e-mail") que não revela se o e-mail
  existe.
- **CA3:** Dado que não aceitei os termos e a política de privacidade, então o
  botão de criar conta fica desabilitado.
- **CA4:** Depois de criar a conta, sou levado à configuração inicial (US-005).

### US-002 — Entrar e sair

**Como** usuário, **quero** entrar com e-mail e senha e sair quando quiser,
**para** acessar minha agenda com segurança.

- Prioridade: Must · Release: R0 · Tamanho: P · RF-01

**Critérios de aceite**

- **CA1:** Dado credenciais válidas, quando entro, então vou para o painel
  "Hoje" (ou para a página que tentei abrir antes do login).
- **CA2:** Dado credenciais inválidas, então vejo "E-mail ou senha incorretos",
  sem dizer qual dos dois.
- **CA3:** Depois de 5 tentativas erradas em 15 min, o login daquela conta fica
  bloqueado por 15 min.
- **CA4:** Quando saio, a sessão é encerrada no servidor e qualquer página
  protegida me leva ao login.
- **CA5:** A opção "manter conectado" mantém a sessão por 30 dias; sem ela, a
  sessão expira ao fechar o navegador.

### US-003 — Recuperar senha

**Como** usuário, **quero** redefinir a senha pelo e-mail, **para** voltar a
acessar a conta se eu esquecer a senha.

- Prioridade: Must · Release: R0 · Tamanho: P · RF-01

**Critérios de aceite**

- **CA1:** Quando informo meu e-mail, recebo um link válido por 1 h e de uso
  único; a tela sempre mostra a mesma mensagem, exista ou não a conta.
- **CA2:** Ao redefinir, todas as outras sessões da conta são encerradas.

### US-004 — Entrar com Google

**Como** usuário, **quero** entrar com a minha conta Google, **para** não
precisar de mais uma senha.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-02

**Critérios de aceite**

- **CA1:** Dado que não tenho conta, quando entro com Google, então a conta é
  criada com nome e e-mail do Google e sigo para a configuração inicial.
- **CA2:** Dado que já tenho conta com o mesmo e-mail verificado, então as
  duas formas de login passam a valer para a mesma conta.

### US-005 — Configuração inicial

**Como** usuário recém-cadastrado, **quero** responder poucas perguntas sobre
como vou usar a agenda, **para** já começar com tudo ajustado.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-03 · RN-07, RN-16

**Critérios de aceite**

- **CA1:** Pergunta o modo de uso: "Só pessoal" ou "Atendo clientes". No modo
  pessoal, os passos de trabalho são pulados (US-091).
- **CA2:** O fuso horário vem detectado do navegador e pode ser trocado.
- **CA3:** No modo profissional, posso definir o horário de trabalho (com um
  padrão seg–sex, 9h–18h) e cadastrar o primeiro serviço, ou pular.
- **CA4:** Posso sair a qualquer momento; o que não preenchi fica com o
  padrão, e o painel mostra um lembrete para completar.

### US-006 — Exportar dados e excluir conta

**Como** usuário, **quero** baixar meus dados e excluir a conta, **para**
exercer meus direitos da LGPD.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-04 · ADR-0054

**Critérios de aceite**

- **CA1:** "Exportar dados" gera um arquivo (JSON + CSV de clientes e eventos)
  enviado por e-mail em até 24 h.
- **CA2:** "Excluir conta" pede a senha (ou reautenticação Google) e a
  digitação de "EXCLUIR"; a conta fica desativada na hora e é apagada de vez
  em 30 dias, período em que pode ser recuperada.
- **CA3:** Lembretes futuros dos clientes daquela conta são cancelados na
  hora.

---

## EP02 — Visualização da agenda

### US-010 — Agenda da semana

**Como** profissional, **quero** ver minha semana em colunas por dia e linhas
por hora, **para** ter a visão de quanto estou ocupado.

- Prioridade: Must · Release: R1 · Tamanho: G (quebrar: grade, eventos, sobreposição) · RF-05

**Critérios de aceite**

- **CA1:** A grade mostra 7 dias a partir do início da semana configurado
  (RN-16) e as horas em passos de 30 min, rolando até o horário de trabalho ao
  abrir.
- **CA2:** Cada evento aparece como bloco na cor do serviço ou da categoria
  (`BaseEventBlock`, componente `Calendar event` do Figma — ADR-0057), com
  hora, título e cliente; eventos sobrepostos dividem a largura da coluna.
- **CA3:** Atendimentos cancelados ficam ocultos por padrão (filtro US-015);
  faltas aparecem riscadas.
- **CA4:** No celular (< 600px), a visão semanal mostra 3 dias com rolagem
  lateral, ou vira a visão de dia (`[PENDENTE]` decisão de design — Q-07).
- **CA5:** É navegável por teclado: setas entre horários, Enter abre o evento
  ou a criação rápida.

### US-011 — Agenda do dia

**Como** profissional, **quero** ver só o dia, com mais detalhe, **para**
acompanhar os atendimentos enquanto trabalho.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-05

**Critérios de aceite**

- **CA1:** Mostra os eventos do dia com hora, cliente, serviço, local e
  status.
- **CA2:** É a visão padrão no celular.
- **CA3:** Os intervalos livres dentro do horário de trabalho aparecem
  marcados e, ao tocar, abrem a criação rápida já no horário.

### US-012 — Agenda do mês

**Como** usuário, **quero** ver o mês, **para** planejar com antecedência.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-05

**Critérios de aceite**

- **CA1:** Cada dia mostra até 3 eventos e "+N" para o resto; tocar no "+N"
  ou no dia abre a visão de dia.
- **CA2:** Dias bloqueados (férias, feriado) aparecem com fundo distinto.

### US-013 — Lista (agenda corrida)

**Como** usuário, **quero** ver os próximos eventos em lista, **para** ler
rápido o que vem pela frente.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-05

**Critérios de aceite**

- **CA1:** Lista agrupada por dia, a partir de hoje, carregando mais ao rolar.
- **CA2:** Dias sem evento não aparecem.

### US-014 — Navegar entre períodos

**Como** usuário, **quero** avançar, voltar, escolher uma data e voltar para
hoje, **para** encontrar rapidamente qualquer dia.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-05

**Critérios de aceite**

- **CA1:** Botões anterior/próximo, "Hoje" e seletor de data; atalhos de
  teclado `T` (hoje), `←`/`→` (período), `D`/`S`/`M`/`L` (visão).
- **CA2:** A visão e a data ficam na URL (`/agenda/semana/2026-11-04`), para
  recarregar e compartilhar sem perder o lugar.
- **CA3:** O período vizinho é pré-carregado, para a troca não esperar a
  rede (RNF-04).

### US-015 — Filtrar a agenda

**Como** profissional, **quero** filtrar por tipo (pessoal, atendimento),
status e serviço, **para** focar no que importa no momento.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-06

**Critérios de aceite**

- **CA1:** Os filtros escolhidos ficam salvos no dispositivo.
- **CA2:** Há um indicador visível quando algum filtro está ativo.

### US-016 — Hora atual e horário de trabalho

**Como** profissional, **quero** ver a linha da hora atual e o horário de
trabalho destacado, **para** me situar na grade.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-06

**Critérios de aceite**

- **CA1:** Uma linha marca a hora atual no dia de hoje e se move a cada minuto.
- **CA2:** Fora do horário de trabalho e em bloqueios, a grade fica com fundo
  atenuado (contraste AA mantido no texto).

---

## EP03 — Compromissos pessoais

### US-020 — Criar compromisso pessoal

**Como** usuário pessoal, **quero** criar um compromisso com título, data,
hora de início e fim, local e descrição, **para** não esquecer o que tenho
para fazer.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-07

**Critérios de aceite**

- **CA1:** Título e início são obrigatórios; o fim padrão é início + 1 h.
- **CA2:** O fim não pode ser antes do início (validação no formulário,
  ADR-0042).
- **CA3:** Se sobrepuser um atendimento, aparece um aviso, mas posso salvar
  (RN-01).
- **CA4:** Depois de salvar, o compromisso aparece na agenda sem recarregar a
  página.

### US-021 — Editar e mover compromisso

**Como** usuário, **quero** alterar um compromisso, inclusive arrastando-o na
grade, **para** ajustar a agenda quando os planos mudam.

- Prioridade: Must (edição) / Could (arrastar) · Release: R1 · Tamanho: M · RF-07

**Critérios de aceite**

- **CA1:** Abrir o evento mostra os detalhes e o botão de editar.
- **CA2:** (Could) Arrastar move o evento em passos de 15 min; arrastar a
  borda inferior muda a duração. Se o evento for recorrente, pergunta o
  alcance (RN-08).
- **CA3:** Uma alteração que falha no servidor desfaz a mudança na tela e
  mostra o erro (ADR-0040).

### US-022 — Excluir compromisso

**Como** usuário, **quero** excluir um compromisso pessoal, **para** limpar o
que não vai mais acontecer.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-07 · RN-06

**Critérios de aceite**

- **CA1:** Pede confirmação (`BaseConfirmDialog`) e oferece "Desfazer" por
  alguns segundos na notificação.
- **CA2:** Atendimentos não têm "excluir", só "cancelar" (US-064).

### US-023 — Dia inteiro e vários dias

**Como** usuário, **quero** marcar eventos de dia inteiro ou que duram vários
dias (viagem, férias), **para** representar a realidade da agenda.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-07 · RN-07

**Critérios de aceite**

- **CA1:** Eventos de dia inteiro aparecem numa faixa no topo das visões de
  dia e semana.
- **CA2:** Não mudam de dia quando o fuso da conta muda.

### US-024 — Categorias com cor

**Como** usuário pessoal, **quero** classificar compromissos em categorias com
cor (família, saúde, trabalho...), **para** distinguir de relance.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-08

**Critérios de aceite**

- **CA1:** As cores são as oito cores de evento do design system (`event/*`,
  ADR-0057), com fundo e texto em contraste AA.
- **CA2:** Há categorias iniciais editáveis; excluir uma categoria deixa os
  eventos sem categoria.

### US-025 — Lembrete para mim

**Como** usuário pessoal, **quero** receber um lembrete antes do compromisso,
**para** não perder a hora.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-09

**Critérios de aceite**

- **CA1:** Posso escolher um ou mais lembretes (10 min, 1 h, 1 dia, ou
  personalizado) por e-mail no R1 e por push a partir do R2 (US-083).
- **CA2:** Posso definir lembretes padrão nas configurações.

---

## EP04 — Painel, busca e criação rápida

### US-030 — Painel "Hoje"

**Como** profissional, **quero** abrir o app e ver o meu dia, **para** saber o
que vem a seguir sem procurar.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-10

**Critérios de aceite**

- **CA1:** Mostra o próximo evento em destaque (com contagem regressiva), a
  lista do dia e um resumo (atendimentos do dia, confirmados, livres).
- **CA2:** Mostra pendências: atendimentos passados ainda `scheduled` ou
  `confirmed` (marcar como concluído ou falta com um toque) e configuração
  inicial incompleta.
- **CA3:** É a página inicial (`/`) para quem está logado; substitui a
  boas-vindas atual do `modules/home`.

### US-031 — Busca global

**Como** usuário, **quero** buscar por nome de cliente ou título de evento,
**para** achar algo sem navegar pela agenda.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-12

**Critérios de aceite**

- **CA1:** Abre pelo cabeçalho ou pelo atalho `/`; busca a partir de 2
  caracteres, sem diferenciar acentos e maiúsculas.
- **CA2:** Resultados agrupados em clientes e eventos (próximos primeiro).

### US-032 — Criação rápida

**Como** profissional, **quero** um botão "+" sempre à mão e poder tocar num
horário vazio para criar um evento, **para** marcar um atendimento enquanto
falo com o cliente.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-11 · RNF-02

**Critérios de aceite**

- **CA1:** O "+" abre uma escolha: "Atendimento" ou "Compromisso" (no modo
  pessoal, vai direto ao compromisso).
- **CA2:** Tocar num horário vazio abre a criação já com data e hora.
- **CA3:** Na criação de atendimento, cliente e serviço são campos com busca;
  posso criar um cliente novo ali mesmo só com o nome.

---

## EP05 — Clientes

### US-040 — Cadastrar cliente

**Como** profissional, **quero** cadastrar um cliente com nome, telefone,
e-mail, data de nascimento e observações, **para** ter os contatos à mão e
lembrá-lo dos atendimentos.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-13 · RN-12

**Critérios de aceite**

- **CA1:** Só o nome é obrigatório; telefone (com DDD) e e-mail são validados
  quando informados.
- **CA2:** Há um campo de consentimento para receber lembretes, marcado só por
  ação do profissional e com data registrada (ADR-0054).
- **CA3:** Depois de salvar, vou para a ficha do cliente.

### US-041 — Listar e buscar clientes

**Como** profissional, **quero** ver meus clientes em lista com busca,
**para** encontrar alguém rápido.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-13

**Critérios de aceite**

- **CA1:** Lista paginada, ordenada por nome, com busca por nome, telefone ou
  e-mail; mostra o próximo atendimento de cada um.
- **CA2:** Filtros: ativos (padrão) ou arquivados.
- **CA3:** Estados de carregando, vazio e erro (componentes `Base*State`).

### US-042 — Editar cliente

**Como** profissional, **quero** editar os dados de um cliente, **para**
mantê-los atualizados.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-13

**Critérios de aceite**

- **CA1:** As mesmas validações do cadastro valem na edição.
- **CA2:** Mudar o e-mail de um cliente com lembretes agendados atualiza o
  destino deles.

### US-043 — Ficha do cliente

**Como** profissional, **quero** ver a ficha do cliente com os próximos e os
últimos atendimentos, **para** conhecer o histórico antes de atender.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-13

**Critérios de aceite**

- **CA1:** Mostra contatos (com atalho para ligar, e-mail e WhatsApp), próximos
  atendimentos, histórico (com status) e contagem de faltas.
- **CA2:** Tem botão para agendar atendimento já com o cliente preenchido.

### US-044 — Arquivar ou anonimizar cliente

**Como** profissional, **quero** arquivar quem não atendo mais e anonimizar a
pedido do cliente, **para** manter a lista limpa e cumprir a LGPD.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-13 · RN-13

**Critérios de aceite**

- **CA1:** Arquivar some com o cliente das listas e da busca; ele pode ser
  restaurado.
- **CA2:** Arquivar com atendimentos futuros pergunta se devo cancelá-los.
- **CA3:** Anonimizar é irreversível, pede confirmação e apaga os contatos;
  cliente sem atendimentos é excluído de vez.

### US-045 — Alerta de duplicidade

**Como** profissional, **quero** ser avisado quando cadastro um cliente com
telefone ou e-mail já existente, **para** não duplicar cadastros.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-14 · RN-12

**Critérios de aceite**

- **CA1:** O aviso mostra o cliente existente com link para abri-lo e não
  impede salvar.

### US-046 — Importar clientes

**Como** profissional que está migrando, **quero** importar clientes de um
CSV (ou dos contatos do celular), **para** não digitar tudo de novo.

- Prioridade: Could · Release: R1 · Tamanho: M · RF-30

**Critérios de aceite**

- **CA1:** Pré-visualização com mapeamento de colunas e as linhas com erro
  destacadas antes de importar.
- **CA2:** Duplicados (RN-12) são apontados e posso pular ou importar.

---

## EP06 — Serviços

### US-050 — Cadastrar serviço

**Como** profissional, **quero** cadastrar os serviços que ofereço com nome,
duração, preço, cor e intervalo depois do atendimento, **para** agendar mais
rápido e sem errar a duração.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-15 · RN-02, RN-04

**Critérios de aceite**

- **CA1:** Duração entre 5 min e 12 h, em passos de 5 min; preço opcional, em
  reais; intervalo de 0 a 120 min.
- **CA2:** Opcional: modalidade (presencial, online, a domicílio) e local
  padrão.

### US-051 — Editar e desativar serviço

**Como** profissional, **quero** editar e desativar serviços, **para**
acompanhar mudanças de preço e do que ofereço.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-15 · RN-04, RN-15

**Critérios de aceite**

- **CA1:** Alterar preço ou duração não muda atendimentos já criados (RN-04).
- **CA2:** Serviço com atendimentos só pode ser desativado, não excluído.

---

## EP07 — Atendimentos

### US-060 — Agendar atendimento

**Como** profissional, **quero** agendar um atendimento escolhendo cliente,
serviço, data e hora, **para** reservar o horário do cliente.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-16 · RN-01, RN-04, RN-11

**Critérios de aceite**

- **CA1:** Escolhido o serviço, o fim é calculado pela duração e pode ser
  ajustado.
- **CA2:** O atendimento nasce `scheduled`, na cor do serviço, e o lembrete é
  programado (US-080).
- **CA3:** Data no passado: pergunto se é registro retroativo; se sim, nasce
  `completed` e sem lembrete (RN-11).

### US-061 — Conflitos e fora do horário

**Como** profissional, **quero** ser impedido de marcar dois clientes no mesmo
horário e avisado quando marco fora do horário de trabalho, **para** não
criar problemas na agenda.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-17 · RN-01, RN-02, RN-03

**Critérios de aceite**

- **CA1:** Sobreposição com outro atendimento ativo (considerando intervalo e
  deslocamento) bloqueia o salvamento e mostra com quem conflita.
- **CA2:** Fora do horário de trabalho ou num bloqueio, aparece "Encaixe fora
  do horário. Confirmar?"; ao confirmar, salva.
- **CA3:** A verificação vale no servidor também (duas abas ou dois
  dispositivos ao mesmo tempo): o servidor responde 409 e a tela explica.

### US-062 — Sugerir horários livres

**Como** profissional, **quero** ver os próximos horários livres para o
serviço escolhido, **para** responder o cliente na hora.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-18 · RN-02, RN-03

**Critérios de aceite**

- **CA1:** Mostra até 6 horários livres a partir da data escolhida, dentro do
  horário de trabalho, respeitando duração e intervalo.
- **CA2:** Tocar num horário o preenche no formulário.
- **CA3:** Posso copiar a lista de horários como texto para enviar ao cliente.

### US-063 — Remarcar atendimento

**Como** profissional, **quero** remarcar um atendimento, **para** atender um
pedido do cliente sem perder o histórico.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-16 · RN-01

**Critérios de aceite**

- **CA1:** Mudar data ou hora valida conflitos de novo e reprograma o
  lembrete.
- **CA2:** O histórico do atendimento registra a remarcação (de → para).
- **CA3:** Opção de avisar o cliente por e-mail sobre a nova data.

### US-064 — Mudar o status

**Como** profissional, **quero** confirmar, concluir, cancelar ou marcar falta
num atendimento, **para** saber o que de fato aconteceu.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-16 · RN-05, RN-06

**Critérios de aceite**

- **CA1:** Só as transições permitidas pela RN-05 aparecem; o status usa o
  `BaseStatusChip` (componente `Chip` do Figma) com a cor do status.
- **CA2:** Cancelar pede motivo opcional, quem cancelou e se avisa o cliente;
  o lembrete é cancelado.
- **CA3:** Marcar falta só aparece depois do início do atendimento.

### US-065 — Atendimento recorrente

**Como** profissional (Ana), **quero** agendar um atendimento que se repete
toda semana no mesmo horário, **para** não ter que marcar sessão por sessão.

- Prioridade: Must · Release: R1 · Tamanho: G (quebrar: regra, ocorrências, conflitos) · RF-19 · RN-08

**Critérios de aceite**

- **CA1:** Repetição diária, semanal (dias escolhidos), a cada N semanas e
  mensal; fim por data, por número de ocorrências ou sem fim.
- **CA2:** Ocorrências que conflitam são listadas antes de salvar, com a
  opção de pular só essas.
- **CA3:** Vale para compromissos pessoais também.

### US-066 — Editar série recorrente

**Como** profissional, **quero** escolher se a mudança vale para esta
ocorrência, desta em diante ou para todas, **para** lidar com feriados e
mudanças de horário.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-19 · RN-08

**Critérios de aceite**

- **CA1:** Ao editar ou cancelar uma ocorrência, aparecem as três opções.
- **CA2:** "Todas" não altera ocorrências passadas já concluídas.
- **CA3:** Cancelar uma ocorrência não afeta as outras.

### US-067 — Local do atendimento

**Como** profissional (Carlos), **quero** informar o local ou o link online do
atendimento, **para** saber aonde ir e o cliente receber no lembrete.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-20

**Critérios de aceite**

- **CA1:** O local vem do serviço e pode ser trocado; endereço abre no app de
  mapas; link abre em nova aba.
- **CA2:** O local entra no lembrete ao cliente.

### US-068 — Observações do atendimento

**Como** profissional, **quero** escrever uma observação curta no atendimento,
**para** lembrar de algo específico ("trazer exames").

- Prioridade: Should · Release: R1 · Tamanho: P · RF-20

**Critérios de aceite**

- **CA1:** Até 1.000 caracteres; escolho se a observação vai ou não no
  lembrete ao cliente (padrão: não).

---

## EP08 — Disponibilidade

### US-070 — Horário de trabalho

**Como** profissional, **quero** definir os dias e horários em que atendo,
**para** a agenda saber quando estou disponível.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-21 · RN-16

**Critérios de aceite**

- **CA1:** Cada dia da semana tem zero ou mais intervalos (ex.: 8h–12h e
  14h–18h); intervalos do mesmo dia não se sobrepõem.
- **CA2:** Botão "copiar para os outros dias úteis".
- **CA3:** Mudar o horário não altera atendimentos já marcados; os que ficam
  fora passam a aparecer como encaixe.

### US-071 — Bloqueios

**Como** profissional, **quero** bloquear períodos (folga, férias, feriado,
consulta médica), **para** não marcarem atendimentos nesses horários.

- Prioridade: Must · Release: R1 · Tamanho: M · RF-21 · RN-03

**Critérios de aceite**

- **CA1:** Bloqueio por intervalo de horas ou dias inteiros, com motivo
  opcional, aparece na agenda.
- **CA2:** Criar bloqueio sobre atendimentos existentes lista quais são e
  oferece remarcar ou cancelar (com aviso ao cliente).
- **CA3:** (Could) Importar feriados nacionais do ano.

### US-072 — Intervalo e deslocamento

**Como** profissional (Carlos), **quero** que a agenda reserve intervalo e
tempo de deslocamento entre atendimentos, **para** não chegar atrasado.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-22 · RN-02

**Critérios de aceite**

- **CA1:** O intervalo vem do serviço; o deslocamento é informado no
  atendimento (antes dele) e aparece hachurado na grade.

---

## EP09 — Lembretes e notificações

### US-080 — Lembrete por e-mail ao cliente

**Como** profissional, **quero** que o cliente receba um lembrete automático
por e-mail, **para** diminuir as faltas.

- Prioridade: Must · Release: R1 · Tamanho: G (quebrar: agendamento, envio, modelo) · RF-23 · RN-09, RN-10

**Critérios de aceite**

- **CA1:** Enviado na antecedência configurada (padrão 24 h), com data, hora,
  serviço, local, nome do profissional e links de confirmar/cancelar (US-081).
- **CA2:** Remarcar reprograma; cancelar ou mudar para status final cancela.
- **CA3:** No atendimento aparece o estado do lembrete: programado, enviado,
  falhou (com motivo) ou não se aplica (sem e-mail ou sem consentimento).

### US-081 — Cliente confirma ou cancela pelo lembrete

**Como** cliente (Marcos), **quero** confirmar ou cancelar com um toque no
lembrete, **para** avisar o profissional sem precisar ligar.

- Prioridade: Should · Release: R1 · Tamanho: M · RF-24 · RN-14

**Critérios de aceite**

- **CA1:** O link abre uma página pública simples com os dados do atendimento
  e os botões "Confirmar" e "Cancelar" (cancelar pede confirmação).
- **CA2:** Confirmar muda para `confirmed`; cancelar muda para `canceled`
  ("cancelado pelo cliente"); o profissional é notificado.
- **CA3:** Link expirado ou já usado mostra a situação atual, sem erro
  técnico.

### US-082 — Resumo diário

**Como** profissional, **quero** receber de manhã um e-mail com o meu dia,
**para** me preparar antes de abrir o app.

- Prioridade: Could · Release: R1 · Tamanho: P · RF-29

**Critérios de aceite**

- **CA1:** Enviado no horário escolhido (padrão 7h, no fuso da conta), só em
  dias com eventos; pode ser desligado.

### US-083 — Notificações push

**Como** usuário, **quero** notificações no celular e no navegador, **para**
receber lembretes e avisos (cliente confirmou/cancelou) na hora.

- Prioridade: Should · Release: R2 · Tamanho: M · RF-43

**Critérios de aceite**

- **CA1:** A permissão é pedida só depois de uma ação do usuário, nunca ao
  abrir o app.
- **CA2:** Posso escolher quais avisos recebo por push e por e-mail.

### US-084 — Configurar lembretes

**Como** profissional, **quero** escolher a antecedência e personalizar o
texto do lembrete, **para** falar do meu jeito com os clientes.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-25 · RN-09

**Critérios de aceite**

- **CA1:** Antecedência entre 1 h e 72 h; até 2 lembretes por atendimento.
- **CA2:** Texto com variáveis (`{cliente}`, `{data}`, `{hora}`, `{servico}`,
  `{local}`) e pré-visualização.

---

## EP10 — Configurações

### US-090 — Preferências

**Como** usuário, **quero** ajustar fuso, formato de hora (24 h/12 h), início
da semana, idioma e tema, **para** a agenda ficar do meu jeito.

- Prioridade: Must · Release: R1 · Tamanho: P · RF-26 · RN-07, RN-16

**Critérios de aceite**

- **CA1:** As preferências ficam na conta (valem em todos os dispositivos);
  tema e idioma continuam no seletor do cabeçalho (template).
- **CA2:** Trocar o fuso pergunta se os horários de trabalho devem acompanhar.

### US-091 — Modo pessoal

**Como** usuário pessoal (Juliana), **quero** não ver clientes, serviços e
disponibilidade, **para** a agenda ser simples.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-27

**Critérios de aceite**

- **CA1:** No modo pessoal, os menus e opções profissionais somem; posso
  ativar o modo profissional depois, sem perder nada.

### US-092 — Instalar como app

**Como** profissional, **quero** instalar o Agenda na tela inicial do celular,
**para** abrir como um app.

- Prioridade: Should · Release: R1 · Tamanho: P · RF-28 · ADR-0056

**Critérios de aceite**

- **CA1:** Manifesto e ícones válidos; "instalar" oferecido de forma discreta
  depois do segundo acesso.
- **CA2:** Uma versão nova é aplicada com aviso "Atualização disponível".

---

## EP11 — Agendamento online (R2)

### US-100 — Página pública de agendamento

**Como** profissional, **quero** uma página pública com meus serviços e
horários livres, **para** os clientes marcarem sozinhos, a qualquer hora.

- Prioridade: Must · Release: R2 · Tamanho: G · RF-40

**Critérios de aceite**

- **CA1:** Endereço próprio (`agenda.app/ana-psicologa`), ativado e desativado
  nas configurações.
- **CA2:** Escolho quais serviços aparecem na página.

### US-101 — Cliente escolhe serviço e horário

**Como** cliente, **quero** escolher o serviço, ver os horários livres e
marcar informando nome, telefone e e-mail, **para** agendar em menos de 1
minuto.

- Prioridade: Must · Release: R2 · Tamanho: G · RF-40 · RN-02, RN-03

**Critérios de aceite**

- **CA1:** Só aparecem horários livres de verdade (disponibilidade − eventos −
  bloqueios − intervalos), no fuso do cliente, com o fuso indicado.
- **CA2:** Se o horário for tomado durante o preenchimento, aviso e ofereço os
  próximos.
- **CA3:** O cliente é associado a um cadastro existente pelo telefone/e-mail
  ou um novo é criado; o consentimento é coletado ali.
- **CA4:** Proteção contra abuso: limite por IP e desafio anti-robô.

### US-102 — Regras do agendamento online

**Como** profissional, **quero** definir antecedência mínima e máxima e se
aprovo cada pedido, **para** controlar o que entra na minha agenda.

- Prioridade: Must · Release: R2 · Tamanho: M · RF-40 · RN-17

### US-103 — Cliente cancela ou remarca

**Como** cliente, **quero** cancelar ou remarcar pelo link recebido, **para**
resolver sem precisar falar com o profissional.

- Prioridade: Should · Release: R2 · Tamanho: M · RF-41 · RN-18

### US-104 — Personalizar a página

**Como** profissional, **quero** colocar foto, bio, endereço e redes sociais
na página, **para** passar confiança.

- Prioridade: Should · Release: R2 · Tamanho: P · RF-42

---

## EP12 — Canais e integrações

### US-110 — Lembrete por WhatsApp

**Como** profissional, **quero** que o lembrete vá por WhatsApp, **para** o
cliente ver de verdade (e-mail é pouco lido no Brasil).

- Prioridade: Must · Release: R2 · Tamanho: G · RF-44 · RN-09 · ADR-0053

**Critérios de aceite**

- **CA1:** Envio pela API oficial (WhatsApp Business Platform) com modelos
  aprovados; respostas "1 Confirmar / 2 Cancelar" atualizam o status.
- **CA2:** Custo por mensagem considerado no plano (`[PENDENTE]` Q-04).

### US-111 — Sincronizar com o Google Agenda

**Como** usuário, **quero** que meus eventos do Google Agenda bloqueiem
horários no Agenda e que os atendimentos apareçam no Google, **para** não
manter duas agendas.

- Prioridade: Should · Release: R2 · Tamanho: G · RF-45

### US-112 — iCal e Outlook

**Como** usuário, **quero** assinar minha agenda por iCal e conectar o
Outlook, **para** ver os eventos em outros apps.

- Prioridade: Could · Release: R3 · Tamanho: M · RF-46

### US-113 — Link de videochamada

**Como** profissional que atende online, **quero** que o link da chamada
(Meet/Zoom) seja criado no agendamento, **para** não fazer isso à mão.

- Prioridade: Could · Release: R3 · Tamanho: M · RF-47

---

## EP13 — Financeiro (R3)

### US-120 — Registrar pagamento

**Como** profissional, **quero** marcar um atendimento como pago (valor, forma
e data), **para** saber quem me deve.

- Prioridade: Must · Release: R3 · Tamanho: M · RF-48 · RN-19

### US-121 — Pacotes e mensalidades

**Como** profissional (Ana), **quero** vender pacotes de sessões ou
mensalidades e ver o saldo de cada cliente, **para** controlar o que já foi
pago.

- Prioridade: Should · Release: R3 · Tamanho: G · RF-48 · RN-19

### US-122 — Recebíveis e inadimplência

**Como** profissional, **quero** ver o que tenho a receber e quem está em
atraso, **para** cobrar na hora certa.

- Prioridade: Should · Release: R3 · Tamanho: M · RF-49

### US-123 — Faturamento

**Como** profissional, **quero** ver o faturamento por período e por serviço,
**para** entender meu negócio.

- Prioridade: Should · Release: R3 · Tamanho: M · RF-49

### US-124 — Pix e sinal

**Como** profissional, **quero** cobrar por Pix e exigir sinal no agendamento
online, **para** reduzir faltas e receber mais rápido.

- Prioridade: Could · Release: R4 · Tamanho: G · RF-53

---

## EP14 — Registros e relacionamento (R3+)

### US-130 — Anotações do atendimento

**Como** profissional, **quero** escrever anotações privadas de cada
atendimento, **para** acompanhar a evolução do cliente.

- Prioridade: Should · Release: R3 · Tamanho: M · RF-50 · RN-20

### US-131 — Anexos na ficha

**Como** profissional, **quero** anexar arquivos (exames, fotos) à ficha do
cliente, **para** ter tudo num lugar só.

- Prioridade: Could · Release: R3 · Tamanho: M · RF-50

### US-132 — Aniversariantes e retorno

**Como** profissional, **quero** ver aniversariantes e clientes sem
atendimento há N dias, **para** manter o relacionamento.

- Prioridade: Could · Release: R3 · Tamanho: P · RF-52

### US-133 — Lista de espera

**Como** profissional, **quero** uma lista de espera que avisa quando um
horário vaga, **para** não perder receita com cancelamentos.

- Prioridade: Could · Release: R4 · Tamanho: M · RF-54

---

## EP15 — Relatórios (R3)

### US-140 — Ocupação e faltas

**Como** profissional, **quero** ver a taxa de ocupação e de faltas por
período, **para** ajustar horários e preços.

- Prioridade: Should · Release: R3 · Tamanho: M · RF-51

### US-141 — Exportar

**Como** profissional, **quero** exportar agenda e clientes em CSV e PDF,
**para** usar em planilhas ou imprimir.

- Prioridade: Should · Release: R3 · Tamanho: P · RF-51

---

## EP16 — Equipe (R5)

### US-150 — Convidar membros

**Como** dono de um estúdio, **quero** convidar profissionais e uma
secretária com perfis de acesso, **para** trabalharmos na mesma conta.

- Prioridade: Must · Release: R5 · Tamanho: G · RF-55

### US-151 — Agenda por profissional e recursos

**Como** dono, **quero** ver a agenda de cada profissional e reservar recursos
(salas, equipamentos), **para** evitar dois atendimentos na mesma sala.

- Prioridade: Must · Release: R5 · Tamanho: G · RF-55

### US-152 — Secretária

**Como** secretária, **quero** gerenciar a agenda dos profissionais sem ver
anotações privadas nem o financeiro, **para** atender os clientes com
segurança.

- Prioridade: Should · Release: R5 · Tamanho: M · RF-55 · RN-20
