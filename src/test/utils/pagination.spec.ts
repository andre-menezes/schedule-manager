import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@core/config';
import { firstQueryValue, parsePageParams, toPageQuery } from '@shared/utils/pagination';

describe('firstQueryValue', () => {
  it('devolve o primeiro valor, sem espaços nas pontas', () => {
    expect(firstQueryValue(' ana ')).toBe('ana');
    expect(firstQueryValue(['2', '9'])).toBe('2');
  });

  it('devolve texto vazio para parâmetro ausente ou nulo', () => {
    expect(firstQueryValue(undefined)).toBe('');
    expect(firstQueryValue(null)).toBe('');
    expect(firstQueryValue([null])).toBe('');
  });
});

describe('parsePageParams', () => {
  it('usa a primeira página e o tamanho padrão sem query', () => {
    expect(parsePageParams({})).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });

  it('lê página e tamanho', () => {
    expect(parsePageParams({ page: '3', pageSize: '25' })).toEqual({ page: 3, pageSize: 25 });
  });

  it('ignora valores que não são inteiros positivos', () => {
    expect(parsePageParams({ page: '-2', pageSize: 'abc' })).toEqual({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    expect(parsePageParams({ page: '1.5', pageSize: '0' })).toEqual({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  });

  it('limita o tamanho da página a MAX_PAGE_SIZE', () => {
    expect(parsePageParams({ pageSize: '5000' }).pageSize).toBe(MAX_PAGE_SIZE);
  });
});

describe('toPageQuery', () => {
  it('omite os valores padrão', () => {
    expect(toPageQuery({ page: 1, pageSize: DEFAULT_PAGE_SIZE })).toEqual({});
  });

  it('escreve o que difere do padrão', () => {
    expect(toPageQuery({ page: 2, pageSize: 50 })).toEqual({ page: '2', pageSize: '50' });
  });

  it('volta ao mesmo estado ao ler a query que montou', () => {
    const params = { page: 4, pageSize: 25 };

    expect(parsePageParams(toPageQuery(params))).toEqual(params);
  });
});
