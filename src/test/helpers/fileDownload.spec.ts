import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadAndSave } from '@shared/helpers/file-download';
import { saveBinaryResponse } from '@shared/utils/file-download';
import type { BinaryResponse } from '@typings/services';

vi.mock('@shared/utils/file-download', () => ({
  saveBinaryResponse: vi.fn(),
}));

describe('downloadAndSave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aguarda a resposta do service e salva o binário com o cabeçalho', async () => {
    const response: BinaryResponse = {
      blob: new Blob(['x']),
      contentDisposition: 'attachment; filename="relatorio.pdf"',
    };

    await downloadAndSave(Promise.resolve(response));

    expect(saveBinaryResponse).toHaveBeenCalledWith(response.blob, response.contentDisposition, {
      filename: undefined,
      type: undefined,
    });
  });

  it('repassa filename e type explícitos', async () => {
    const response: BinaryResponse = { blob: new Blob(['x']), contentDisposition: null };

    await downloadAndSave(Promise.resolve(response), {
      filename: 'nota.pdf',
      type: 'application/pdf',
    });

    expect(saveBinaryResponse).toHaveBeenCalledWith(response.blob, null, {
      filename: 'nota.pdf',
      type: 'application/pdf',
    });
  });

  it('propaga o erro quando o service falha', async () => {
    await expect(downloadAndSave(Promise.reject(new Error('500')))).rejects.toThrow('500');
    expect(saveBinaryResponse).not.toHaveBeenCalled();
  });
});
