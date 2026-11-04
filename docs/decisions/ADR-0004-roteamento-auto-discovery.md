# ADR-0004: Roteamento por auto-discovery via `import.meta.glob`

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0001

> Nota (2026-11-03): o glob passou a ser `@/{app,modules}/**/routes.ts`.
> Com `@/**/routes.ts`, um `routes.ts` em qualquer pasta de `src/` (por
> exemplo, um helper de teste) virava rota do app.

## Contexto e problema

Cada módulo de domínio define suas próprias rotas. Registrar rotas manualmente
em um arquivo central cria acoplamento e um passo extra propenso a esquecimento.
Como registrar as rotas dos módulos com o mínimo de fricção?

## Drivers da decisão

- Baixo acoplamento: adicionar um módulo não deve exigir editar arquivo central.
- Menos passos manuais na criação de features.
- Consistência com a independência entre módulos (ADR-0001).

## Opções consideradas

- **Auto-discovery via `import.meta.glob`** — o router importa automaticamente
  todos os `routes.ts` do projeto.

> A alternativa de registro manual e centralizado de rotas é o que se evita, mas
> não foi formalmente avaliada e comparada na documentação.

## Decisão

O router carrega automaticamente todos os arquivos `routes.ts` via
`import.meta.glob('@/**/routes.ts', { eager: true })`. Cada módulo exporta um
`RouteRecordRaw[]` default, com lazy loading (`() => import(...)`) e meta fields
(`requiresAuth`, `layout`). Criar um `routes.ts` já registra a rota, sem editar
nenhum arquivo central.

## Consequências

### Positivas

- Adicionar um módulo é autocontido: basta criar o `routes.ts`.
- Reduz erros de esquecer de registrar uma rota.

### Negativas / trade-offs

- O conjunto de rotas não é visível em um único arquivo; entender todas as rotas
  exige varrer os módulos.
- Depende de um recurso específico do bundler (Vite).

### Neutras

- Convenção de nome de arquivo (`routes.ts`) passa a ser significativa.

## Referências

- `docs/ARCHITECTURE-GUIDE.md` — Composição de rotas, Fluxo de inicialização.
- `docs/ONBOARDING.md` — Passo 1 (criar o módulo).
- `src/app/providers/router.ts` — implementação do glob.
