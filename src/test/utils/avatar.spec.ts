import { describe, expect, it } from 'vitest';
import { getInitials, hueFor } from '@shared/utils/avatar';
import { EVENT_HUES } from '@typings/theme';

describe('getInitials', () => {
  it('usa a primeira e a última palavra, em maiúsculas', () => {
    expect(getInitials('Maria da Silva Souza')).toBe('MS');
    expect(getInitials('  ana   lima ')).toBe('AL');
  });

  it('usa uma letra para um nome só e nada para texto vazio', () => {
    expect(getInitials('ana')).toBe('A');
    expect(getInitials('   ')).toBe('');
  });
});

describe('hueFor', () => {
  it('devolve sempre o mesmo matiz para o mesmo texto', () => {
    expect(hueFor('Maria Souza')).toBe(hueFor('Maria Souza'));
    expect(EVENT_HUES).toContain(hueFor('Maria Souza'));
  });

  it('espalha nomes diferentes por mais de um matiz', () => {
    const names = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Heitor'];

    expect(new Set(names.map(hueFor)).size).toBeGreaterThan(3);
  });
});
