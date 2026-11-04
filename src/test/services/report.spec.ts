import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  downloadReportRequest,
  uploadReportAttachmentRequest,
} from '@shared/api/services/report.service';
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: {
    download: vi.fn(),
    upload: vi.fn(),
  },
}));

describe('report service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('baixa o relatório pelo endpoint do recurso', async () => {
    const response = { blob: new Blob(['pdf']), contentDisposition: null };
    vi.mocked(httpClient.download).mockResolvedValue(response);

    await expect(downloadReportRequest(123)).resolves.toBe(response);
    expect(httpClient.download).toHaveBeenCalledWith('/reports/123/pdf');
  });

  it('anexa o arquivo no campo file, repassando o signal', async () => {
    const file = new File(['x'], 'anexo.pdf');
    const { signal } = new AbortController();
    const uploaded = { id: 'a1', filename: 'anexo.pdf', size: 1, contentType: 'application/pdf' };
    vi.mocked(httpClient.upload).mockResolvedValue(uploaded);

    await expect(uploadReportAttachmentRequest(123, file, { signal })).resolves.toBe(uploaded);
    expect(httpClient.upload).toHaveBeenCalledWith('/reports/123/attachments', {
      fields: { file },
      signal,
    });
  });
});
