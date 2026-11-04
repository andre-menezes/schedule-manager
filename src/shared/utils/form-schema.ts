/**
 * Ponte entre um schema do Zod 4 e o `validationSchema` do VeeValidate
 * (ADR-0042). O `@vee-validate/zod` oficial só aceita o Zod 3; este adapter
 * cobre o que o template usa: validar e devolver os valores já
 * transformados pelo schema (trim, `null` etc.).
 *
 * As mensagens dos schemas são chaves de i18n (`error: 'form.required'`): o
 * componente as traduz na hora de exibir, então o schema não depende do
 * locale e pode ser testado como função pura.
 */
import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import type { z } from 'zod';

/** Junta as mensagens do Zod por campo, no formato do VeeValidate. */
function toFieldErrors(issues: z.core.$ZodIssue[]): TypedSchemaError[] {
  const byPath = new Map<string, string[]>();
  for (const issue of issues) {
    const path = issue.path.map(String).join('.');
    byPath.set(path, [...(byPath.get(path) ?? []), issue.message]);
  }
  return [...byPath].map(([path, errors]) => ({ path, errors }));
}

/**
 * Converte um schema do Zod no `TypedSchema` do VeeValidate.
 *
 * @example
 * const { handleSubmit } = useForm({ validationSchema: toTypedSchema(customerFormSchema) });
 */
export function toTypedSchema<TSchema extends z.ZodType>(
  schema: TSchema
): TypedSchema<z.input<TSchema>, z.output<TSchema>> {
  return {
    __type: 'VVTypedSchema',
    async parse(values) {
      const result = await schema.safeParseAsync(values);
      return result.success
        ? { value: result.data, errors: [] }
        : { errors: toFieldErrors(result.error.issues) };
    },
  };
}
