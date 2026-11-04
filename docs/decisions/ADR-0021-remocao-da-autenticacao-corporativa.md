# ADR-0021: Remoção da autenticação corporativa e páginas públicas

- **Status:** Aceita
- **Data:** 2026-10-30
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0002, ADR-0003, ADR-0014, ADR-0015, ADR-0016, ADR-0017, ADR-0018

## Contexto e problema

O template nasceu em um ambiente corporativo e trazia o login integrado ao
provedor de identidade daquele ambiente (OAuth com BFF, cookie de sessão,
CSRF, `state` com nonce, mock de sessão e rota de exemplo protegida). O
template passa a ser usado em projetos pessoais, nos quais esse provedor não
existe. Ainda não há um backend de autenticação próprio. O que fazer com a
autenticação até lá?

## Drivers da decisão

- Nenhuma dependência de sistemas ou nomes do ambiente corporativo.
- O template deve rodar sem configuração de identidade nem mock.
- Não inventar agora um contrato de autenticação que o backend futuro vai
  definir.

## Opções consideradas

- **Manter a infraestrutura de auth genérica (guard, store de usuário, 401)
  com o mock sempre ligado** — preserva o desenho, mas mantém código morto e
  um contrato acoplado ao BFF antigo.
- **Remover toda a autenticação e tornar todas as páginas públicas** —
  escolhida.

## Decisão

Removemos toda a autenticação do template:

- `core/auth` (cliente OAuth e `state`/nonce), o guard do router, as rotas
  `/token` e `/erro-autenticacao`, a `user.store`, `useSession`,
  `shared/helpers/session`, o menu de conta do header e o módulo
  `protected-example`;
- o tratamento global de 401/CSRF da camada HTTP, o header de módulo e a
  instância `authBackend`: resta apenas `httpClient`, sem
  `credentials: 'include'`;
- o meta field `requiresAuth` e as variáveis do provedor de identidade, `VITE_AUTH_*`,
  `VITE_APP_MODULO` e `VITE_CSRF_*`. A URL da API passa a ser
  `VITE_API_BASE_URL`;
- a obrigatoriedade das variáveis restantes: `VITE_APP_NAME`,
  `VITE_APP_DEFAULT_LOCALE` e `VITE_API_BASE_URL` ganham valores padrão em
  `@core/config` e o `.env.test` deixa de existir.

As ADR-0003, ADR-0014, ADR-0015 e ADR-0017 passam a **Descontinuada**, com o
conteúdo resumido. Excepcionalmente, o texto original delas foi retirado do
repositório (continua no histórico do Git), porque descrevia detalhes de
integração do ambiente corporativo.

O piso de cobertura (ADR-0016) é rebaixado uma única vez para a cobertura
medida após a remoção (lines 29, functions 19, branches 51, statements 28):
saiu código bem testado do denominador, não houve perda de testes do que
permaneceu.

Uma tela de login própria será tratada em uma nova ADR quando o backend de
autenticação existir.

## Consequências

### Positivas

- O template roda sem nenhuma configuração de identidade.
- Menos código, variáveis de ambiente e testes acoplados a um ambiente externo.

### Negativas / trade-offs

- Não há mais exemplo de rota protegida nem de guard; ele terá de ser
  recriado junto com o login próprio.
- O piso de cobertura cai em valor absoluto.

### Neutras

- `shared/utils/cookie.ts` permanece como utilitário genérico.
  (Nota de 2026-10-30: removido depois, por não ter nenhum consumidor.)

## Referências

- `src/app/providers/router.ts`, `src/shared/api/instances/index.ts`,
  `src/core/config/index.ts`, `.env.example`, `vite.config.ts`.
