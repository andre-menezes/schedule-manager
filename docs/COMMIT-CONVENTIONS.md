# Convenções de Commit

Padrão de mensagens de commit adotado no projeto. Segue o formato
[Conventional Commits](https://www.conventionalcommits.org/) com mensagens
escritas em **português**.

Voltar para o guia geral: [ARCHITECTURE-GUIDE.md](ARCHITECTURE-GUIDE.md)

---

## Formato

```text
<tipo>(<escopo>): <descrição curta>

<corpo opcional — explica o porquê da mudança>
```

### Regras

- **Descrição curta**: imperativo, máximo 72 caracteres, sem ponto final.
- **Linha em branco** entre o título e o corpo.
- **Corpo**: opcional, explica motivação e contexto, com linhas de no máximo
  72 colunas.
- **Idioma**: português (descrição e corpo).
- **Tipo e escopo**: em inglês (convenção técnica universal).

### O que o hook `commit-msg` verifica

O hook (`scripts/verify-commit-msg.mjs`, com testes em
`scripts/verify-commit-msg.spec.mjs`) reprova o commit quando:

- o título não segue `tipo(escopo): descrição`, passa de 72 caracteres ou
  termina com ponto final;
- a segunda linha não está em branco;
- uma linha do corpo passa de 72 colunas.

Ficam de fora da contagem:

- linhas de comentário (`#`) e o diff abaixo da linha de corte do
  `git commit --verbose`;
- trailers do último parágrafo, como `Co-Authored-By:` e `Claude-Session:`;
- uma URL sozinha na linha, que não tem onde quebrar (pode vir depois de um
  marcador como `-`, `1.` ou `[1]:`).

Mensagens de merge e revert geradas pelo Git (`Merge ...`, `Revert ...`) não
são validadas.

---

## Tipos

| Tipo       | Quando usar                                                     |
| ---------- | --------------------------------------------------------------- |
| `feat`     | Nova funcionalidade visível ao usuário                          |
| `fix`      | Correção de bug                                                 |
| `docs`     | Apenas documentação (README, comentários, guias)                |
| `refactor` | Alteração de código sem mudar comportamento externo             |
| `test`     | Adição ou correção de testes                                    |
| `chore`    | Tarefas de manutenção (deps, configs, scripts, CI)              |
| `style`    | Formatação, espaçamento, lint (sem alteração de lógica)         |
| `perf`     | Melhoria de performance                                         |
| `ci`       | Alteração de pipeline CI/CD                                     |
| `revert`   | Reversão de commit anterior                                     |
| `build`    | Sistema de build e dependências (Vite, scripts, tsconfig)       |
| `wip`      | Progresso parcial em branch de trabalho; reescrever antes do PR |

A lista acima é a mesma aceita pelo hook `commit-msg`
(`scripts/verify-commit-msg.mjs`), que é a fonte de verdade.

---

## Escopos

O escopo identifica a camada ou módulo afetado. Use o nome da pasta/contexto:

| Escopo     | Exemplos de uso                             |
| ---------- | ------------------------------------------- |
| `auth`     | Fluxo de autenticação, sessão, state, guard |
| `http`     | Instâncias HTTP, interceptors, services     |
| `stores`   | Stores Pinia                                |
| `ui`       | Componentes compartilhados, layouts         |
| `config`   | Variáveis de ambiente, constantes           |
| `router`   | Rotas, guards, navegação                    |
| `i18n`     | Traduções, locale                           |
| `core`     | Camada core (config, constantes)            |
| `home`     | Módulo Home                                 |
| `<módulo>` | Nome da pasta do módulo (ex.: `decisions`)  |
| `types`    | Contratos TypeScript                        |
| `test`     | Testes unitários e E2E                      |
| `deps`     | Dependências (instalar, atualizar, remover) |

O escopo é **opcional** — omita quando a mudança é transversal demais para
caber em um único escopo.

---

## Exemplos de boas mensagens

```text
feat(auth): implementar refresh automático de token expirado

fix(http): corrigir header de autorização não enviado após refresh

docs(stores): documentar padrão de criação de nova store

refactor(ui): extrair lógica de tema para composable useTheme

test(router): adicionar cenário de token expirado no guard

chore(deps): atualizar vuetify para 4.2.0

style: aplicar formatação Prettier em arquivos .vue

perf(home): lazy load do gráfico de dependências
```

---

## Exemplos de más mensagens

```text
# RUIM: genérico demais, não diz o que mudou
fix: correções

# RUIM: em inglês (nosso padrão é português na descrição)
feat(auth): add token refresh mechanism

# RUIM: sem tipo
corrigir bug no login

# RUIM: descrição muito longa (> 72 caracteres)
feat(customers): adicionar página de listagem de clientes com filtros avançados e paginação server-side

# RUIM: com ponto final
fix(router): corrigir redirecionamento após login.

# RUIM: passado ao invés de imperativo
feat(home): adicionou card de métricas
```

---

## Quando usar corpo

Use corpo quando a descrição curta não é suficiente para explicar o **porquê**:

```text
refactor(http): substituir pluginPrettier.configs.recommended por registro manual

O preset recommended do eslint-plugin-prettier usa a chave 'extends' no
formato eslintrc, incompatível com o flat config do ESLint 10. Registramos
o plugin manualmente para evitar o erro em runtime.
```

---

## Breaking changes

Se o commit introduz uma mudança que quebra compatibilidade, adicione `!`
após o tipo/escopo e explique no corpo:

```text
refactor(http)!: renomear alias @types para @typings

O alias @types conflita com o namespace do DefinitelyTyped. Todos os
imports de '@types/*' devem ser atualizados para '@typings/*'.
```

---

## Frequência de commits

- Commite **com frequência** — cada commit deve representar uma unidade
  lógica de trabalho (uma responsabilidade).
- Evite commits gigantes misturando feature + refactor + docs.
- Se percebeu que acumulou muitas mudanças, separe em commits atômicos
  antes de abrir PR (use `git add -p` para staging parcial).

---

## Resumo rápido

```text
tipo(escopo): descrição em português, imperativo, ≤72 chars
│     │        │
│     │        └─ o que foi feito (sem ponto final)
│     └────────── camada ou módulo afetado (opcional)
└──────────────── natureza da mudança (feat, fix, docs...)
```
