# types

Contratos TypeScript centralizados por contexto.

Voltar para o guia geral: [../../docs/ARCHITECTURE-GUIDE.md](../../docs/ARCHITECTURE-GUIDE.md)

## Objetivo

- evitar tipos duplicados em views, components e stores
- facilitar a evolução dos contratos com o backend
- manter a semântica clara entre entrada (API) e consumo interno (UI)

## Organização atual

Cada subpasta representa um contexto compartilhado por dois ou mais módulos ou
camadas, consumido via alias `@typings/<contexto>`. Tipos usados por um módulo
só ficam em `src/modules/<x>/types.ts` (ADR-0025).

- `store`: modelos usados pelas stores e pela camada de UI
- `services`: contratos genéricos da camada HTTP (query, body, options) e de
  paginação (`PageParams`, `PaginatedResponse<TItem>`)
- `components`: contratos de props de componentes compartilhados
- `theme`: contratos de tema do Vuetify
- `router`: augmentation de `RouteMeta` (`layout`)
- `http`: corpo de erro RFC 9457 (`ProblemDetails`)

> `types` não importa de nenhuma camada (verificado pelo ESLint). O schema de
> mensagens i18n (`MessageSchema`) é derivado do JSON do locale base (pt-BR)
> e por isso fica em `app/providers/messages.ts` (reexportado por
> `app/providers/i18n.ts`).

> O alias é `@typings` (e não `@types`) porque `@types` colide com o
> namespace reservado do TypeScript para pacotes do DefinitelyTyped.

## Convenção de nomenclatura

Seguimos a convenção da comunidade TypeScript, alinhada às
[diretrizes oficiais da Microsoft](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines).
O conteúdo abaixo foi reescrito para adequação às restrições de licenciamento.

### Regras gerais

| Elemento            | Convenção           | Exemplo                         |
| ------------------- | ------------------- | ------------------------------- |
| Interface           | PascalCase, sem `I` | `UserDataResponse`              |
| Type alias          | PascalCase          | `ArchitectureItem`, `ThemeName` |
| Enum (nome)         | PascalCase singular | `UserRole`                      |
| Enum (membros)      | PascalCase          | `UserRole.Admin`                |
| Generic (parâmetro) | PascalCase, 1 letra | `T`, `K`, `V`, ou `TResponse`   |
| Propriedades        | camelCase           | `accessToken`                   |
| Constantes de união | PascalCase no type  | `type ThemeName = 'light'`      |

### Interface: nunca use o prefixo `I`

O TypeScript já distingue tipos de valores; o prefixo `I` é herança do C# e
não agrega informação. Dê um nome que descreva o papel do contrato.

```ts
// BOM: nome descritivo, sem prefixo
export interface UserDataResponse {
  login: string;
  email: string[];
}
```

```ts
// RUIM: prefixo I decora o nome sem agregar significado
export interface IUserData {
  login: string;
  email: string[];
}
```

Por que o ruim é ruim: viola a diretriz oficial (`Do not use I as a prefix`),
adiciona ruído visual e cria inconsistência quando parte do time esquece o
prefixo. O nome deve expressar o conceito, não a mecânica da linguagem.

### Não decore o nome com o tipo

O nome não deve repetir a informação que o próprio tipo já carrega.

```ts
// BOM: o sufixo indica o papel semântico (contrato de resposta da API)
export interface TokenResponse {
  accessToken: string;
}
```

```ts
// RUIM: "Interface" e "Type" não dizem nada sobre o domínio
export interface TokenResponseInterface {
  accessTokenString: string;
}
```

Por que o ruim é ruim: `Interface` no nome é redundante, e `String` no campo
duplica a informação que a anotação `: string` já dá.

### interface vs type

Prefira `interface` para modelar objetos e contratos que podem ser estendidos.
Use `type` para uniões, interseções, tuplas, mapeamentos e utilitários.

```ts
// BOM: objeto de domínio como interface (aberta a extensão)
export interface Metric {
  label: string;
  value: string | number;
}

// BOM: union e derivação como type
export type ThemeName = 'light' | 'dark';
export type ArchitectureItem = Omit<Command, 'code'>;
```

```ts
// RUIM: union expressa como interface não é possível de forma direta,
// e forçar objeto via type perde a semântica de contrato extensível
type Metric = { label: string; value: string | number };
type ThemeUnion = { name: 'light' } | { name: 'dark' }; // verboso à toa
```

### Enums: PascalCase e valores explícitos

Use enums para conjuntos fechados e estáveis. Nomeie no singular e dê valores
explícitos para evitar acoplamento à ordem numérica.

```ts
// BOM: nome singular, membros PascalCase, valores explícitos
export enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}
```

```ts
// RUIM: plural, membros em SCREAMING_CASE e valores numéricos implícitos
export enum UserRoles {
  ADMIN, // 0 — quebra se alguém reordenar
  EDITOR, // 1
}
```

Por que o ruim é ruim: valores numéricos implícitos quebram a serialização
quando os membros são reordenados, e o plural sugere coleção em vez de tipo.

> Para uniões simples de string, prefira um `type` literal a um enum:
> `type UserRole = 'ADMIN' | 'EDITOR'`. É mais leve e não gera código em runtime.

### Generics: descritivos quando ajudam

Uma letra basta em casos triviais (`T`). Quando há mais de um parâmetro ou o
papel não é óbvio, use um nome com prefixo `T`.

```ts
// BOM: nomes descritivos deixam claro o papel de cada parâmetro
export interface RequestOptions<TQuery = QueryParams, TBody = BodyParams> {
  query?: TQuery;
  body?: TBody;
}
```

```ts
// RUIM: letras soltas sem relação com o domínio dificultam a leitura
export interface RequestOptions<A = QueryParams, B = BodyParams> {
  query?: A;
  body?: B;
}
```

### Separe contrato de API do contrato de UI

Quando o payload do backend difere do modelo consumido pela aplicação, mantenha
os dois tipos e um mapeamento explícito entre eles.

```ts
// BOM: origem (API) e destino (UI) são tipos distintos
// @typings/user  -> resposta crua da API
export interface UserDataResponse {
  nomeUsuario: string;
}
// @typings/store -> modelo consumido pela UI
export interface UserDataResponse {
  nome: string;
}
// mapeamento explícito no service
function mapUser(input: ApiUser): UiUser {
  return { nome: input.nomeUsuario };
}
```

```ts
// RUIM: usar any esconde a diferença e derruba a checagem de tipos
function mapUser(input: any): any {
  return { nome: input.nomeUsuario };
}
```

## Boas práticas

- criar interfaces no contexto correto, evitando um tipo global genérico
- ao mapear payload de API para UI, manter tipos de origem e destino
- evitar `any` em contratos de domínio; prefira `unknown` quando o tipo é aberto
- sufixos semânticos ajudam: `Response` (API), `Params`, `State`, `Props`
