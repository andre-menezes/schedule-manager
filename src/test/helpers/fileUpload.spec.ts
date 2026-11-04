import { describe, expect, it, vi } from 'vitest';
import { FileValidationError, validateAndUpload } from '@shared/helpers/file-upload';

const file = new File(['conteúdo'], 'anexo.pdf', { type: 'application/pdf' });

describe('validateAndUpload', () => {
  it('envia o arquivo válido e devolve a resposta do service', async () => {
    const request = vi.fn().mockResolvedValue({ id: 'a1' });

    await expect(validateAndUpload(file, { accept: ['.pdf'] }, request)).resolves.toEqual({
      id: 'a1',
    });
    expect(request).toHaveBeenCalledWith(file);
  });

  it('recusa o arquivo inválido sem chamar o service', async () => {
    const request = vi.fn();
    const rules = { maxBytes: 1 };

    const error: unknown = await validateAndUpload(file, rules, request).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(FileValidationError);
    expect(error).toMatchObject({ violation: 'tooLarge', rules, name: 'FileValidationError' });
    expect(request).not.toHaveBeenCalled();
  });
});
