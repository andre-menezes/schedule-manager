# ADR-0053: Lembretes e notificações processados pelo backend, por canal

- **Status:** Proposta
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0049, ADR-0054

## Contexto e problema

Lembretes automáticos são a principal arma contra faltas (US-080). Precisam
sair na hora certa mesmo com o app fechado, ser reprogramados quando o
atendimento muda e registrar falhas (RNF-09). O canal começa no e-mail (R1)
e cresce para push e WhatsApp (R2). Onde e como processar?

## Drivers da decisão

- Envio confiável, independente do navegador.
- Canais novos sem mudar o resto.
- Custo por mensagem (WhatsApp — Q-04).

## Opções consideradas

- **Fila de jobs no backend** com um `Reminder` por envio e um adaptador por
  canal — recomendada.
- **Agendamento pelo frontend** (Notification API/Service Worker): não
  funciona com o app fechado nem para o cliente.
- **Ferramenta de terceiros de "notificações"**: rápida, mas mais um
  fornecedor com dados pessoais (LGPD) e custo por evento.

## Decisão

Propomos:

- O backend cria, reprograma e cancela `Reminder` a cada mudança do evento.
  Um worker envia os vencidos, com até 3 novas tentativas e estado
  `failed` com motivo.
- Adaptadores por canal: `email` (R1, provedor da Q-11), `push` (R2, Web
  Push/VAPID), `whatsapp` (R2, API oficial via BSP).
- Links do cliente usam `ActionToken` de uso único com hash no banco
  (RN-14).
- O frontend só exibe o estado do lembrete e as preferências; não envia nada.

## Consequências

### Positivas

- O lembrete sai mesmo com o profissional offline.
- Um canal novo é um adaptador novo.

### Negativas / trade-offs

- Exige worker e fila na infraestrutura (Q-01).
- E-mail exige domínio com SPF, DKIM e DMARC para não cair no spam.

### Neutras

- O resumo diário (US-082) usa o mesmo mecanismo.

## Referências

- `docs/requirements/REQUIREMENTS.md` (RN-09, RN-10, RN-14)
