import { describe, expect, it, vi } from 'vitest';
import { formatFileSize, toFormData, validateFile } from '@shared/utils/file-upload';

const pdf = (size = 10, name = 'contrato.PDF') =>
  new File(['x'.repeat(size)], name, { type: 'application/pdf' });

describe('toFormData', () => {
  it('converte texto, número e booleano e mantém o nome do arquivo', () => {
    const formData = toFormData({ file: pdf(), description: 'Contrato', version: 2, draft: false });

    expect((formData.get('file') as File).name).toBe('contrato.PDF');
    expect(formData.get('description')).toBe('Contrato');
    expect(formData.get('version')).toBe('2');
    expect(formData.get('draft')).toBe('false');
  });

  it('repete o campo para arrays e ignora null e undefined', () => {
    const formData = toFormData({
      files: [pdf(1, 'a.pdf'), pdf(1, 'b.pdf')],
      note: null,
      tag: undefined,
    });

    expect(formData.getAll('files').map((file) => (file as File).name)).toEqual(['a.pdf', 'b.pdf']);
    expect(formData.has('note')).toBe(false);
    expect(formData.has('tag')).toBe(false);
  });

  it('dá o nome do campo a um Blob sem nome', () => {
    // O happy-dom ignora o nome do Blob no FormData; confere-se o que é passado.
    const append = vi.spyOn(FormData.prototype, 'append');
    const blob = new Blob(['x']);

    toFormData({ report: blob });

    expect(append).toHaveBeenCalledWith('report', blob, 'report');
    append.mockRestore();
  });
});

describe('validateFile', () => {
  it('aceita um arquivo sem regras ou dentro delas', () => {
    expect(validateFile(pdf())).toBeNull();
    expect(validateFile(pdf(), { maxBytes: 10, accept: ['.pdf'] })).toBeNull();
  });

  it('recusa arquivo vazio', () => {
    expect(validateFile(pdf(0))).toBe('empty');
  });

  it('recusa arquivo acima do tamanho máximo', () => {
    expect(validateFile(pdf(11), { maxBytes: 10 })).toBe('tooLarge');
  });

  it('confere extensão, MIME exato e curinga, sem diferenciar maiúsculas', () => {
    const image = new File(['x'], 'foto.jpg', { type: 'image/jpeg' });

    expect(validateFile(pdf(), { accept: ['application/pdf'] })).toBeNull();
    expect(validateFile(image, { accept: ['IMAGE/*'] })).toBeNull();
    expect(validateFile(image, { accept: ['.pdf', 'application/pdf'] })).toBe('invalidType');
    expect(validateFile(pdf(), { accept: ['image/*'] })).toBe('invalidType');
  });

  it('trata accept vazio como sem restrição de tipo', () => {
    expect(validateFile(pdf(), { accept: [] })).toBeNull();
  });
});

describe('formatFileSize', () => {
  it('usa a maior unidade cabível, no formato do locale', () => {
    expect(formatFileSize(512)).toBe('512 bytes');
    expect(formatFileSize(1536)).toBe('1,5 kB');
    expect(formatFileSize(5 * 1024 ** 2)).toBe('5 MB');
    expect(formatFileSize(1536, 'en-US')).toBe('1.5 kB');
  });

  it('para no gigabyte', () => {
    expect(formatFileSize(2048 * 1024 ** 3)).toBe('2.048 GB');
  });
});
