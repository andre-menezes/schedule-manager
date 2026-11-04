# ADR-0016: Portões de qualidade efetivos — typecheck real, cobertura com piso e ambiente de teste versionado

- **Status:** Aceita
- **Data:** 2026-10-29
- **Decisores:** Time de frontend / Arquitetura
- **Relacionadas:** ADR-0005 (Estratégia de testes), ADR-0011 (Fluxo de contribuição: commits, hooks e CI)

> Nota (ADR-0021): o piso de cobertura foi rebaixado uma única vez, para a
> cobertura medida após a remoção da autenticação corporativa (código testado
> saiu do denominador). Depois disso, o ratchet volta a valer.
>
> Nota (ADR-0022): o CI passou do GitLab para o GitHub Actions.
>
> Nota (2026-10-30): segunda exceção ao ratchet. A remoção do
> `shared/utils/cookie.ts`, sem nenhum consumidor e 100% coberto pelo próprio
> teste, tirou linhas cobertas do denominador: lines caiu para 37,99% e
> statements para 36,45%. O piso foi para lines 37 e statements 36; functions
> e branches não mudaram. Apagar código morto testado não deve ser barrado
> pelo piso; acrescentar código sem teste continua sendo.
>
> Nota (ADR-0021): o `.env.test` foi removido. As variáveis de ambiente
> ganharam valores padrão em `@core/config`, então a suíte roda igual na
> máquina do desenvolvedor e no CI sem nenhum arquivo `.env`.

## Contexto e problema

Uma auditoria do template mostrou que três portões de qualidade documentados
não eram aplicados:

1. **Typecheck:** `npm run build` executava `vue-tsc --noEmit` sobre o
   `tsconfig.json` raiz, que tem `"files": []` e apenas `references`. Sem `-b`,
   nenhum arquivo era verificado (`--listFilesOnly` retornava 0 arquivos).
2. **Cobertura:** `coverage.include` estava vazio (restos comentados de outro
   projeto). O relatório saía com 0% em "All files" e os thresholds
   (95/100/90/95, definidos na ADR-0005) nunca eram aplicados. A cobertura real
   medida era de ~35% de linhas.
3. **Ambiente de teste:** `@app/config` exige variáveis `VITE_*` na carga. O
   Vitest (modo `test`) não lê o `.env.development.local` indicado no
   CONTRIBUTING, então a suíte falhava localmente; no CI, o `.env.example`
   copiado tinha valores diferentes dos esperados pelos testes. Um teste também
   disparava uma requisição HTTP real.

## Drivers da decisão

- A documentação não pode prometer garantias que o pipeline não cumpre.
- O template é copiado: um portão inerte se replica em todos os projetos.
- A suíte deve rodar igual na máquina do desenvolvedor e no CI, sem rede.

## Opções consideradas

- **Thresholds de 95% com `include` corrigido** — reprovaria todo MR de
  imediato (cobertura real ~37%) e levaria a desligar o gate.
- **Excluir as telas de documentação da medição para "atingir" 95%** — maquia o
  número e não reflete o código entregue.
- **Piso que só sobe (ratchet)** — o threshold é a cobertura real atual e é
  elevado a cada aumento. Escolhida.

## Decisão

1. `typecheck` e `build` usam `vue-tsc -b`, que verifica todos os projetos
   referenciados (app, node e cypress).
2. `coverage.include` mede `src/**/*.{ts,vue}` (excluindo testes, `types/`,
   `*.d.ts`, `main.ts` e barrels). Os thresholds passam a ser um **piso
   ratchet** igual à cobertura medida (lines 39, functions 23, branches 48,
   statements 36). Esta decisão substitui os valores de threshold da ADR-0005;
   o restante daquela ADR segue vigente.
3. Um `.env.test` versionado, com valores fictícios, alimenta o Vitest. O CI
   deixa de copiar o `.env.example`.
4. Testes unitários não acessam a rede: serviços HTTP são sempre mockados.
5. O CI instala dependências com `npm ci` (instalação reprodutível a partir do
   lockfile).

## Consequências

### Positivas

- Erros de tipo e quedas de cobertura passam a reprovar o pipeline.
- A suíte roda sem configuração local e sem dependência de rede.
- Os números da documentação correspondem ao que é medido.

### Negativas / trade-offs

- O piso atual é baixo; elevar a cobertura vira trabalho explícito do roadmap.
- `vue-tsc -b` grava `tsbuildinfo` em `node_modules/.tmp` (cache incremental).

### Neutras

- Quem aumentar a cobertura deve atualizar os thresholds no mesmo MR.

## Referências

- `package.json` — scripts `typecheck` e `build`.
- `vite.config.ts` — bloco `test.coverage`.
- `.env.test` — variáveis do ambiente de teste.
- `.gitlab-ci.yml` — jobs `install` e `test`.
