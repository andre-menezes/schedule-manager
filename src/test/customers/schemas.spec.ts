import { describe, expect, it } from 'vitest';
import { createAppI18n } from '@app/providers/i18n';
import { SUPPORTED_LOCALES } from '@core/config';
import { NAME_MAX_LENGTH, customerFormSchema, toFormValues } from '@modules/customers/schemas';

const valid = { name: 'Maria', email: 'maria@example.com', phone: '', active: true };

/** Mensagens que o schema devolve para um valor inválido. */
function messages(values: object): string[] {
  const result = customerFormSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map(({ message }) => message);
}

describe('customerFormSchema', () => {
  it('limpa os textos e troca o telefone vazio por null', () => {
    expect(customerFormSchema.parse({ ...valid, name: ' Maria ', phone: '  ' })).toEqual({
      name: 'Maria',
      email: 'maria@example.com',
      phone: null,
      active: true,
    });
  });

  it('exige nome e e-mail, e e-mail válido', () => {
    expect(messages({ ...valid, name: '  ', email: '' })).toEqual([
      'validation.required',
      'validation.required',
    ]);
    expect(messages({ ...valid, email: 'maria@' })).toEqual(['validation.email']);
  });

  it('limita o tamanho do nome', () => {
    expect(messages({ ...valid, name: 'a'.repeat(NAME_MAX_LENGTH) })).toEqual([]);
    expect(messages({ ...valid, name: 'a'.repeat(NAME_MAX_LENGTH + 1) })).toEqual([
      'customers.validation.nameTooLong',
    ]);
  });

  it('toda mensagem do schema é uma chave existente em todos os locales', () => {
    const keys = ['validation.required', 'validation.email', 'customers.validation.nameTooLong'];
    const invalid = [
      { name: '', email: '' },
      { email: 'x' },
      { name: 'a'.repeat(NAME_MAX_LENGTH + 1) },
    ];
    const produced = new Set(invalid.flatMap((values) => messages({ ...valid, ...values })));

    expect([...produced].sort()).toEqual(keys.sort());
    for (const locale of SUPPORTED_LOCALES) {
      const { te } = createAppI18n(locale).global;
      expect(keys.filter((key) => !te(key, locale))).toEqual([]);
    }
  });
});

describe('toFormValues', () => {
  it('começa em branco e ativo no cadastro', () => {
    expect(toFormValues()).toEqual({ name: '', email: '', phone: '', active: true });
  });

  it('usa o cliente na edição, com telefone nulo como texto vazio', () => {
    expect(toFormValues({ name: 'Maria', email: 'm@x.com', phone: null, active: false })).toEqual({
      name: 'Maria',
      email: 'm@x.com',
      phone: '',
      active: false,
    });
  });
});
