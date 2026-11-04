/**
 * Índice de ADRs gerado a partir dos arquivos em `docs/decisions/`.
 *
 * Substitui a lista fixa da tela: uma ADR nova aparece automaticamente, sem
 * risco de a tela divergir da documentação. O conteúdo é carregado em build
 * (Vite `?raw`), apenas no chunk lazy da rota `/decisoes`.
 */
import type { Adr, AdrStatus } from './types';

const ADR_STATUSES: readonly AdrStatus[] = ['Aceita', 'Proposta', 'Substituída', 'Descontinuada'];

/** `ADR-0000-template.md` é exemplo de preenchimento, não decisão. */
const TEMPLATE_FILE = 'ADR-0000-template.md';

function isAdrStatus(value: string): value is AdrStatus {
  return (ADR_STATUSES as readonly string[]).includes(value);
}

/**
 * Extrai id, título e status de uma ADR no formato MADR do projeto:
 * `# ADR-0001: Título` e `- **Status:** Aceita`. Retorna `null` se o arquivo
 * não seguir o formato (para não exibir dados parciais).
 */
export function parseAdr(file: string, content: string): Adr | null {
  const heading = /^#\s+(ADR-\d{4}):\s*(.+)$/m.exec(content);
  const status = /^-\s+\*\*Status:\*\*\s*(.+)$/m.exec(content);
  const [, id, rawTitle] = heading ?? [];
  const rawStatus = status?.[1];
  if (id === undefined || rawTitle === undefined || rawStatus === undefined) return null;

  const statusValue = rawStatus.trim();
  if (!isAdrStatus(statusValue)) return null;

  return {
    id,
    // Remove marcação de código inline do título (ex.: `createApiInstance`).
    title: rawTitle.replace(/`/g, '').trim(),
    status: statusValue,
    file,
  };
}

/** Converte o mapa `caminho → conteúdo` do glob em lista ordenada por id. */
export function buildAdrIndex(sources: Record<string, string>): Adr[] {
  return Object.entries(sources)
    .map(([path, content]) => ({ file: path.split('/').pop() ?? path, content }))
    .filter(({ file }) => file !== TEMPLATE_FILE)
    .map(({ file, content }) => parseAdr(file, content))
    .filter((adr): adr is Adr => adr !== null)
    .sort((a, b) => a.id.localeCompare(b.id));
}

const adrSources = import.meta.glob<string>('/docs/decisions/ADR-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const adrIndex: Adr[] = buildAdrIndex(adrSources);
