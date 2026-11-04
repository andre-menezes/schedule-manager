import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { toTypedSchema } from '@shared/utils/form-schema';

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, { error: 'validation.required' }),
    address: z.object({
      zip: z.string().length(8, { error: 'zip' }).regex(/^\d+$/, { error: 'digits' }),
    }),
  })
);

describe('toTypedSchema', () => {
  it('é reconhecido pelo VeeValidate como schema tipado', () => {
    expect(schema.__type).toBe('VVTypedSchema');
  });

  it('devolve os valores transformados pelo schema', async () => {
    await expect(schema.parse({ name: ' Ana ', address: { zip: '30100000' } })).resolves.toEqual({
      value: { name: 'Ana', address: { zip: '30100000' } },
      errors: [],
    });
  });

  it('agrupa as mensagens por caminho, inclusive aninhado', async () => {
    const { value, errors } = await schema.parse({ name: '', address: { zip: 'abc' } });

    expect(value).toBeUndefined();
    expect(errors).toEqual([
      { path: 'name', errors: ['validation.required'] },
      { path: 'address.zip', errors: ['zip', 'digits'] },
    ]);
  });
});
