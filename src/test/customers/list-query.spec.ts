import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE } from '@core/config';
import { parseListQuery, toListQuery } from '@modules/customers/list-query';
import { isNotFoundError } from '@modules/customers/errors';

// A paginação em si é coberta em `src/test/utils/pagination.spec.ts`.
describe('parseListQuery', () => {
  it('junta a paginação e a busca, sem espaços nas pontas', () => {
    expect(parseListQuery({ page: '3', pageSize: '25', search: ' ana ' })).toEqual({
      page: 3,
      pageSize: 25,
      search: 'ana',
    });
  });

  it('omite a busca vazia', () => {
    expect(parseListQuery({ search: '  ' })).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });
});

describe('toListQuery', () => {
  it('omite os valores padrão e a busca vazia', () => {
    expect(toListQuery({ page: 1, pageSize: DEFAULT_PAGE_SIZE, search: '' })).toEqual({});
  });

  it('escreve a página e a busca', () => {
    expect(toListQuery({ page: 2, pageSize: 50, search: 'ana' })).toEqual({
      page: '2',
      pageSize: '50',
      search: 'ana',
    });
  });
});

describe('isNotFoundError', () => {
  it('reconhece só respostas 404', () => {
    expect(isNotFoundError({ status: 404 })).toBe(true);
    expect(isNotFoundError({ status: 500 })).toBe(false);
    expect(isNotFoundError(null)).toBe(false);
    expect(isNotFoundError('404')).toBe(false);
  });
});
