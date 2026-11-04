# ADR-0042: Formulários com VeeValidate e Zod

- **Status:** Aceita
- **Data:** 2026-11-04
- **Decisores:** Andre Menezes
- **Relacionadas:** ADR-0025 (colocalização), ADR-0037 (textos no i18n),
  ADR-0039 (CRUD de exemplo)

## Contexto e problema

O formulário de clientes validava com as `rules` do Vuetify: funções soltas
no componente, sem tipo, que só checam e não transformam. O trim e a troca do
telefone vazio por `null` ficavam à mão no `onSubmit`, e nada garantia que o
valor enviado batia com o contrato `CustomerParams`. Cada formulário novo
repetiria isso. Qual padrão de formulário e validação o template adota?

## Drivers da decisão

- Regras declaradas uma vez, tipadas, testáveis sem montar componente.
- O valor validado sai no formato do contrato da API.
- Mensagens no i18n, nos dois locales.
- Integração simples com os campos do Vuetify.

## Opções consideradas

- **VeeValidate + Zod 4** — escolhida.
- **Só as `rules` do Vuetify** — sem dependência, mas sem tipo, sem
  transformação e com regras espalhadas por componente.
- **VeeValidate + `@vee-validate/zod`** — o adapter oficial só aceita o Zod 3
  (`peerDependencies: zod ^3.24`); usá-lo prenderia o template a uma versão
  antiga do Zod.

## Decisão

- Dependências: `vee-validate` 4.15.1 (estado do formulário e dos campos) e
  `zod` 4.6.7 (schema e transformação).
- O adapter `toTypedSchema` (`@shared/utils/form-schema`) converte um schema
  do Zod 4 no `TypedSchema` do VeeValidate, com os erros agrupados por campo
  e o valor já transformado.
- O schema de cada formulário fica no módulo (`modules/<x>/schemas.ts`) e sai
  no tipo do contrato (`satisfies z.ZodType<CustomerParams, …>`).
- As mensagens do schema são chaves de i18n: as genéricas em `validation.*`
  (locale do app) e as do módulo em `<módulo>.validation.*`. O componente as
  traduz ao exibir. O ESLint não rastreia chaves vindas de schemas, então
  `validation.*` entra nas exceções do `no-unused-keys`, e um teste confere
  que toda mensagem do schema existe em todos os locales.
- No componente: `useForm({ validationSchema, initialValues })` e
  `defineField` ligando cada campo ao `v-text-field` pelo `error-messages`. O
  erro aparece depois que o campo perde o foco ou no envio.
- O CRUD de clientes é o exemplo: `customers/schemas.ts` e o
  `CustomerForm.vue` reescrito.

## Consequências

### Positivas

- Regras e transformação num lugar só, testadas como função pura.
- O valor enviado tem o tipo do contrato, verificado pelo `tsc`.

### Negativas / trade-offs

- Duas dependências novas: cerca de 34 kB gzip a mais, só no chunk da rota do
  formulário (carregado sob demanda).
- O adapter próprio precisa acompanhar mudanças da API do Zod e do
  VeeValidate; quando o oficial aceitar o Zod 4, ele pode substituí-lo.

### Neutras

- O Vuetify continua desenhando os campos; só a validação sai dele.

## Referências

- `src/shared/utils/form-schema.ts`, `src/modules/customers/schemas.ts`,
  `src/modules/customers/components/CustomerForm.vue`.
- [VeeValidate — Typed schemas](https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/)
- [Zod 4](https://zod.dev/)
