import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import {
  parseContentDisposition,
  saveBinaryResponse,
  saveBlob,
  toBlob,
} from '@shared/utils/file-download';

describe('parseContentDisposition', () => {
  it('extrai o filename simples', () => {
    expect(parseContentDisposition('attachment; filename="relatorio.pdf"')).toBe('relatorio.pdf');
  });

  it('preserva espaços em filename entre aspas', () => {
    expect(parseContentDisposition('attachment; filename="meu relatorio final.pdf"')).toBe(
      'meu relatorio final.pdf'
    );
  });

  it('extrai o filename sem aspas', () => {
    expect(parseContentDisposition('attachment; filename=nota.xml')).toBe('nota.xml');
  });

  it('prioriza filename* (RFC 5987) e decodifica', () => {
    const header = 'attachment; filename="fallback.pdf"; filename*=UTF-8\'\'nota%20final.pdf';
    expect(parseContentDisposition(header)).toBe('nota final.pdf');
  });

  it('usa o fallback quando o cabeçalho não informa o nome do arquivo', () => {
    expect(parseContentDisposition('attachment')).toBe('download');
    expect(parseContentDisposition('inline; size=120', 'relatorio.pdf')).toBe('relatorio.pdf');
  });

  it('usa o fallback quando o cabeçalho é ausente', () => {
    expect(parseContentDisposition(null)).toBe('download');
    expect(parseContentDisposition(undefined, 'custom.bin')).toBe('custom.bin');
  });
});

describe('toBlob', () => {
  it('mantém o Blob quando já tem type', () => {
    const original = new Blob(['x'], { type: 'application/pdf' });
    expect(toBlob(original)).toBe(original);
  });

  it('aplica o type a um Blob sem type', () => {
    const original = new Blob(['x']);
    const result = toBlob(original, 'application/pdf');
    expect(result.type).toBe('application/pdf');
  });

  it('converte ArrayBuffer em Blob sem type quando nenhum é informado', () => {
    const result = toBlob(new ArrayBuffer(8));

    expect(result.size).toBe(8);
    expect(result.type).toBe('');
  });

  it('converte ArrayBuffer em Blob com o type informado', () => {
    const result = toBlob(new ArrayBuffer(8), 'application/octet-stream');
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/octet-stream');
  });
});

describe('saveBlob / saveBinaryResponse', () => {
  const createObjectURL = vi.fn(() => 'blob:mock-url');
  const revokeObjectURL = vi.fn();
  let clickSpy: MockInstance<HTMLAnchorElement['click']>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    clickSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('cria um link temporário, dispara o clique e revoga o object URL', () => {
    const blob = new Blob(['conteúdo'], { type: 'text/plain' });

    saveBlob(blob, 'arquivo.txt');

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalledOnce();
    // revogação é agendada em setTimeout
    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('resolve o nome pelo Content-Disposition quando não há filename explícito', () => {
    const anchorSpy = vi.spyOn(document, 'createElement');

    saveBinaryResponse(new Blob(['x']), 'attachment; filename="do-header.pdf"');

    const anchor = anchorSpy.mock.results.find((r) => r.value instanceof HTMLAnchorElement)
      ?.value as HTMLAnchorElement;
    expect(anchor.download).toBe('do-header.pdf');
    anchorSpy.mockRestore();
  });

  it('prioriza o filename explícito sobre o cabeçalho', () => {
    const anchorSpy = vi.spyOn(document, 'createElement');

    saveBinaryResponse(new Blob(['x']), 'attachment; filename="do-header.pdf"', {
      filename: 'escolhido.pdf',
    });

    const anchor = anchorSpy.mock.results.find((r) => r.value instanceof HTMLAnchorElement)
      ?.value as HTMLAnchorElement;
    expect(anchor.download).toBe('escolhido.pdf');
    anchorSpy.mockRestore();
  });
});
