# ADR-0001: Arquitetura em camadas e regras de dependência

- **Status:** Aceita
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0004, ADR-0009, ADR-0010

## Contexto e problema

O template precisa de uma organização de código que escale com o crescimento do
domínio, mantenha responsabilidades isoladas e evite acoplamento entre partes
não relacionadas. Como estruturar `src/` para que features cresçam sem virar um
emaranhado de dependências cruzadas?

## Drivers da decisão

- Separação de responsabilidades (SRP) e baixo acoplamento.
- Previsibilidade: saber onde cada tipo de código deve morar.
- Independência entre features de domínio.
- Facilidade de teste e de onboarding.

## Opções consideradas

- **Arquitetura em camadas com regras de dependência** — `app`, `modules`,
  `shared`, `types` (+ `test` e `cypress`), com fluxo de dependência
  unidirecional.

> Não houve alternativa formalmente avaliada e documentada (por exemplo,
> estrutura flat ou organização por tipo de arquivo). A decisão foi herdada da
> concepção inicial do template.

## Decisão

Adotamos uma arquitetura em camadas com contrato de dependência unidirecional:

```text
app        → inicialização, plugins, auth e composição de rotas
modules    → funcionalidades por domínio (features)
shared     → infraestrutura transversal reutilizável
types      → contratos TypeScript centralizados por contexto
test       → validação automatizada (unitários e integração)
cypress    → testes end-to-end
```

Regras: `app` e `modules` podem importar de `shared` e `types`; `shared` só de
`types`; `types` não importa de ninguém; `test` importa de todas. Nenhum módulo
importa de outro módulo, e `shared` nunca importa de `app` ou `modules`.

## Consequências

### Positivas

- Dependências previsíveis e verificáveis no code review.
- Features isoladas: um módulo pode evoluir sem afetar outros.
- Código reutilizável concentrado em `shared/`.

### Negativas / trade-offs

- Exige disciplina: lógica compartilhada entre módulos precisa ser promovida a
  `shared/` em vez de importada diretamente de outro módulo.
- Mais estrutura inicial do que uma abordagem flat.

### Neutras

- As regras de dependência são reforçadas por convenção e revisão, não por
  ferramenta automatizada.

## Referências

- `docs/ARCHITECTURE-GUIDE.md` — Visão em camadas, Diagrama de dependência.
- `docs/CODE-REVIEW-CHECKLIST.md` — itens bloqueantes de arquitetura.
- `src/*/README.md` — regras locais de cada camada.
- `agent/skills/vue-vuetify-dev/SKILL.md`.
