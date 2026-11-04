# ADR-0002: Camada HTTP via factory `createApiInstance` + ofetch

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0001, ADR-0003

## Contexto e problema

A aplicação consome APIs internas e o provedor de autenticação. É preciso
padronizar as chamadas HTTP, evitar duplicação de cabeçalhos e tratamento de
erros, e manter as views desacopladas do transporte. Como estruturar a camada
de comunicação com o backend?

## Drivers da decisão

- DRY: cabeçalhos e interceptors definidos em um único lugar.
- Testabilidade: poder mockar o service em vez de interceptar a rede.
- Separação de responsabilidades: views não conhecem URLs nem transporte.
- Tipagem forte no retorno das requisições.

## Opções consideradas

- **Factory `createApiInstance(baseURL)` sobre ofetch + services semânticos** —
  uma fábrica que devolve `get/post/put/patch/delete` tipados por generics,
  consumida apenas por services.
- **Chamar `ofetch` diretamente nos componentes/views** — descartada
  explicitamente como antipadrão na documentação.

> Não há comparação documentada com outras bibliotecas HTTP (por exemplo,
> axios); a escolha do ofetch não registrou alternativas avaliadas.

## Decisão

Adotamos uma factory `createApiInstance(baseURL)` (em
`src/shared/api/instances/index.ts`) construída sobre `ofetch`, expondo métodos
tipados por generics. As instâncias eram pré-configuradas: `httpClient`
(API interna), uma instância para o provedor de identidade e `authBackend`
(backend de autenticação). As requisições enviam credenciais (`credentials: 'include'`)
para que o cookie de sessão trafegue automaticamente. Views e stores consomem
funções de `src/shared/api/services/`, nunca chamando endpoints diretamente.

> Nota (ADR-0021): com a remoção da autenticação corporativa, resta apenas a
> instância `httpClient` (`VITE_API_BASE_URL`), sem `credentials: 'include'`,
> CSRF nem tratamento global de 401.

> Nota (ADR-0014): originalmente a factory injetava o header `Authorization` a
> partir do token no cliente. Com a adoção do cookie `HttpOnly`, o header manual
> foi removido em favor de `credentials: 'include'`.

## Consequências

### Positivas

- Um único ponto para cabeçalhos, timeout e tratamento de erro.
- Services com nomes de negócio (ex.: `getUserDataRequest`) facilitam leitura.
- Testes mockam o service, sem interceptar rede.

### Negativas / trade-offs

- Camada extra de indireção entre a view e o transporte.
- Novos endpoints exigem criar/atualizar um service.

### Neutras

- Acoplamento ao `ofetch` como cliente HTTP subjacente.

## Referências

- `src/shared/api/README.md` — factory e services.
- `src/shared/api/instances/index.ts` — implementação da factory.
- `docs/ARCHITECTURE-GUIDE.md` — Camada HTTP.
- `package.json` — `ofetch`.
