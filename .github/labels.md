# Labels do Projeto (GitHub)

Padronização das labels usadas em issues e pull requests. As labels seguem o
formato `escopo: valor`. O GitHub não impõe exclusividade dentro de um escopo,
então por convenção uma issue tem **no máximo uma** label de cada escopo (por
exemplo, nunca `prioridade: alta` e `prioridade: baixa` ao mesmo tempo).

> As labels precisam ser criadas no GitHub (repositório → Issues → Labels).
> Este arquivo é a fonte de verdade do esquema; mantenha-o sincronizado ao
> criar/alterar labels. Os templates de issue já aplicam `tipo: *` e
> `status: backlog`.

## Escopo: tipo

Natureza da demanda. Alinha-se aos tipos de Conventional Commits.

| Label            | Cor       | Descrição                                 |
| ---------------- | --------- | ----------------------------------------- |
| `tipo: feature`  | `#6D8CFF` | Nova funcionalidade                       |
| `tipo: bug`      | `#FF6B6B` | Correção de comportamento incorreto       |
| `tipo: refactor` | `#00B8A9` | Mudança sem alterar comportamento externo |
| `tipo: docs`     | `#F4A261` | Documentação                              |
| `tipo: test`     | `#168A63` | Testes                                    |
| `tipo: chore`    | `#8E9AAF` | Manutenção, infra, dependências           |

## Escopo: prioridade

Urgência relativa da demanda.

| Label               | Cor       | Descrição                   |
| ------------------- | --------- | --------------------------- |
| `prioridade: alta`  | `#D64550` | Resolver o quanto antes     |
| `prioridade: media` | `#E9A23B` | Fluxo normal de priorização |
| `prioridade: baixa` | `#4C9A6E` | Pode aguardar               |

## Escopo: status

Estado no fluxo de trabalho.

| Label                  | Cor       | Descrição                        |
| ---------------------- | --------- | -------------------------------- |
| `status: backlog`      | `#B0B7C3` | Aguardando priorização           |
| `status: em-andamento` | `#6D8CFF` | Em desenvolvimento               |
| `status: em-revisao`   | `#F4A261` | Aguardando code review           |
| `status: bloqueado`    | `#D64550` | Impedido por dependência externa |
| `status: concluido`    | `#168A63` | Finalizado                       |

## Escopo: severidade (bugs)

Aplicada a issues do tipo `bug` para indicar impacto.

| Label                 | Cor       | Descrição                         |
| --------------------- | --------- | --------------------------------- |
| `severidade: critica` | `#8B0000` | Bloqueia uso ou corrompe dados    |
| `severidade: alta`    | `#D64550` | Funcionalidade importante afetada |
| `severidade: media`   | `#E9A23B` | Contornável                       |
| `severidade: baixa`   | `#4C9A6E` | Cosmético                         |

## Boas práticas

- Toda issue deve ter ao menos `tipo: *` e `status: *`.
- Bugs devem receber `severidade: *` além de `tipo: bug`.
- PRs herdam o `tipo: *` da issue relacionada.
- Atualize `status: *` conforme a demanda avança no fluxo.
